import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/resend";

// In-memory rate limiter: max 5 submissions per IP per 10 minutes
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;

// Purge expired entries periodically to prevent unbounded memory growth
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
      { error: "Too many messages. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  try {
    const { name, email, phone, message } = await request.json();

    if (!name?.trim())
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });

    if (!message?.trim() || message.trim().length < 10)
      return NextResponse.json({ error: "Please enter a message (at least 10 characters)." }, { status: 400 });

    await sendContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/contact]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
