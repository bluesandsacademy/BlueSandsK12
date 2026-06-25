import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyTransaction } from "@/lib/paystack";
import { sendOrderConfirmation, sendAdminPaymentAlert } from "@/lib/resend";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref        = searchParams.get("ref");
  const preorderId = searchParams.get("preorder_id");

  if (!ref) return NextResponse.json({ success: false, error: "Missing reference" }, { status: 400 });

  try {
    const txData = await verifyTransaction(ref);

    if (txData.status !== "success") {
      return NextResponse.json({ success: false, error: "Payment not successful" });
    }

    // Update payment record if not already done (webhook may have beaten us here)
    const { data: payment } = await supabaseAdmin
      .from("order_payments")
      .select("id, payment_type, preorder_id, paystack_status")
      .eq("paystack_ref", ref)
      .single();

    // Webhook may have already processed this — only act if it hasn't
    if (payment && payment.paystack_status !== "success") {
      const amountNGN = txData.amount / 100;

      await supabaseAdmin
        .from("order_payments")
        .update({ paystack_status: "success", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      const { data: preorder } = await supabaseAdmin
        .from("k12_preorders")
        .update({ payment_status: "fully_paid" })
        .eq("id", payment.preorder_id)
        .select("full_name, email, selected_plan, device_count")
        .single();

      if (preorder?.email) {
        const planLabel    = preorder.selected_plan === "family" ? "Smart Family STEM Pack" : "Smart Classroom Starter";

        await sendOrderConfirmation({
          to:           preorder.email,
          customerName: preorder.full_name,
          plan:         planLabel,
          deviceCount:  preorder.device_count,
          amountPaid:   amountNGN,
          paymentType:  "full",
          orderId:      payment.preorder_id,
        }).catch((err) => console.error("[verify-payment] Customer email error:", err));

        await supabaseAdmin.from("email_logs").insert({
          preorder_id: payment.preorder_id,
          recipient:   preorder.email,
          subject:     "Order Confirmed — Blue Sands K12 AR Pedia",
          email_type:  "order_confirmation",
          status:      "sent",
        });

        await sendAdminPaymentAlert({
          paymentType:   payment.payment_type,
          amountNGN,
          customerName:  preorder.full_name,
          customerEmail: preorder.email,
          plan:          planLabel,
          deviceCount:   preorder.device_count,
          orderId:       payment.preorder_id,
        }).catch((err) => console.error("[verify-payment] Admin alert error:", err));
      }
    }

    return NextResponse.json({
      success:      true,
      payment_type: payment?.payment_type ?? txData.metadata?.payment_type ?? "full",
    });
  } catch (err) {
    console.error("[GET /api/k12-ar-pedia/verify-payment]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
