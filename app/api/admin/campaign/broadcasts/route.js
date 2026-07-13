import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listBroadcasts } from "@/lib/resend-broadcasts";

// GET — every broadcast in the Resend account, so the admin can see what's
// scheduled, queued or already sent.
export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const data = await listBroadcasts();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[GET /api/admin/campaign/broadcasts]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
