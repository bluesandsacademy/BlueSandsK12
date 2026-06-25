import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

/** Call at the top of any admin route handler. Returns { user } or a 401 Response. */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { user };
}
