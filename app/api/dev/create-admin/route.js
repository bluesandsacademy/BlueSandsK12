import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  const secret = process.env.DEV_ADMIN_SECRET;

  // Require secret header in all environments
  const provided = request.headers.get("x-dev-secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, user: { id: data.user.id, email: data.user.email } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
