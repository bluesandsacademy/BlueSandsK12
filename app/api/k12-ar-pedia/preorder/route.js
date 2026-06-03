import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { initializeTransaction, generateReference } from "@/lib/paystack";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const VALID_USER_TYPES  = ["individual", "school", "institution"];
const VALID_PAYMENT_OPT = ["full", "deposit"];
const VALID_NEEDS       = ["ar_books", "teacher_training", "school_demo", "installation_support", "lms_access"];

// Per-device NGN rates matching the pricing page
const PLAN_RATES = {
  family: 210000,
  school:  84000,
};

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      selected_plan, user_type, full_name, school_org_name, email, phone, whatsapp,
      state, lga, city, postal_code, address_line1, address_line2, landmark,
      device_count, additional_needs,
      student_count, teacher_count, payment_option, agreed_to_contact,
    } = body;

    // ── Validation ───────────────────────────────────────────────────────────
    if (!user_type || !VALID_USER_TYPES.includes(user_type))
      return NextResponse.json({ error: "Invalid user type." }, { status: 400 });

    if (!full_name?.trim())
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });

    if (!phone?.trim())
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });

    if (!whatsapp?.trim())
      return NextResponse.json({ error: "WhatsApp number is required." }, { status: 400 });

    if (!state || !NIGERIAN_STATES.includes(state))
      return NextResponse.json({ error: "Please select a valid state." }, { status: 400 });

    if (!city?.trim())
      return NextResponse.json({ error: "City / town is required." }, { status: 400 });

    if (!address_line1?.trim())
      return NextResponse.json({ error: "Street address is required." }, { status: 400 });

    const parsedDeviceCount = parseInt(device_count, 10);
    if (!parsedDeviceCount || parsedDeviceCount < 1)
      return NextResponse.json({ error: "At least 1 device is required." }, { status: 400 });

    if (!payment_option || !VALID_PAYMENT_OPT.includes(payment_option))
      return NextResponse.json({ error: "Please select a payment option." }, { status: 400 });

    if (!agreed_to_contact)
      return NextResponse.json({ error: "You must agree to be contacted." }, { status: 400 });

    const sanitizedNeeds = (additional_needs || []).filter((n) => VALID_NEEDS.includes(n));

    // ── Compute amount ────────────────────────────────────────────────────────
    const ratePerDevice = PLAN_RATES[selected_plan] ?? PLAN_RATES.school;
    const fullAmountNGN = ratePerDevice * parsedDeviceCount;
    const chargeNGN     = payment_option === "deposit"
      ? Math.round(fullAmountNGN * 0.3)
      : fullAmountNGN;

    // ── Insert preorder ───────────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from("k12_preorders")
      .insert({
        selected_plan:      selected_plan || null,
        user_type,
        full_name:          full_name.trim(),
        school_org_name:    school_org_name?.trim() || null,
        email:              email.trim().toLowerCase(),
        phone:              phone.trim(),
        whatsapp:           whatsapp.trim(),
        state,
        lga:                lga?.trim() || null,
        city:               city.trim(),
        postal_code:        postal_code?.trim() || null,
        address_line1:      address_line1.trim(),
        address_line2:      address_line2?.trim() || null,
        landmark:           landmark?.trim() || null,
        device_count:       parsedDeviceCount,
        additional_needs:   sanitizedNeeds,
        student_count:      student_count ? parseInt(student_count, 10) : null,
        teacher_count:      teacher_count ? parseInt(teacher_count, 10) : null,
        payment_option,
        agreed_to_contact:  Boolean(agreed_to_contact),
        order_status:       "pending",
        payment_status:     "unpaid",
      })
      .select("id")
      .single();

    if (error) throw error;

    const preorderId = data.id;
    const reference  = generateReference(preorderId);
    const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // ── Initialize Paystack transaction ──────────────────────────────────────
    const paystackData = await initializeTransaction({
      email:       email.trim().toLowerCase(),
      amountNGN:   chargeNGN,
      reference,
      callbackUrl: `${siteUrl}/preorder/callback?preorder_id=${preorderId}`,
      metadata: {
        preorder_id:    preorderId,
        payment_type:   payment_option === "deposit" ? "deposit" : "full",
        customer_name:  full_name.trim(),
        plan:           selected_plan,
        device_count:   parsedDeviceCount,
      },
    });

    // ── Record pending payment ────────────────────────────────────────────────
    await supabaseAdmin.from("order_payments").insert({
      preorder_id:     preorderId,
      payment_type:    payment_option === "deposit" ? "deposit" : "full",
      amount_ngn:      chargeNGN,
      paystack_ref:    reference,
      paystack_status: "pending",
    });

    return NextResponse.json({
      success:      true,
      id:           preorderId,
      paystack_url: paystackData.authorization_url,
    });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/preorder]", err);
    return NextResponse.json(
      { error: err.message || "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
