import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";
import { getUsdToNgn } from "@/lib/exchange-rate";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const VALID_USER_TYPES = ["school", "institution", "distributor"];
const VALID_NEEDS = ["teacher_training", "school_demo", "installation_support", "lms_access"];

const MIN_QTY = 5; // bulk / school orders only; individuals buy in the shop

/*
 * SCHOOL & BULK QUOTE REQUEST. Individuals check out single kits directly on the
 * Paystack storefront; this endpoint captures a bulk/school lead (who they are,
 * what they want, where to deliver) so the team can send a tailored quote and
 * invoice. No payment is taken here and there is no store redirect.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      product_slug, quantity,
      user_type, full_name, school_org_name, email, phone, whatsapp,
      state, lga, city, address_line1, landmark,
      additional_needs, student_count, teacher_count, agreed_to_contact,
    } = body;

    // ── Product validation (against the real catalogue) ───────────────────────
    const product = getProduct(product_slug);
    if (!product)
      return NextResponse.json({ error: "Please choose a kit." }, { status: 400 });

    const qty = parseInt(quantity, 10);
    if (!qty || qty < MIN_QTY)
      return NextResponse.json({ error: `Bulk orders start at ${MIN_QTY} sets. For fewer, buy directly in the shop.` }, { status: 400 });

    // ── Lead validation ───────────────────────────────────────────────────────
    if (!user_type || !VALID_USER_TYPES.includes(user_type))
      return NextResponse.json({ error: "Please tell us who you are." }, { status: 400 });
    if (!school_org_name?.trim())
      return NextResponse.json({ error: "Organisation name is required." }, { status: 400 });
    if (!full_name?.trim())
      return NextResponse.json({ error: "Contact name is required." }, { status: 400 });
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

    if (!agreed_to_contact)
      return NextResponse.json({ error: "You must accept the Terms & Conditions." }, { status: 400 });

    const sanitizedNeeds = (additional_needs || []).filter((n) => VALID_NEEDS.includes(n));

    // Indicative order value for the admin. Prices are authored in NGN; the
    // legacy `amount_usd` column is kept honest by converting at the live rate.
    // This is a quote lead, so the figure is informational only.
    const indicativeNGN = product.priceNGN * qty;
    const { rate } = await getUsdToNgn();
    const amountUSD = Math.round(indicativeNGN / rate);

    // ── Save the quote request ────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from("k12_preorders")
      .insert({
        product_slug:    product.slug,
        variant_label:   "Bulk quote",
        device_count:    qty,
        tablet_count:    0,
        amount_usd:      amountUSD,
        user_type,
        full_name:       full_name.trim(),
        school_org_name: school_org_name.trim(),
        email:           email.trim().toLowerCase(),
        phone:           phone.trim(),
        whatsapp:        whatsapp.trim(),
        state,
        lga:             lga?.trim() || null,
        city:            city.trim(),
        address_line1:   address_line1?.trim() || null,
        landmark:        landmark?.trim() || null,
        additional_needs: sanitizedNeeds,
        student_count:   student_count ? parseInt(student_count, 10) : null,
        teacher_count:   teacher_count ? parseInt(teacher_count, 10) : null,
        agreed_to_contact: Boolean(agreed_to_contact),
        payment_option:  "full", // NOT NULL column; quotes are invoiced in full
        order_status:    "pending",
        payment_status:  "unpaid",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/preorder]", err);
    return NextResponse.json(
      { error: err.message || "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
