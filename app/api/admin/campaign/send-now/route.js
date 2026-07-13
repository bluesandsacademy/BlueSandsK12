import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { sendCampaignNow } from "@/lib/resend-broadcasts";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Sends one campaign email to the whole list immediately (used for emails whose
// scheduled time has already passed).
export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { audienceId, emailKey, eventDate } = await request.json();
  if (!audienceId)
    return NextResponse.json({ error: "Choose a contact list to send to." }, { status: 400 });
  if (!emailKey)
    return NextResponse.json({ error: "Choose which email to send." }, { status: 400 });
  if (eventDate && !DATE_RE.test(eventDate))
    return NextResponse.json({ error: "Event date must be YYYY-MM-DD." }, { status: 400 });

  try {
    await sendCampaignNow({ audienceId, emailKey, eventDateISO: eventDate });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/admin/campaign/send-now]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
