import { supabaseAdmin } from "@/lib/supabase-admin";

// Per-device NGN rates — MUST match PLAN_PRICING on the preorder page and the
// rates the preorder route charges with. Keep this the single source of truth.
export const PLAN_RATES = {
  family: 210000,
  school: 84000,
};

// Orders that have actually paid count as a redemption (abandoned checkouts
// must not consume a code's cap or inflate a member's attribution).
const PAID_STATUS = "fully_paid";

/** Pre-discount order total in NGN. Falls back to the school rate, matching the route. */
export function subtotalFor(plan, deviceCount) {
  const rate = PLAN_RATES[plan] ?? PLAN_RATES.school;
  return rate * deviceCount;
}

/** Discount in NGN for a given code + subtotal, never exceeding the subtotal. */
export function computeDiscount(promo, subtotalNGN) {
  const value = Number(promo.discount_value) || 0;
  const raw =
    promo.discount_type === "percent"
      ? Math.round((subtotalNGN * value) / 100)
      : Math.round(value);
  return Math.max(0, Math.min(raw, subtotalNGN));
}

/**
 * Server-authoritative promo validation. Looks up the code, checks it is
 * active / within window / under its redemption cap, and computes the discount
 * against the trusted server subtotal.
 *
 * @returns {Promise<{ ok: true, promo, discount_ngn, total_ngn } | { ok: false, error: string }>}
 */
export async function validatePromoCode(rawCode, subtotalNGN) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a promo code." };

  const { data: promo, error } = await supabaseAdmin
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) throw error;
  if (!promo) return { ok: false, error: "That promo code isn't valid." };
  if (!promo.active) return { ok: false, error: "This promo code is no longer active." };

  const now = Date.now();
  if (promo.starts_at && new Date(promo.starts_at).getTime() > now)
    return { ok: false, error: "This promo code isn't active yet." };
  if (promo.expires_at && new Date(promo.expires_at).getTime() < now)
    return { ok: false, error: "This promo code has expired." };

  if (promo.max_redemptions != null) {
    const { count } = await supabaseAdmin
      .from("k12_preorders")
      .select("id", { count: "exact", head: true })
      .eq("promo_code_id", promo.id)
      .eq("payment_status", PAID_STATUS);
    if ((count ?? 0) >= promo.max_redemptions)
      return { ok: false, error: "This promo code has reached its limit." };
  }

  const discount = computeDiscount(promo, subtotalNGN);
  if (discount <= 0)
    return { ok: false, error: "This code doesn't apply to your order." };

  return { ok: true, promo, discount_ngn: discount, total_ngn: subtotalNGN - discount };
}
