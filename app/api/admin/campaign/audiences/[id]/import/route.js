import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { addContacts } from "@/lib/resend-broadcasts";
import { isValidEmail } from "@/lib/email-list";

// Contact creation is rate-limited by Resend, so the client sends the parsed
// list in modest chunks and shows progress. Each chunk is capped so a single
// request finishes well inside the function timeout.
export const maxDuration = 300;

const MAX_PER_REQUEST = 500;

export async function POST(request, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  const body = await request.json();
  const incoming = Array.isArray(body.contacts) ? body.contacts : [];

  // Re-validate and dedupe on the server; never trust the client's parse.
  const seen = new Set();
  const contacts = [];
  for (const c of incoming) {
    const email = String(c?.email || "").trim().toLowerCase();
    if (!isValidEmail(email) || seen.has(email)) continue;
    seen.add(email);
    contacts.push({
      email,
      firstName: String(c?.firstName || "").trim(),
      lastName: String(c?.lastName || "").trim(),
    });
  }

  if (contacts.length === 0)
    return NextResponse.json({ error: "No valid email addresses to import." }, { status: 400 });
  if (contacts.length > MAX_PER_REQUEST)
    return NextResponse.json(
      { error: `Import ${MAX_PER_REQUEST} or fewer at a time.` },
      { status: 400 }
    );

  try {
    const result = await addContacts(id, contacts);
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[POST /api/admin/campaign/audiences/:id/import]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
