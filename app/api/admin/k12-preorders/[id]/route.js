import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

const STATUSES = ["new", "contacted", "qualified", "closed", "declined"];

export async function PATCH(request, { params }) {
  const { error: authError, user } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();

  const updates = {};
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    updates.status = body.status;
    updates.reviewed_by = user.email;
    updates.reviewed_at = new Date().toISOString();
  }
  if (body.admin_notes !== undefined) updates.admin_notes = body.admin_notes;

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("k12_platform_preorders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
