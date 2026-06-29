import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

const FULFILLMENT = ["new", "processing", "packed", "shipped", "delivered", "cancelled"];

export async function GET(_request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("paystack_orders")
    .select("*, promo_codes(member_name, code)")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  return NextResponse.json({ data });
}

export async function PATCH(request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  const body = await request.json();
  const patch = { updated_at: new Date().toISOString() };

  if (body.fulfillment_status !== undefined) {
    if (!FULFILLMENT.includes(body.fulfillment_status))
      return NextResponse.json({ error: "Invalid fulfilment status." }, { status: 400 });
    patch.fulfillment_status = body.fulfillment_status;
  }

  const { data, error } = await supabaseAdmin
    .from("paystack_orders")
    .update(patch)
    .eq("id", id)
    .select("*, promo_codes(member_name, code)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
