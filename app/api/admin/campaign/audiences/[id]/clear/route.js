import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { removeContacts } from "@/lib/resend-broadcasts";

// Empties a contact list without deleting the list itself. Contact removal is
// rate-limited by Resend, so the client sends ids in chunks and shows progress.
export const maxDuration = 300;

const MAX_PER_REQUEST = 500;

export async function POST(request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  const body = await request.json();
  const incoming = Array.isArray(body.contacts) ? body.contacts : [];
  const contacts = incoming
    .map((c) => ({ id: c?.id, email: c?.email }))
    .filter((c) => c.id || c.email);

  if (contacts.length === 0)
    return NextResponse.json({ error: "No contacts to remove." }, { status: 400 });
  if (contacts.length > MAX_PER_REQUEST)
    return NextResponse.json(
      { error: `Remove ${MAX_PER_REQUEST} or fewer at a time.` },
      { status: 400 }
    );

  try {
    const result = await removeContacts(id, contacts);
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[POST /api/admin/campaign/audiences/:id/clear]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
