import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  validateK12Preorder,
  normaliseK12Preorder,
  PREORDER_PACKAGES,
  labelFor,
} from "@/lib/k12-preorder";
import {
  sendK12PreorderAcknowledgement,
  sendK12AdminPreorderAlert,
} from "@/lib/resend";

/*
 * BLUE SANDS K12 PLATFORM PRE-ORDER. Captures a school's interest in the
 * software platform (licences, packages, launch timing) so the team can follow
 * up with pricing. No payment is taken here. Every submission lands in the
 * k12_platform_preorders table and is visible at /admin/k12-preorders.
 */

// In-memory rate limiter: max 5 submissions per IP per 10 minutes.
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
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    const { valid, errors } = validateK12Preorder(body);
    if (!valid) {
      const first = Object.values(errors)[0];
      return NextResponse.json({ error: first, errors }, { status: 400 });
    }

    const row = normaliseK12Preorder(body);

    const { data, error } = await supabaseAdmin
      .from("k12_platform_preorders")
      .insert({ ...row, status: "new" })
      .select("id")
      .single();

    if (error) throw error;

    // Notifications must not fail the submission. Settle all, log failures.
    const packageLabel = labelFor(PREORDER_PACKAGES, row.package);
    await Promise.allSettled([
      sendK12PreorderAcknowledgement({
        to:              row.email,
        contactPerson:   row.contact_person,
        orgName:         row.school_org_name,
        packageLabel,
        studentLicenses: row.student_licenses,
        preorderId:      data.id,
      }),
      sendK12AdminPreorderAlert({
        orgName:         row.school_org_name,
        contactPerson:   row.contact_person,
        jobTitle:        row.job_title,
        email:           row.email,
        phone:           row.phone,
        location:        row.location,
        packageLabel,
        studentLicenses: row.student_licenses,
        studentCount:    row.student_count,
        preorderId:      data.id,
      }),
    ]).catch((e) => console.error("[platform-preorder] notification error", e));

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/platform-preorder]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
