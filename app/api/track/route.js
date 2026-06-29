import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTrackingStatus } from "@/lib/logistics";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref"); // e.g. BSL-ABCD1234

  if (!ref) return NextResponse.json({ error: "Missing ref" }, { status: 400 });

  // Resolve preorder ID from reference (BSL-{8-char-prefix})
  // UUIDs are lowercase hex — normalise and validate before querying
  const idPrefix = ref.replace(/^BSL-/i, "").split("-")[0].toLowerCase();
  if (!/^[0-9a-f]{8}$/.test(idPrefix))
    return NextResponse.json({ error: "Invalid order reference format." }, { status: 400 });

  const { data: rows } = await supabaseAdmin
    .from("k12_preorders")
    .select("id, full_name, selected_plan, device_count, order_status, payment_status, created_at")
    .ilike("id", `${idPrefix}%`)
    .limit(2); // fetch 2 to detect ambiguity

  // Reject if no match or more than one row shares the same 8-char prefix (astronomically rare but safe)
  const error = !rows?.length || rows.length > 1;
  const preorder = rows?.[0];

  if (error || !preorder)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const { data: tracking } = await supabaseAdmin
    .from("order_tracking")
    .select("tracking_number, logistics_provider, status, estimated_delivery, tracking_url, updated_at")
    .eq("preorder_id", preorder.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()
    .catch(() => ({ data: null }));

  // Try to fetch live events from logistics provider
  let liveEvents = [];
  if (tracking?.tracking_number) {
    try {
      const live = await getTrackingStatus(tracking.tracking_number);
      liveEvents = live.events || [];
    } catch {
      // Silently fall back — not critical
    }
  }

  return NextResponse.json({
    ref,
    customer_name:      preorder.full_name,
    plan:               preorder.selected_plan,
    device_count:       preorder.device_count,
    order_status:       preorder.order_status,
    payment_status:     preorder.payment_status,
    order_date:         preorder.created_at,
    tracking_number:    tracking?.tracking_number || null,
    logistics_provider: tracking?.logistics_provider || null,
    estimated_delivery: tracking?.estimated_delivery || null,
    tracking_url:       tracking?.tracking_url || null,
    courier_status:     tracking?.status || null,
    events:             liveEvents,
    last_updated:       tracking?.updated_at || null,
  });
}
