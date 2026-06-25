import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";
import { sendTrackingNotification } from "@/lib/resend";

const PLAN_LABEL = { family: "Smart Family STEM Pack", school: "Smart Classroom Starter" };

export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { preorder_id, email_type } = await request.json();

  if (!preorder_id || !email_type)
    return NextResponse.json({ error: "preorder_id and email_type are required" }, { status: 400 });

  const { data: preorder, error: fetchErr } = await supabaseAdmin
    .from("k12_preorders")
    .select("*")
    .eq("id", preorder_id)
    .single();

  if (fetchErr || !preorder)
    return NextResponse.json({ error: "Preorder not found" }, { status: 404 });

  let emailResult;
  let subject;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    if (email_type === "tracking_update") {
      const { data: tracking } = await supabaseAdmin
        .from("order_tracking")
        .select("*")
        .eq("preorder_id", preorder_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!tracking) {
        return NextResponse.json({ error: "No tracking info found for this order" }, { status: 400 });
      }

      emailResult = await sendTrackingNotification({
        to:             preorder.email,
        customerName:   preorder.full_name,
        plan:           PLAN_LABEL[preorder.selected_plan] || preorder.selected_plan,
        trackingNumber: tracking.tracking_number,
        trackingUrl:    tracking.tracking_url,
        provider:       tracking.logistics_provider,
        trackPageUrl:   `${siteUrl}/track?ref=BSL-${preorder_id.slice(0, 8).toUpperCase()}`,
      });

      subject = "Your Order is On the Way!";
    } else {
      return NextResponse.json({ error: "Unknown email_type" }, { status: 400 });
    }

    // Log the email
    await supabaseAdmin.from("email_logs").insert({
      preorder_id,
      recipient:  preorder.email,
      subject,
      email_type,
      resend_id:  emailResult?.data?.id || null,
      status:     "sent",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/admin/email]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
