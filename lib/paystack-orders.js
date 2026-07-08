import { supabaseAdmin } from "@/lib/supabase-admin";
import { products, TABLET_NGN } from "@/lib/products";

/*
 * Ingests a Paystack Storefront order (a charge.success that isn't a bls
 * preorder) into `paystack_orders` for the fulfilment back-office.
 *
 * VERIFIED against a real Storefront order (ref T312201560638617, 2026-07-08):
 * the charge.success payload carries NO line items and NO discount code. Its
 * metadata is only `{ referrer }`, `order_id` is null, and
 * GET /transaction/verify/:reference returns exactly the same. Storefront is
 * also the only event Paystack emits for a purchase.
 *
 * The charged amount is therefore the sole product signal, so we reverse it
 * against the known price combinations below. The full event is always stored
 * in `raw_payload`, so anything here can be re-derived later.
 */
export async function ingestStorefrontCharge(event) {
  const d = event?.data || {};
  const reference = d.reference;
  if (!reference) return;

  const discountCode = extractDiscountCode(d);

  // Map the Paystack discount code → the team member who owns it.
  let promoCodeId = null;
  if (discountCode) {
    const { data: promo } = await supabaseAdmin
      .from("promo_codes")
      .select("id")
      .eq("code", discountCode.toUpperCase())
      .maybeSingle();
    promoCodeId = promo?.id ?? null;
  }

  const row = {
    paystack_reference: reference,
    event:              event.event ?? null,
    customer_name:      [d.customer?.first_name, d.customer?.last_name].filter(Boolean).join(" ") || null,
    customer_email:     d.customer?.email ?? null,
    customer_phone:     d.customer?.phone ?? null,
    amount:             typeof d.amount === "number" ? d.amount / 100 : null,
    currency:           d.currency ?? null,
    discount_code:      discountCode,
    promo_code_id:      promoCodeId,
    product_summary:    extractProductSummary(d),
    paystack_status:    d.status ?? null,
    raw_payload:        event,
    paid_at:            d.paid_at || d.paidAt || null,
    updated_at:         new Date().toISOString(),
  };

  // Upsert by reference so webhook retries never create duplicates, and never
  // clobber a fulfilment status an admin has already set.
  await supabaseAdmin
    .from("paystack_orders")
    .upsert(row, { onConflict: "paystack_reference", ignoreDuplicates: false });
}

/*
 * Amount → product label. Storefront gives us nothing else, so we index every
 * amount a single-item order can produce and refuse to guess when two of them
 * collide. Returns null for anything unrecognised: a multi-item cart, qty > 1,
 * a discounted total, or an amount with shipping added. A null `product_summary`
 * means "look it up in the Paystack dashboard", which is correct behaviour —
 * far better than confidently labelling an order with the wrong kit.
 */
const AMOUNT_INDEX = (() => {
  const index = new Map();
  const add = (ngn, label) => {
    // Second sighting of an amount makes it ambiguous — poison the entry.
    index.set(ngn, index.has(ngn) ? null : label);
  };
  add(TABLET_NGN, "1× Smart Tablet");
  for (const p of products) {
    add(p.priceNGN, `1× ${p.name}`);
    add(p.priceNGN + TABLET_NGN, `1× ${p.name} + 1× Smart Tablet`);
  }
  return index;
})();

// PROVISIONAL — scans the spots a discount code is most likely to appear.
function extractDiscountCode(d) {
  const meta = d.metadata || {};
  const direct = meta.discount_code || meta.discount || meta.coupon || d.discount_code;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const fields = Array.isArray(meta.custom_fields) ? meta.custom_fields : [];
  for (const f of fields) {
    const key = String(f?.variable_name || f?.display_name || "").toLowerCase();
    if (/(discount|coupon|promo|code)/.test(key) && f?.value) return String(f.value).trim();
  }
  return null;
}

// Prefers real line items (Paystack does not send them today, but might one
// day); otherwise falls back to reversing the charged amount.
function extractProductSummary(d) {
  const meta = d.metadata || {};
  const items = meta.products || meta.line_items || meta.cart || meta.items;
  if (Array.isArray(items) && items.length > 0) {
    return items
      .map((it) => {
        const name = it?.name || it?.product_name || it?.title || "item";
        const qty = it?.quantity ?? it?.qty ?? 1;
        const variant = it?.variant || it?.variant_name || it?.option || "";
        return `${qty}× ${name}${variant ? ` (${variant})` : ""}`;
      })
      .join(", ");
  }

  if (typeof d.amount !== "number") return null;
  return AMOUNT_INDEX.get(d.amount / 100) ?? null;
}
