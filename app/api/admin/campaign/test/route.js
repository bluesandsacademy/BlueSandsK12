import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { sendCampaignTest } from "@/lib/resend-broadcasts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Sends one campaign email to a single address so the admin can preview it.
export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { to, emailKey, eventDate } = await request.json();
  if (!to || !EMAIL_RE.test(to))
    return NextResponse.json({ error: "Enter a valid test recipient." }, { status: 400 });
  if (!emailKey)
    return NextResponse.json({ error: "Choose which email to preview." }, { status: 400 });
  if (eventDate && !DATE_RE.test(eventDate))
    return NextResponse.json({ error: "Event date must be YYYY-MM-DD." }, { status: 400 });

  try {
    await sendCampaignTest({ to, emailKey, eventDateISO: eventDate });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/admin/campaign/test]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
