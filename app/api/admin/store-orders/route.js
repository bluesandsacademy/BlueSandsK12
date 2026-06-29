import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

// GET — Paystack Storefront orders with their attributed team member.
export async function GET(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("fulfillment_status");
  const search = searchParams.get("q");

  let query = supabaseAdmin
    .from("paystack_orders")
    .select("*, promo_codes(member_name, code)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("fulfillment_status", status);
  if (search)
    query = query.or(
      `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,paystack_reference.ilike.%${search}%`,
    );

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
