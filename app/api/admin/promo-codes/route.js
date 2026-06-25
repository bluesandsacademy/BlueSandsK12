import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

const DISCOUNT_TYPES = ["percent", "fixed"];

function normalizeCode(raw) {
  return String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Suggest a code from the member's name + a short random suffix.
function suggestCode(memberName) {
  const base = String(memberName || "MEMBER").trim().split(/\s+/)[0].toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "MEMBER";
  const suffix = Math.floor(10 + Math.random() * 90); // 2 digits
  return `${base}${suffix}`;
}

// GET — all codes with their attribution stats merged in.
export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const [{ data: codes, error: e1 }, { data: stats, error: e2 }] = await Promise.all([
    supabaseAdmin.from("promo_codes").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("promo_code_stats").select("id, paid_orders, gross_revenue_ngn, total_discount_ngn"),
  ]);
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  const byId = Object.fromEntries((stats || []).map((s) => [s.id, s]));
  const data = (codes || []).map((c) => ({
    ...c,
    paid_orders:        byId[c.id]?.paid_orders ?? 0,
    gross_revenue_ngn:  byId[c.id]?.gross_revenue_ngn ?? 0,
    total_discount_ngn: byId[c.id]?.total_discount_ngn ?? 0,
  }));

  return NextResponse.json({ data });
}

// POST — create a new code for a team member.
export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const memberName = body.member_name?.trim();
  if (!memberName)
    return NextResponse.json({ error: "Member name is required." }, { status: 400 });

  const discountType = body.discount_type;
  if (!DISCOUNT_TYPES.includes(discountType))
    return NextResponse.json({ error: "Choose a discount type." }, { status: 400 });

  const discountValue = Number(body.discount_value);
  if (!Number.isFinite(discountValue) || discountValue <= 0)
    return NextResponse.json({ error: "Enter a discount value greater than zero." }, { status: 400 });
  if (discountType === "percent" && discountValue > 100)
    return NextResponse.json({ error: "A percentage discount can't exceed 100%." }, { status: 400 });

  const code = normalizeCode(body.code) || suggestCode(memberName);
  if (code.length < 3)
    return NextResponse.json({ error: "Code must be at least 3 characters." }, { status: 400 });

  const row = {
    code,
    member_name:     memberName,
    member_email:    body.member_email?.trim() || null,
    member_phone:    body.member_phone?.trim() || null,
    discount_type:   discountType,
    discount_value:  discountValue,
    active:          body.active !== false,
    max_redemptions: body.max_redemptions ? parseInt(body.max_redemptions, 10) : null,
    expires_at:      body.expires_at || null,
    notes:           body.notes?.trim() || null,
  };

  const { data, error } = await supabaseAdmin
    .from("promo_codes")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505")
      return NextResponse.json({ error: `Code "${code}" is already in use.` }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
