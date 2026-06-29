import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  const secret = request.headers.get("x-dev-secret");
  if (!secret || secret !== process.env.DEV_ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { user_id, new_password } = await request.json();

    if (!user_id || !new_password)
      return NextResponse.json({ error: "user_id and new_password are required." }, { status: 400 });

    if (new_password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      password: new_password,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, email: data.user.email });
  } catch (err) {
    console.error("[POST /api/dev/change-password]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
