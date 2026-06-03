import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendTrackingNotification } from "@/lib/resend";

export async function POST(request) {
  try {
    const secret = process.env.LOGISTICS_WEBHOOK_SECRET;
    const incoming = request.headers.get("x-webhook-secret") || request.headers.get("authorization")?.replace("Bearer ", "");

    if (secret && incoming !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await request.json();

    // Normalize the payload — adapt field names when provider is chosen
    const {
      tracking_number,
      status,        // provider's status string
      location,
      description,
      timestamp,
    } = event;

    if (!tracking_number) {
      return NextResponse.json({ error: "Missing tracking_number" }, { status: 400 });
    }

    // Find tracking record
    const { data: tracking } = await supabaseAdmin
      .from("order_tracking")
      .select("id, preorder_id")
      .eq("tracking_number", tracking_number)
      .single();

    if (!tracking) {
      console.warn(`[logistics webhook] No tracking record for: ${tracking_number}`);
      return NextResponse.json({ received: true });
    }

    // Update tracking status
    await supabaseAdmin
      .from("order_tracking")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", tracking.id);

    // If delivered, update order status too
    if (status === "delivered") {
      await supabaseAdmin
        .from("k12_preorders")
        .update({ order_status: "delivered" })
        .eq("id", tracking.preorder_id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[POST /api/webhooks/logistics]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
