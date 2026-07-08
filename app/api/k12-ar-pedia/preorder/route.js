import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getProduct, STORE_URL, TABLET_NGN } from "@/lib/products";
import { getUsdToNgn } from "@/lib/exchange-rate";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const VALID_USER_TYPES = ["individual", "school", "institution"];
const VALID_NEEDS = ["ar_books", "teacher_training", "school_demo", "installation_support", "lms_access"];

const INDIVIDUAL_MAX_QTY = 10;
const SCHOOL_MIN_QTY = 5;

/*
 * The preorder form is now a LEAD-CAPTURE step: it records who is preordering
 * and exactly what they want, then hands the customer to the Paystack store to
 * pay. No money is taken on-site, so there is no Paystack transaction init,
 * no order_payments row, and no on-site promo discount here anymore.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      product_slug, quantity, tablet_count,
      user_type, full_name, school_org_name, email, phone, whatsapp,
      state, lga, city, postal_code, address_line1, address_line2, landmark,
      additional_needs, student_count, teacher_count, agreed_to_contact,
    } = body;

    // ── Product validation (against the real catalogue) ───────────────────────
    const product = getProduct(product_slug);
    if (!product)
      return NextResponse.json({ error: "Please choose a product." }, { status: 400 });

    const qty = parseInt(quantity, 10);
    if (!qty || qty < 1)
      return NextResponse.json({ error: "Quantity must be at least 1." }, { status: 400 });

    const tablets = Math.max(0, parseInt(tablet_count, 10) || 0);

    // ── Lead validation ───────────────────────────────────────────────────────
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

    const isSchoolOrg = ["school", "institution"].includes(user_type);
    if (isSchoolOrg && qty < SCHOOL_MIN_QTY)
      return NextResponse.json({ error: `Schools and organisations preorder a minimum of ${SCHOOL_MIN_QTY} sets.` }, { status: 400 });
    if (!isSchoolOrg && qty > INDIVIDUAL_MAX_QTY)
      return NextResponse.json({ error: `Individual orders are limited to ${INDIVIDUAL_MAX_QTY} sets. Apply as a distributor for larger volumes.` }, { status: 400 });

    if (!agreed_to_contact)
      return NextResponse.json({ error: "You must accept the Terms & Conditions." }, { status: 400 });

    const sanitizedNeeds = (additional_needs || []).filter((n) => VALID_NEEDS.includes(n));
    // Prices are authored in NGN. `k12_preorders.amount_usd` predates that, so
    // convert at the live rate to keep the column's meaning honest.
    // TODO: add an `amount_ngn` column and store the exact charged figure.
    const amountNGN = product.priceNGN * qty + tablets * TABLET_NGN;
    const { rate } = await getUsdToNgn();
    const amountUSD = Math.round(amountNGN / rate);

    // ── Save the preorder lead ────────────────────────────────────────────────
    // Kits no longer have editions, so variant_label (kept in the schema) is a
    // constant. The tablet is an optional add-on, priced at TABLET_NGN each.
    const { data, error } = await supabaseAdmin
      .from("k12_preorders")
      .insert({
        product_slug:    product.slug,
        variant_label:   "Standard",
        device_count:    qty,
        tablet_count:    tablets,
        amount_usd:      amountUSD,
        user_type,
        full_name:       full_name.trim(),
        school_org_name: school_org_name?.trim() || null,
        email:           email.trim().toLowerCase(),
        phone:           phone.trim(),
        whatsapp:        whatsapp.trim(),
        state,
        lga:             lga?.trim() || null,
        city:            city.trim(),
        postal_code:     postal_code?.trim() || null,
        address_line1:   address_line1.trim(),
        address_line2:   address_line2?.trim() || null,
        landmark:        landmark?.trim() || null,
        additional_needs: sanitizedNeeds,
        student_count:   student_count ? parseInt(student_count, 10) : null,
        teacher_count:   teacher_count ? parseInt(teacher_count, 10) : null,
        agreed_to_contact: Boolean(agreed_to_contact),
        order_status:    "pending",
        payment_status:  "unpaid",
      })
      .select("id")
      .single();

    if (error) throw error;

    // Hand off to the Paystack store to complete payment. When the store URL
    // isn't configured yet, the client shows a "we'll be in touch" success.
    return NextResponse.json({
      success: true,
      id: data.id,
      redirect_url: STORE_URL || null,
    });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/preorder]", err);
    return NextResponse.json(
      { error: err.message || "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
