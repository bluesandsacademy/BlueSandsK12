import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { initializeTransaction, generateReference } from "@/lib/paystack";

const PLAN_RATES = { family: 210000, school: 84000 };

// In-memory rate limiter: max 5 attempts per IP per 10 minutes
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;

// Purge expired entries every 15 minutes to prevent unbounded memory growth
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
      { error: "Too many attempts. Please wait 10 minutes and try again." },
      { status: 429 }
    );
  }

  try {
    const { order_ref, email } = await request.json();

    if (!order_ref?.trim() || !email?.trim())
      return NextResponse.json({ error: "Order reference and email are required." }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });

    // Resolve preorder ID from reference (BSL-XXXXXXXX → first 8 chars of UUID)
    const idPrefix = order_ref.trim().replace(/^BSL-/i, "").split("-")[0].toLowerCase();
    if (!/^[0-9a-f]{8}$/.test(idPrefix))
      return NextResponse.json({ error: "Invalid order reference format." }, { status: 400 });

    const { data: rows } = await supabaseAdmin
      .from("k12_preorders")
      .select("id, full_name, email, selected_plan, device_count, payment_option, payment_status, order_status")
      .ilike("id", `${idPrefix}%`)
      .limit(2);

    const preorder  = rows?.[0];
    const fetchErr  = !rows?.length || rows.length > 1;

    // Use identical error messages for "not found" vs "wrong email" — prevents enumeration
    const genericError = "No eligible order found for that reference and email combination.";

    if (fetchErr || !preorder)
      return NextResponse.json({ error: genericError }, { status: 404 });

    // Verify email matches (case-insensitive)
    if (preorder.email.toLowerCase() !== email.trim().toLowerCase())
      return NextResponse.json({ error: genericError }, { status: 404 });

    // Verify this order actually needs a balance payment
    if (preorder.payment_option !== "deposit")
      return NextResponse.json({ error: "This order was placed as full payment — no balance is due." }, { status: 400 });

    if (preorder.payment_status === "fully_paid")
      return NextResponse.json({ error: "This order is already fully paid." }, { status: 400 });

    if (preorder.payment_status !== "deposit_paid")
      return NextResponse.json({ error: "No deposit payment found on this order yet." }, { status: 400 });

    if (!["ready", "confirmed", "processing"].includes(preorder.order_status))
      return NextResponse.json(
        { error: "Your order is not yet ready for balance payment. We will notify you by email when it is." },
        { status: 400 }
      );

    // Calculate balance (70% of full amount)
    const ratePerDevice = PLAN_RATES[preorder.selected_plan] ?? PLAN_RATES.school;
    const fullAmount    = ratePerDevice * preorder.device_count;
    const balanceNGN    = Math.round(fullAmount * 0.7);

    const reference = generateReference(preorder.id + "-bal");
    const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const paystackData = await initializeTransaction({
      email:       preorder.email,
      amountNGN:   balanceNGN,
      reference,
      callbackUrl: `${siteUrl}/preorder/callback?preorder_id=${preorder.id}`,
      metadata: {
        preorder_id:   preorder.id,
        payment_type:  "balance",
        customer_name: preorder.full_name,
        plan:          preorder.selected_plan,
        device_count:  preorder.device_count,
      },
    });

    // Record the pending balance payment
    await supabaseAdmin.from("order_payments").insert({
      preorder_id:     preorder.id,
      payment_type:    "balance",
      amount_ngn:      balanceNGN,
      paystack_ref:    reference,
      paystack_status: "pending",
    });

    return NextResponse.json({
      success:      true,
      paystack_url: paystackData.authorization_url,
      customer_name: preorder.full_name,
      balance_ngn:  balanceNGN,
    });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/pay-balance]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
