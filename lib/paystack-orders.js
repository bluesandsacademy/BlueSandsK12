import { supabaseAdmin } from "@/lib/supabase-admin";

/*
 * Ingests a Paystack Storefront order (a charge.success that isn't a bls
 * preorder) into `paystack_orders` for the fulfilment back-office.
 *
 * The full event is always stored in `raw_payload`, so the best-effort
 * extraction below can be re-derived later. The discount-code and product
 * locations are PROVISIONAL — they'll be confirmed against the first real
 * Storefront order, then this file is the only thing that needs adjusting.
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

// PROVISIONAL — builds a readable line-item summary if products are present.
function extractProductSummary(d) {
  const meta = d.metadata || {};
  const items = meta.products || meta.line_items || meta.cart || meta.items;
  if (!Array.isArray(items) || items.length === 0) return null;
  return items
    .map((it) => {
      const name = it?.name || it?.product_name || it?.title || "item";
      const qty = it?.quantity ?? it?.qty ?? 1;
      const variant = it?.variant || it?.variant_name || it?.option || "";
      return `${qty}× ${name}${variant ? ` (${variant})` : ""}`;
    })
    .join(", ");
}
