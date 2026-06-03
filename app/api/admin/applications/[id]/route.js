import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("k12_distribution_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request, { params }) {
  const { error: authError, user } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const { status, review_notes } = await request.json();

  const { data, error } = await supabaseAdmin
    .from("k12_distribution_applications")
    .update({ status, review_notes, reviewed_by: user.email, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
