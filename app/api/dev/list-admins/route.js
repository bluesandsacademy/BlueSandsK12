import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request) {
  const secret = request.headers.get("x-dev-secret");
  if (!secret || secret !== process.env.DEV_ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    const admins = (data?.users || []).map((u) => ({
      id:         u.id,
      email:      u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));

    return NextResponse.json({ admins });
  } catch (err) {
    console.error("[GET /api/dev/list-admins]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
