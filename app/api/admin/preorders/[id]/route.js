import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;

  const [{ data: preorder, error }, { data: payments }, { data: tracking }, { data: emails }] =
    await Promise.all([
      supabaseAdmin.from("k12_preorders").select("*").eq("id", id).single(),
      supabaseAdmin.from("order_payments").select("*").eq("preorder_id", id).order("created_at"),
      supabaseAdmin.from("order_tracking").select("*").eq("preorder_id", id).order("created_at").limit(1).single().catch(() => ({ data: null })),
      supabaseAdmin.from("email_logs").select("*").eq("preorder_id", id).order("created_at", { ascending: false }),
    ]);

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ preorder, payments: payments || [], tracking, emails: emails || [] });
}

export async function PATCH(request, { params }) {
  const { error: authError, user } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();

  const allowed = ["order_status", "payment_status", "admin_notes"];
  const updates = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (updates.order_status) {
    updates.reviewed_by = user.email;
    updates.reviewed_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("k12_preorders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
