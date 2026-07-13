import { supabaseAdmin } from "@/lib/supabase-admin";
import { products, TABLET_NGN } from "@/lib/products";

/*
 * Storefront order ingestion into `paystack_orders` (the fulfilment back-office).
 *
 * Two entry points, one shared upsert:
 *   1. ingestStorefrontCharge(event)  — real-time, from the charge.success webhook.
 *   2. reconcileStorefrontOrders()    — safety net, pulls anything the webhook
 *      missed (e.g. the endpoint was down / a tunnel was dead) straight from
 *      Paystack. Run on the admin Store Orders page load so it self-heals.
 *
 * The charge.success webhook carries NO line items (verified: metadata is only
 * `{ referrer }`). Paystack's `GET /order` DOES — items[], shipping, discount —
 * so both paths resolve the full order from that API and only fall back to the
 * amount-only event payload if the API is unreachable.
 */

const PAYSTACK_BASE = "https://api.paystack.co";
function authHeaders() {
  return { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` };
}

// ── Paystack reads ──────────────────────────────────────────────────────────
async function fetchOrders(page = 1, perPage = 50) {
  const res = await fetch(`${PAYSTACK_BASE}/order?perPage=${perPage}&page=${page}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Paystack /order ${res.status}`);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

// An order carries a numeric `transaction` id, not the T-reference we key on.
// Resolve it so webhook-ingested and reconciled rows share one unique key.
async function fetchTransactionReference(transactionId) {
  if (!transactionId) return null;
  const res = await fetch(`${PAYSTACK_BASE}/transaction/${transactionId}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.reference ?? null;
}

async function findOrderByTransaction(transactionId) {
  if (!transactionId) return null;
  // A just-paid order is the newest, so page 1 is enough. (?transaction= is
  // ignored by Paystack, so we filter client-side.)
  const orders = await fetchOrders(1, 50);
  return orders.find((o) => o.transaction === transactionId) || null;
}

// ── Extraction ──────────────────────────────────────────────────────────────
function summariseItems(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return items.map((it) => `${it.quantity ?? 1}× ${it.name || "item"}`).join(", ");
}

// Best-effort: the no-discount order had `discounts: null`. Confirm the shape
// against a real discounted order before trusting attribution.
function extractOrderDiscount(order) {
  const d = order?.discounts;
  if (Array.isArray(d) && d[0]) return d[0].code || d[0].coupon_code || null;
  if (d && typeof d === "object") return d.code || null;
  return null;
}

async function resolvePromoCodeId(discountCode) {
  if (!discountCode) return null;
  const { data: promo } = await supabaseAdmin
    .from("promo_codes")
    .select("id")
    .eq("code", discountCode.toUpperCase())
    .maybeSingle();
  return promo?.id ?? null;
}

// ── Shared upsert ───────────────────────────────────────────────────────────
// Upsert by reference so webhook retries + reconciliation never duplicate, and
// never clobber a fulfilment status an admin has already set.
async function saveOrder(row) {
  await supabaseAdmin
    .from("paystack_orders")
    .upsert(row, { onConflict: "paystack_reference", ignoreDuplicates: false });
}

// Rich path — from a full Paystack order object (has items + shipping).
async function upsertFromOrder(order, reference) {
  const discountCode = extractOrderDiscount(order);
  const row = {
    paystack_reference: reference,
    event:              "charge.success",
    customer_name:      order.customer_name || null,
    customer_email:     order.email || null,
    customer_phone:     order.shipping?.phone || order.phone || null,
    amount:             typeof order.amount === "number" ? order.amount / 100 : null,
    currency:           order.currency || null,
    discount_code:      discountCode,
    promo_code_id:      await resolvePromoCodeId(discountCode),
    product_summary:    summariseItems(order.items),
    paystack_status:    order.status || null,
    raw_payload:        order, // full order incl. shipping address (no dedicated column yet)
    paid_at:            order.paid_at || order.updatedAt || null,
    updated_at:         new Date().toISOString(),
  };
  await saveOrder(row);
}

// Fallback path — from the amount-only webhook event when the order API is down.
async function upsertFromEvent(event) {
  const d = event?.data || {};
  const amountNGN = typeof d.amount === "number" ? d.amount / 100 : null;
  const row = {
    paystack_reference: d.reference,
    event:              event.event ?? null,
    customer_name:      [d.customer?.first_name, d.customer?.last_name].filter(Boolean).join(" ") || null,
    customer_email:     d.customer?.email ?? null,
    customer_phone:     d.customer?.phone ?? null,
    amount:             amountNGN,
    currency:           d.currency ?? null,
    discount_code:      null,
    promo_code_id:      null,
    product_summary:    amountNGN != null ? AMOUNT_INDEX.get(amountNGN) ?? null : null,
    paystack_status:    d.status ?? null,
    raw_payload:        event,
    paid_at:            d.paid_at || d.paidAt || null,
    updated_at:         new Date().toISOString(),
  };
  await saveOrder(row);
}

// ── Entry points ────────────────────────────────────────────────────────────
/* Real-time ingestion from the charge.success webhook. */
export async function ingestStorefrontCharge(event) {
  const reference = event?.data?.reference;
  if (!reference) return;

  const order = await findOrderByTransaction(event.data.id).catch(() => null);
  if (order) {
    await upsertFromOrder(order, reference);
    return;
  }
  // Order API unreachable — record the sale from the event so it isn't lost;
  // reconciliation on the next admin load will enrich it with line items.
  await upsertFromEvent(event);
}

/*
 * Pulls paid storefront orders from Paystack and ingests any we don't already
 * have. Bounded by the newest order we've stored, so steady-state cost is ~zero.
 * Best-effort — the caller must not let a Paystack error break the page.
 */
export async function reconcileStorefrontOrders({ limit = 50 } = {}) {
  const { data: latest } = await supabaseAdmin
    .from("paystack_orders")
    .select("paid_at")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const since = latest?.paid_at ? new Date(latest.paid_at).getTime() : 0;

  const orders = await fetchOrders(1, limit); // newest first
  let ingested = 0;
  for (const order of orders) {
    if (order.status !== "paid") continue;
    const ts = new Date(order.paid_at || order.createdAt || 0).getTime();
    if (ts <= since) break; // reached already-known orders

    const reference = await fetchTransactionReference(order.transaction);
    if (!reference) continue;
    await upsertFromOrder(order, reference);
    ingested++;
  }
  return ingested;
}

/*
 * Amount → product label. Only used by the webhook fallback (upsertFromEvent),
 * when the order API is unreachable and we have nothing but the charged amount.
 * Returns null on collision or anything unrecognised rather than mislabel.
 */
const AMOUNT_INDEX = (() => {
  const index = new Map();
  const add = (ngn, label) => index.set(ngn, index.has(ngn) ? null : label);
  add(TABLET_NGN, "1× Smart Tablet");
  for (const p of products) {
    add(p.priceNGN, `1× ${p.name}`);
    add(p.priceNGN + TABLET_NGN, `1× ${p.name} + 1× Smart Tablet`);
  }
  return index;
})();
