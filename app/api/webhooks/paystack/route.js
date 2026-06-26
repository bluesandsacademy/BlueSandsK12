import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmation, sendAdminPaymentAlert } from "@/lib/resend";
import { ingestStorefrontCharge } from "@/lib/paystack-orders";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    const signatureValid = hash === signature;

    // ── SPIKE (temporary): capture the full payload of every Paystack event so
    // we can inspect what a real Storefront order carries (line items, discount
    // code, etc.). Best-effort and isolated — it must never break the live
    // preorder confirmation below. Remove once the Storefront integration ships.
    try {
      let parsed = null;
      try { parsed = JSON.parse(rawBody); } catch { /* non-JSON body */ }
      await supabaseAdmin.from("paystack_webhook_logs").insert({
        event:           parsed?.event ?? null,
        reference:       parsed?.data?.reference ?? null,
        signature_valid: signatureValid,
        payload:         parsed ?? { raw_body: rawBody },
      });
    } catch (logErr) {
      console.error("[paystack webhook] spike log failed:", logErr);
    }

    if (!signatureValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const { reference, metadata, amount } = event.data;
      const amountNGN = amount / 100;

      // Find the payment record
      const { data: payment } = await supabaseAdmin
        .from("order_payments")
        .select("id, preorder_id, payment_type")
        .eq("paystack_ref", reference)
        .single();

      if (!payment) {
        // Not a bls preorder charge → it's a Paystack Storefront order. Ingest
        // it into the fulfilment back-office. Wrapped so it can never break the
        // webhook response.
        try {
          await ingestStorefrontCharge(event);
        } catch (e) {
          console.error("[paystack webhook] storefront ingest failed:", e);
        }
        return NextResponse.json({ received: true });
      }

      // Update payment record
      await supabaseAdmin
        .from("order_payments")
        .update({ paystack_status: "success", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      // Full payment only — mark order fully paid
      const { data: preorder } = await supabaseAdmin
        .from("k12_preorders")
        .update({ payment_status: "fully_paid" })
        .eq("id", payment.preorder_id)
        .select("full_name, email, selected_plan, device_count, payment_option")
        .single();

      // Send customer confirmation email
      if (preorder?.email) {
        const planLabel = preorder.selected_plan === "family" ? "Smart Family STEM Pack" : "Smart Classroom Starter";

        await sendOrderConfirmation({
          to:          preorder.email,
          customerName: preorder.full_name,
          plan:        planLabel,
          deviceCount: preorder.device_count,
          amountPaid:  amountNGN,
          paymentType: "full",
          orderId:     payment.preorder_id,
        }).catch((err) => console.error("[paystack webhook] Customer email error:", err));

        await supabaseAdmin.from("email_logs").insert({
          preorder_id: payment.preorder_id,
          recipient:   preorder.email,
          subject:     "Order Confirmed — Blue Sands K12 AR Pedia",
          email_type:  "order_confirmation",
          status:      "sent",
        });

        // Notify admin
        await sendAdminPaymentAlert({
          paymentType:   payment.payment_type,
          amountNGN,
          customerName:  preorder.full_name,
          customerEmail: preorder.email,
          plan:          planLabel,
          deviceCount:   preorder.device_count,
          orderId:       payment.preorder_id,
        }).catch((err) => console.error("[paystack webhook] Admin alert error:", err));
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[POST /api/webhooks/paystack]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
