import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";
import { createShipment } from "@/lib/logistics";
import { sendTrackingNotification } from "@/lib/resend";

export async function POST(request, { params }) {
  const { error: authError, user } = await requireAdmin();
  if (authError) return authError;

  const { id: preorder_id } = await params;
  const body = await request.json();
  const { mode } = body;

  const { data: preorder } = await supabaseAdmin
    .from("k12_preorders")
    .select("full_name, email, address_line1, address_line2, city, state, postal_code, phone")
    .eq("id", preorder_id)
    .single();

  if (!preorder) return NextResponse.json({ error: "Preorder not found" }, { status: 404 });

  let trackingRow;

  if (mode === "auto") {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const shipment = await createShipment({
      preorderId:    preorder_id,
      senderInfo:    { name: "Blue Sands STEM Labs", address: "Lagos, Nigeria" },
      recipientInfo: {
        name:    preorder.full_name,
        phone:   preorder.phone,
        address: [preorder.address_line1, preorder.address_line2].filter(Boolean).join(", "),
        city:    preorder.city,
        state:   preorder.state,
        postal:  preorder.postal_code,
      },
      parcelInfo: body.parcel || {},
    });

    trackingRow = {
      preorder_id,
      tracking_number:    shipment.tracking_number,
      logistics_provider: process.env.LOGISTICS_PROVIDER,
      tracking_url:       shipment.tracking_url,
      estimated_delivery: shipment.estimated_delivery || null,
      status:             "dispatched",
      updated_by:         user.email,
    };
  } else {
    // Manual mode
    const { tracking_number, logistics_provider, tracking_url, estimated_delivery } = body;
    if (!tracking_number) return NextResponse.json({ error: "tracking_number is required" }, { status: 400 });

    trackingRow = {
      preorder_id,
      tracking_number,
      logistics_provider: logistics_provider || null,
      tracking_url:       tracking_url || null,
      estimated_delivery: estimated_delivery || null,
      status:             "dispatched",
      updated_by:         user.email,
    };
  }

  // Upsert tracking record (one per order)
  const existing = await supabaseAdmin
    .from("order_tracking")
    .select("id")
    .eq("preorder_id", preorder_id)
    .single();

  let trackingId;
  if (existing.data?.id) {
    const { data } = await supabaseAdmin
      .from("order_tracking")
      .update({ ...trackingRow, updated_at: new Date().toISOString() })
      .eq("id", existing.data.id)
      .select("id")
      .single();
    trackingId = data.id;
  } else {
    const { data } = await supabaseAdmin
      .from("order_tracking")
      .insert(trackingRow)
      .select("id")
      .single();
    trackingId = data.id;
  }

  // Update order status to shipped
  const { data: updatedPreorder } = await supabaseAdmin
    .from("k12_preorders")
    .update({ order_status: "shipped" })
    .eq("id", preorder_id)
    .select("full_name, email, selected_plan")
    .single();

  // Auto-notify customer with tracking details
  if (updatedPreorder?.email) {
    const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const planLabel = updatedPreorder.selected_plan === "family" ? "Smart Family STEM Pack" : "Smart Classroom Starter";
    const trackPageUrl = `${siteUrl}/track?ref=BSL-${preorder_id.slice(0, 8).toUpperCase()}`;

    await sendTrackingNotification({
      to:             updatedPreorder.email,
      customerName:   updatedPreorder.full_name,
      plan:           planLabel,
      trackingNumber: trackingRow.tracking_number,
      trackingUrl:    trackingRow.tracking_url || null,
      provider:       trackingRow.logistics_provider || null,
      trackPageUrl,
    }).catch((err) => console.error("[tracking POST] Email error:", err));

    await supabaseAdmin.from("email_logs").insert({
      preorder_id,
      recipient:  updatedPreorder.email,
      subject:    "Your Order is On the Way! — Blue Sands K12 AR Pedia",
      email_type: "tracking_update",
      status:     "sent",
    });
  }

  return NextResponse.json({ success: true, tracking_id: trackingId });
}

export async function PATCH(request, { params }) {
  const { error: authError, user } = await requireAdmin();
  if (authError) return authError;

  const { id: preorder_id } = await params;
  const { status, notes } = await request.json();

  const updates = { updated_by: user.email, updated_at: new Date().toISOString() };
  if (status) updates.status = status;
  if (notes)  updates.notes  = notes;

  const { error } = await supabaseAdmin
    .from("order_tracking")
    .update(updates)
    .eq("preorder_id", preorder_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "delivered") {
    await supabaseAdmin
      .from("k12_preorders")
      .update({ order_status: "delivered" })
      .eq("id", preorder_id);
  }

  return NextResponse.json({ success: true });
}
