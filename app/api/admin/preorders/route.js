import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const orderStatus   = searchParams.get("order_status");
  const paymentStatus = searchParams.get("payment_status");
  const search        = searchParams.get("q");
  const page          = parseInt(searchParams.get("page") || "1", 10);
  const limit         = parseInt(searchParams.get("limit") || "20", 10);
  const offset        = (page - 1) * limit;

  let query = supabaseAdmin
    .from("k12_preorders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (orderStatus)   query = query.eq("order_status", orderStatus);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);
  if (search)        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, limit });
}
