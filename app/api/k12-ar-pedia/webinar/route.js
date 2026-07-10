import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendWebinarConfirmation, sendAdminWebinarAlert } from "@/lib/resend";
import { WEBINAR, DESIGNATIONS } from "@/lib/webinar";

// Server-only, so the link never reaches the browser bundle and is returned
// solely to registrants. Override per-webinar without a code change.
const JOIN_URL = process.env.WEBINAR_JOIN_URL || "https://luma.com/z307o8sk";

// In-memory rate limiter: max 5 submissions per IP per 10 minutes
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of attempts) {
    if (now > entry.reset) attempts.delete(ip);
  }
}, 15 * 60 * 1000);

function isRateLimited(ip) {
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) { attempts.set(ip, { count: 1, reset: now + WINDOW_MS }); return false; }
  if (entry.count >= 5) return true;
  attempts.set(ip, { ...entry, count: entry.count + 1 });
  return false;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { full_name, designation, school, location, student_count, email, phone } = body;

    if (!full_name?.trim())
      return NextResponse.json({ error: "Your full name is required." }, { status: 400 });
    if (!designation?.trim())
      return NextResponse.json({ error: "Your designation is required." }, { status: 400 });
    if (!DESIGNATIONS.includes(designation) && designation.trim().length > 80)
      return NextResponse.json({ error: "That designation is too long." }, { status: 400 });
    if (!school?.trim())
      return NextResponse.json({ error: "Your school name is required." }, { status: 400 });
    if (!location?.trim())
      return NextResponse.json({ error: "Your location is required." }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    if (!phone?.trim())
      return NextResponse.json({ error: "Your phone number is required." }, { status: 400 });

    const students = parseInt(student_count, 10);
    if (!Number.isInteger(students) || students < 1 || students > 1_000_000)
      return NextResponse.json({ error: "Please enter a valid student count." }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = full_name.trim();

    // Re-registering with the same email refreshes the existing row instead of
    // erroring, so a returning attendee simply gets their link back. `updated_at`
    // is set here rather than relying on a DB trigger, so the timestamp stays
    // honest even on a table created without one.
    const { error } = await supabaseAdmin
      .from("webinar_registrations")
      .upsert(
        {
          webinar_slug:  WEBINAR.slug,
          full_name:     cleanName,
          designation:   designation.trim(),
          school:        school.trim(),
          location:      location.trim(),
          student_count: students,
          email:         cleanEmail,
          phone:         phone.trim(),
          updated_at:    new Date().toISOString(),
        },
        { onConflict: "webinar_slug,email" }
      );

    if (error) throw error;

    // The seat is already booked, so a mail failure must not fail the request.
    const whenLabel = [WEBINAR.dateLabel, WEBINAR.timeLabel].filter(Boolean).join(" at ");
    try {
      await sendWebinarConfirmation({
        to: cleanEmail,
        name: cleanName.split(" ")[0],
        webinarTitle: WEBINAR.title,
        whenLabel,
        lumaUrl: JOIN_URL,
      });
    } catch (err) {
      console.error("[webinar] confirmation email failed", err);
    }

    try {
      await sendAdminWebinarAlert({
        name: cleanName,
        designation: designation.trim(),
        school: school.trim(),
        location: location.trim(),
        studentCount: students,
        email: cleanEmail,
        phone: phone.trim(),
        webinarTitle: WEBINAR.title,
      });
    } catch (err) {
      console.error("[webinar] admin alert failed", err);
    }

    return NextResponse.json({ success: true, join_url: JOIN_URL });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/webinar]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
