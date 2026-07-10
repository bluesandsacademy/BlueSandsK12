import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listContacts, removeAudience } from "@/lib/resend-broadcasts";

// GET — one audience's contacts, with subscribed/unsubscribed counts.
export async function GET(_request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  try {
    const contacts = await listContacts(id);
    const unsubscribed = contacts.filter((c) => c.unsubscribed).length;
    return NextResponse.json({
      data: {
        contacts,
        total: contacts.length,
        subscribed: contacts.length - unsubscribed,
        unsubscribed,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/campaign/audiences/:id]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove the whole list.
export async function DELETE(_request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  try {
    await removeAudience(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/campaign/audiences/:id]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
