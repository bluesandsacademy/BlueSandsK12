import { NextResponse } from "next/server";
import { validatePromoCode, subtotalFor } from "@/lib/promo";

// Public endpoint: lets the checkout preview a promo discount live. Pricing is
// computed from the trusted server rates, never from anything the client sends.
export async function POST(request) {
  try {
    const { code, selected_plan, device_count } = await request.json();

    const qty = parseInt(device_count, 10);
    if (!qty || qty < 1)
      return NextResponse.json({ ok: false, error: "Add at least one device first." }, { status: 400 });

    const subtotal = subtotalFor(selected_plan, qty);
    const result = await validatePromoCode(code, subtotal);

    if (!result.ok) return NextResponse.json({ ok: false, error: result.error });

    // Deliberately does NOT expose the member's identity to the public.
    return NextResponse.json({
      ok: true,
      code: result.promo.code,
      discount_type: result.promo.discount_type,
      discount_value: Number(result.promo.discount_value),
      subtotal_ngn: subtotal,
      discount_ngn: result.discount_ngn,
      total_ngn: result.total_ngn,
    });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/promo/validate]", err);
    return NextResponse.json({ ok: false, error: "Could not validate that code." }, { status: 500 });
  }
}
