import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const VALID_OCCUPATIONS    = ["educator","ict_professional","sales_professional","school_consultant","entrepreneur","other"];
const VALID_NETWORK_SIZES  = ["1-10","10-50","50+"];

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      full_name, email, phone, whatsapp,
      state, city_lga, occupation,
      has_school_connections, school_network_size,
      why_apply, cv_url, agreed_to_represent,
    } = body;

    // ── Validation ───────────────────────────────────────────────────────────
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

    if (!occupation || !VALID_OCCUPATIONS.includes(occupation))
      return NextResponse.json({ error: "Please select your occupation." }, { status: 400 });

    if (has_school_connections && school_network_size && !VALID_NETWORK_SIZES.includes(school_network_size))
      return NextResponse.json({ error: "Invalid school network size." }, { status: 400 });

    if (!why_apply?.trim() || why_apply.trim().length < 30)
      return NextResponse.json({ error: "Please provide a more detailed response (at least 30 characters)." }, { status: 400 });

    if (!agreed_to_represent)
      return NextResponse.json({ error: "You must agree to represent Blue Sands STEM Labs professionally." }, { status: 400 });

    // ── Insert ────────────────────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from("k12_distribution_applications")
      .insert({
        full_name:              full_name.trim(),
        email:                  email.trim().toLowerCase(),
        phone:                  phone.trim(),
        whatsapp:               whatsapp.trim(),
        state,
        city_lga:               city_lga?.trim() || null,
        occupation,
        has_school_connections: Boolean(has_school_connections),
        school_network_size:    has_school_connections ? (school_network_size || null) : null,
        why_apply:              why_apply.trim(),
        cv_url:                 cv_url?.trim() || null,
        agreed_to_represent:    Boolean(agreed_to_represent),
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      id: data.id,
      message: "Your application has been received! Our team will be in touch within 3 business days.",
    });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/distribution]", err);
    return NextResponse.json(
      { error: err.message || "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
