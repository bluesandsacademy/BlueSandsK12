import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

const DISCOUNT_TYPES = ["percent", "fixed"];

function normalizeCode(raw) {
  return String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// GET — one code with the orders attributed to it.
export async function GET(_request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  const { data: code, error } = await supabaseAdmin
    .from("promo_codes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: orders } = await supabaseAdmin
    .from("k12_preorders")
    .select("id, full_name, email, state, device_count, subtotal_ngn, discount_ngn, payment_status, order_status, created_at")
    .eq("promo_code_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ data: { ...code, orders: orders || [] } });
}

// PATCH — edit member details, discount, status, limits.
export async function PATCH(request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  const body = await request.json();
  const patch = { updated_at: new Date().toISOString() };

  if (body.member_name !== undefined) {
    if (!body.member_name?.trim())
      return NextResponse.json({ error: "Member name can't be empty." }, { status: 400 });
    patch.member_name = body.member_name.trim();
  }
  if (body.member_email !== undefined) patch.member_email = body.member_email?.trim() || null;
  if (body.member_phone !== undefined) patch.member_phone = body.member_phone?.trim() || null;
  if (body.notes !== undefined)        patch.notes = body.notes?.trim() || null;
  if (body.active !== undefined)       patch.active = Boolean(body.active);
  if (body.expires_at !== undefined)   patch.expires_at = body.expires_at || null;
  if (body.max_redemptions !== undefined)
    patch.max_redemptions = body.max_redemptions ? parseInt(body.max_redemptions, 10) : null;

  if (body.discount_type !== undefined) {
    if (!DISCOUNT_TYPES.includes(body.discount_type))
      return NextResponse.json({ error: "Invalid discount type." }, { status: 400 });
    patch.discount_type = body.discount_type;
  }
  if (body.discount_value !== undefined) {
    const v = Number(body.discount_value);
    if (!Number.isFinite(v) || v <= 0)
      return NextResponse.json({ error: "Enter a discount value greater than zero." }, { status: 400 });
    patch.discount_value = v;
  }
  if (body.code !== undefined) {
    const code = normalizeCode(body.code);
    if (code.length < 3)
      return NextResponse.json({ error: "Code must be at least 3 characters." }, { status: 400 });
    patch.code = code;
  }

  // Guard: percent can't exceed 100, whether type or value changed.
  const effectiveType = patch.discount_type ?? null;
  if (effectiveType === "percent" && patch.discount_value != null && patch.discount_value > 100)
    return NextResponse.json({ error: "A percentage discount can't exceed 100%." }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("promo_codes")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505")
      return NextResponse.json({ error: "That code is already in use." }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// DELETE — remove a code. Blocked if orders are attached (deactivate instead).
export async function DELETE(_request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  const { error } = await supabaseAdmin.from("promo_codes").delete().eq("id", id);
  if (error) {
    if (error.code === "23503")
      return NextResponse.json(
        { error: "This code has orders attached — deactivate it instead of deleting." },
        { status: 409 }
      );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
