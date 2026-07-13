import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { scheduleCampaign } from "@/lib/resend-broadcasts";

// Creates and schedules all 30 broadcasts. Two Resend calls per email, paced, so
// give it room.
export const maxDuration = 300;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { audienceId, eventDate } = await request.json();
  if (!audienceId)
    return NextResponse.json({ error: "Choose a contact list to send to." }, { status: 400 });
  if (eventDate && !DATE_RE.test(eventDate))
    return NextResponse.json({ error: "Event date must be YYYY-MM-DD." }, { status: 400 });

  try {
    const results = await scheduleCampaign({ audienceId, eventDateISO: eventDate });
    const summary = results.reduce(
      (acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }),
      {}
    );
    return NextResponse.json({ data: { results, summary } });
  } catch (err) {
    console.error("[POST /api/admin/campaign/schedule]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
