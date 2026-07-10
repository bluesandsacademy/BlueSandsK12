import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listAudiences, createAudience } from "@/lib/resend-broadcasts";

// GET — all audiences (contact counts are loaded lazily per-audience so this
// stays a single fast Resend call).
export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const data = await listAudiences();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[GET /api/admin/campaign/audiences]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — create a new contact list.
export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { name } = await request.json();
  if (!name?.trim())
    return NextResponse.json({ error: "A list name is required." }, { status: 400 });

  try {
    const data = await createAudience(name.trim());
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[POST /api/admin/campaign/audiences]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
