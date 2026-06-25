"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import {
  User,
  Building2,
  Landmark,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  MapPin,
  Package,
  CreditCard,
  Users,
  BookOpen,
  Monitor,
  GraduationCap,
  Wrench,
  Wifi,
  Phone,
  Tag,
  X,
} from "lucide-react";

const PLAN_META = {
  family: {
    label: "Smart Family STEM Pack",
    Icon: Users,
    color: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    userType: "individual",
    deviceCount: 1,
  },
  school: {
    label: "Smart Classroom Starter",
    Icon: GraduationCap,
    color: "bg-primary",
    text: "text-primary",
    bg: "bg-blue-50",
    border: "border-blue-200",
    userType: "school",
    deviceCount: 5,
  },
};

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

// Individuals can order 1–10 units; larger volumes are routed to distributor application.
const INDIVIDUAL_MAX_QTY = 10;
const SCHOOL_MIN_QTY = 5;
const DEVICE_PRESETS_INDIVIDUAL = [1, 2, 5, 10];
const DEVICE_PRESETS_SCHOOL = [5, 10, 25, 100];

// Per-device rates derived from pricing page:
//  Family  — ₦210,000 for 1 device
//  School  — ₦420,000 base covers 5 devices → ₦84,000 per device
const PLAN_PRICING = {
  family: { perDeviceNGN: 210000, perDeviceUSD: 150 },
  school: { perDeviceNGN: 84000,  perDeviceUSD: 60  },
};

function fmtNGN(n) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

const ADDITIONAL_NEEDS = [
  { id: "school_demo", label: "School Demo", Icon: Monitor },
];

const USER_TYPES = [
  { id: "individual", label: "Parent / Individual", Icon: User },
  { id: "school", label: "School", Icon: Building2 },
  {
    id: "institution",
    label: "Government / Private Sector / NGO",
    Icon: Landmark,
  },
];

const SECTIONS = [
  { label: "Who Are You?", step: 1 },
  { label: "Your Details", step: 2 },
  { label: "Location", step: 3 },
  { label: "Review & Pay", step: 4 },
];

function Label({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-secondary mb-1.5">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-colors ${className}`}
      {...props}
    />
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-500 font-medium">{msg}</p>;
}

function PreorderForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan"); // "family" | "school" | null
  const planMeta = PLAN_META[planParam] ?? null;
  const productMeta = getProduct(searchParams.get("product")); // shop device | undefined

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");

  const [form, setForm] = useState({
    selected_plan: planParam ?? "",
    user_type: planMeta?.userType ?? "",
    full_name: "",
    school_org_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: "Nigeria",
    state: "",
    lga: "",
    city: "",
    postal_code: "",
    address_line1: "",
    address_line2: "",
    landmark: "",
    device_count: planMeta?.deviceCount ?? 1,
    additional_needs: [],
    student_count: "",
    teacher_count: "",
    payment_option: "full",
    agreed_to_contact: false,
    promo_code: "",
  });

  // Promo code: `promo` holds the validated/applied result from the server.
  const [promo, setPromo] = useState(null);
  const [promoStatus, setPromoStatus] = useState("idle"); // idle | checking | error
  const [promoMsg, setPromoMsg] = useState("");

  const clearPromo = () => {
    setPromo(null);
    setPromoStatus("idle");
    setPromoMsg("");
  };

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
    // Discount depends on the subtotal — drop any applied code if it changes.
    if (field === "device_count" || field === "selected_plan") clearPromo();
  };

  const applyPromo = async () => {
    const code = form.promo_code.trim();
    if (!code) return;
    setPromoStatus("checking");
    setPromoMsg("");
    try {
      const res = await fetch("/api/k12-ar-pedia/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, selected_plan: planParam, device_count: form.device_count }),
      });
      const data = await res.json();
      if (!data.ok) {
        setPromo(null);
        setPromoStatus("error");
        setPromoMsg(data.error || "That code isn't valid.");
        return;
      }
      setPromo(data);
      setPromoStatus("idle");
      setPromoMsg("");
    } catch {
      setPromo(null);
      setPromoStatus("error");
      setPromoMsg("Could not check that code. Please try again.");
    }
  };

  const toggleNeed = (id) => {
    setForm((f) => ({
      ...f,
      additional_needs: f.additional_needs.includes(id)
        ? f.additional_needs.filter((n) => n !== id)
        : [...f.additional_needs, id],
    }));
  };

  // Per-step validation
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.user_type) e.user_type = "Please select who you are.";
    }
    if (step === 2) {
      if (!form.full_name.trim()) e.full_name = "Full name is required.";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "A valid email is required.";
      if (!form.phone.trim()) e.phone = "Phone number is required.";
      if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required.";
    }
    if (step === 3) {
      if (!form.state) e.state = "Please select your state.";
      if (!form.city.trim()) e.city = "City / town is required.";
      if (!form.address_line1.trim())
        e.address_line1 = "Street address is required.";
    }
    if (step === 4) {
      const qty = parseInt(form.device_count, 10);
      const isSchoolOrg = ["school", "institution"].includes(form.user_type);
      if (!qty || qty < 1) {
        e.device_count = "At least 1 device is required.";
      } else if (isSchoolOrg && qty < SCHOOL_MIN_QTY) {
        e.device_count = `Schools and organisations require a minimum of ${SCHOOL_MIN_QTY} units.`;
      } else if (!isSchoolOrg && qty > INDIVIDUAL_MAX_QTY) {
        e.device_count = `Individual orders are limited to ${INDIVIDUAL_MAX_QTY} units. For larger volumes, please apply as a distributor.`;
      }
      if (!form.agreed_to_contact)
        e.agreed_to_contact = "Please accept the Terms & Conditions to continue.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/k12-ar-pedia/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only send the code if it was successfully applied, so a stray
        // half-typed code can never block checkout.
        body: JSON.stringify({ ...form, promo_code: promo ? form.promo_code.trim() : "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      // Redirect to Paystack payment page
      if (data.paystack_url) {
        window.location.href = data.paystack_url;
      } else {
        setStatus("success");
      }
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  const isSchoolOrInstitution = ["school", "institution"].includes(
    form.user_type,
  );
  const devicePresets = isSchoolOrInstitution
    ? DEVICE_PRESETS_SCHOOL
    : DEVICE_PRESETS_INDIVIDUAL;
  const overIndividualLimit =
    !isSchoolOrInstitution && parseInt(form.device_count, 10) > INDIVIDUAL_MAX_QTY;

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2
              className="w-10 h-10 text-emerald-500"
              strokeWidth={1.75}
            />
          </div>
          <h2
            className="text-2xl font-bold text-secondary mb-3"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Preorder Received!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Thank you, {form.full_name.split(" ")[0]}! Your reservation has been
            logged. Our team will contact you within 24 hours to confirm your
            slot.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AR Pedia
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header */}
      <div className="bg-secondary py-12 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-2xl mx-auto relative">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AR Pedia
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-white text-xs font-bold mb-4">
            <Package className="w-3.5 h-3.5" />
            Early Access — Limited Slots
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Reserve Your Blue Sands K12 AR Pedia Devices
          </h1>
          <p className="text-white/65 text-sm sm:text-base">
            Nigeria&apos;s immersive STEM learning experience for children ages
            5–11.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            {SECTIONS.map(({ label, step: s }) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center gap-1.5 ${s <= step ? "opacity-100" : "opacity-40"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${s < step ? "bg-emerald-500 text-white" : s === step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {s < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                  </div>
                  <span className="text-xs font-semibold text-gray-600 hidden sm:block whitespace-nowrap">
                    {label}
                  </span>
                </div>
                {s < SECTIONS.length && (
                  <div
                    className={`flex-1 h-0.5 rounded-full mx-1 transition-colors ${s < step ? "bg-emerald-400" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Selected product banner (from the shop) */}
        {productMeta && (
          <div
            className="flex items-center gap-4 p-4 rounded-2xl border-2 mb-8"
            style={{ background: `${productMeta.color}12`, borderColor: `${productMeta.color}40` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${productMeta.color}22` }}
            >
              <productMeta.Icon className="w-6 h-6" style={{ color: productMeta.color }} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">
                Reserving Device
              </p>
              <p
                className="text-sm font-bold text-secondary truncate"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {productMeta.name}
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold underline underline-offset-2 shrink-0"
              style={{ color: productMeta.color }}
            >
              Change
            </Link>
          </div>
        )}

        {/* Selected plan banner */}
        {planMeta && (
          <div
            className={`flex items-center gap-4 p-4 rounded-2xl border ${planMeta.border} ${planMeta.bg} mb-8`}
          >
            <div
              className={`w-11 h-11 rounded-xl ${planMeta.color} flex items-center justify-center shrink-0`}
            >
              <planMeta.Icon
                className="w-5 h-5 text-white"
                strokeWidth={1.75}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[10px] font-black uppercase tracking-wider ${planMeta.text} mb-0.5`}
              >
                Selected Plan
              </p>
              <p
                className="text-sm font-bold text-secondary truncate"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {planMeta.label}
              </p>
            </div>
            <Link
              href="/#pricing"
              className={`text-xs font-semibold ${planMeta.text} underline underline-offset-2 shrink-0`}
            >
              Change
            </Link>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── STEP 1: User Type ─────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold text-secondary mb-1"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    I Am A…
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Select the option that best describes you.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {USER_TYPES.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set("user_type", id)}
                      className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 text-center ${
                        form.user_type === id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {form.user_type === id && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${form.user_type === id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        <Icon className="w-6 h-6" strokeWidth={1.75} />
                      </div>
                      <span
                        className={`text-sm font-bold ${form.user_type === id ? "text-primary" : "text-secondary"}`}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.user_type} />
              </div>
            )}

            {/* ── STEP 2: Basic Details ─────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold text-secondary mb-1"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    Your Details
                  </h2>
                  <p className="text-gray-500 text-sm">
                    We&apos;ll use these to reach you about your order.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div>
                    <Label required>Full Name</Label>
                    <Input
                      placeholder="e.g. Chukwuemeka Obi"
                      value={form.full_name}
                      onChange={(e) => set("full_name", e.target.value)}
                    />
                    <FieldError msg={errors.full_name} />
                  </div>
                  {isSchoolOrInstitution && (
                    <div>
                      <Label>School / Organisation Name</Label>
                      <Input
                        placeholder="e.g. Greenfield Academy"
                        value={form.school_org_name}
                        onChange={(e) => set("school_org_name", e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <Label required>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    <FieldError msg={errors.email} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+234 801 234 5678"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                      />
                      <FieldError msg={errors.phone} />
                    </div>
                    <div>
                      <Label required>WhatsApp Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        <Input
                          className="pl-9"
                          type="tel"
                          placeholder="+234 801 234 5678"
                          value={form.whatsapp}
                          onChange={(e) => set("whatsapp", e.target.value)}
                        />
                      </div>
                      <FieldError msg={errors.whatsapp} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Location ─────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold text-secondary mb-1"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    Delivery Location
                  </h2>
                  <p className="text-gray-500 text-sm">
                    We use this to plan delivery and on-site support in your
                    area.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  {/* Country — locked */}
                  <div>
                    <Label>Country</Label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-500 font-medium select-none">
                      <span className="text-lg leading-none">🇳🇬</span>
                      Nigeria
                    </div>
                  </div>

                  {/* State + LGA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>State</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          value={form.state}
                          onChange={(e) => set("state", e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm text-gray-800 appearance-none bg-white transition-colors"
                        >
                          <option value="">Select state…</option>
                          {NIGERIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <FieldError msg={errors.state} />
                    </div>
                    <div>
                      <Label>LGA</Label>
                      <Input
                        placeholder="e.g. Ikeja, Surulere"
                        value={form.lga}
                        onChange={(e) => set("lga", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* City + Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>City / Town</Label>
                      <Input
                        placeholder="e.g. Lagos, Abuja"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                      <FieldError msg={errors.city} />
                    </div>
                    <div>
                      <Label>Postal Code</Label>
                      <Input
                        placeholder="e.g. 100001"
                        value={form.postal_code}
                        onChange={(e) => set("postal_code", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Street Address line 1 */}
                  <div>
                    <Label required>Street Address</Label>
                    <Input
                      placeholder="e.g. 15 Adeola Odeku Street, Victoria Island"
                      value={form.address_line1}
                      onChange={(e) => set("address_line1", e.target.value)}
                    />
                    <FieldError msg={errors.address_line1} />
                  </div>

                  {/* Address line 2 */}
                  <div>
                    <Label>
                      Apartment / Floor / Building{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      placeholder="e.g. 3rd Floor, Sunshine Complex, Suite 4B"
                      value={form.address_line2}
                      onChange={(e) => set("address_line2", e.target.value)}
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <Label>
                      Nearest Landmark{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      placeholder="e.g. Opposite GTBank, near Shoprite Mall"
                      value={form.landmark}
                      onChange={(e) => set("landmark", e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Helps our delivery team find you faster.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Order Details ─────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold text-secondary mb-1"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    Order Details
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Tell us how many devices and what support you need.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                  {/* Device count */}
                  <div>
                    <Label required>Number of Units Needed</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {devicePresets.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => set("device_count", n)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${form.device_count === n ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      min={1}
                      max={isSchoolOrInstitution ? undefined : INDIVIDUAL_MAX_QTY}
                      placeholder="Or enter custom number"
                      value={form.device_count}
                      onChange={(e) =>
                        set("device_count", parseInt(e.target.value, 10) || "")
                      }
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      {isSchoolOrInstitution
                        ? `Minimum ${SCHOOL_MIN_QTY} units for schools and organisations.`
                        : `Individuals can order between 1 and ${INDIVIDUAL_MAX_QTY} units.`}
                    </p>
                    <FieldError msg={errors.device_count} />
                  </div>

                  {/* Over-limit → route to distributor application */}
                  {overIndividualLimit && (
                    <div className="rounded-xl p-4 border-2 border-amber-200 bg-amber-50 flex items-start gap-3">
                      <Package className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-bold text-amber-700">
                          Ordering more than {INDIVIDUAL_MAX_QTY} units?
                        </p>
                        <p className="text-amber-600/90 mt-0.5">
                          Larger volumes are handled through our distributor
                          programme with better pricing and support.{" "}
                          <Link
                            href="/apply"
                            className="font-bold underline underline-offset-2"
                          >
                            Apply as a distributor →
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price estimate */}
                  {planParam && PLAN_PRICING[planParam] && form.device_count > 0 && (
                    <div className="rounded-xl p-4 border border-primary/20 bg-primary/5 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1">
                        Estimated Cost
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {form.device_count} device{form.device_count !== 1 ? "s" : ""}{" "}
                          × {fmtNGN(PLAN_PRICING[planParam].perDeviceNGN)}
                        </span>
                        <span
                          className="text-2xl font-black text-secondary"
                          style={{ fontFamily: "var(--font-jarkata)" }}
                        >
                          {fmtNGN(form.device_count * PLAN_PRICING[planParam].perDeviceNGN)}
                        </span>
                      </div>
                      {/* Promo code */}
                      <div className="pt-2 border-t border-primary/10">
                        {promo ? (
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-grass">
                              <Tag className="w-4 h-4" strokeWidth={2.5} />
                              {form.promo_code.trim().toUpperCase()} applied
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-bold text-grass">− {fmtNGN(promo.discount_ngn)}</span>
                              <button
                                type="button"
                                onClick={() => { set("promo_code", ""); clearPromo(); }}
                                aria-label="Remove promo code"
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-2">
                              <input
                                value={form.promo_code}
                                onChange={(e) => {
                                  set("promo_code", e.target.value);
                                  if (promoStatus === "error") { setPromoStatus("idle"); setPromoMsg(""); }
                                }}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } }}
                                placeholder="Promo code"
                                className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm uppercase placeholder:normal-case placeholder:text-gray-400"
                              />
                              <button
                                type="button"
                                onClick={applyPromo}
                                disabled={promoStatus === "checking" || !form.promo_code.trim()}
                                className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50"
                              >
                                {promoStatus === "checking" ? "Checking…" : "Apply"}
                              </button>
                            </div>
                            {promoMsg && <p className="mt-1 text-xs text-rose-500 font-medium">{promoMsg}</p>}
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                        <span className="text-xs text-gray-500">Paid in full at checkout</span>
                        <span className="text-base font-bold text-primary">
                          {fmtNGN(promo ? promo.total_ngn : form.device_count * PLAN_PRICING[planParam].perDeviceNGN)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 pt-1">
                        * Estimate only — final quote confirmed before checkout.
                      </p>
                    </div>
                  )}

                  {/* Additional needs */}
                  <div>
                    <Label>Additional Needs</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ADDITIONAL_NEEDS.map(({ id, label, Icon }) => {
                        const checked = form.additional_needs.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleNeed(id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${checked ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${checked ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
                            >
                              <Icon className="w-4 h-4" strokeWidth={1.75} />
                            </div>
                            <span
                              className={`text-sm font-semibold ${checked ? "text-primary" : "text-gray-600"}`}
                            >
                              {label}
                            </span>
                            {checked && (
                              <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* School-only fields */}
                  {isSchoolOrInstitution && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                        For Schools / Institutions
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Number of Students</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="e.g. 200"
                            value={form.student_count}
                            onChange={(e) =>
                              set("student_count", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>Number of Teachers</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="e.g. 15"
                            value={form.teacher_count}
                            onChange={(e) =>
                              set("teacher_count", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Review summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <p className="font-bold text-secondary text-xs uppercase tracking-wider mb-2">
                      Order Summary
                    </p>
                    {planMeta && (
                      <div className="flex justify-between text-gray-600">
                        <span>Plan</span>
                        <span className="font-semibold">{planMeta.label}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Type</span>
                      <span className="font-semibold capitalize">
                        {form.user_type}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Units</span>
                      <span className="font-semibold">{form.device_count}</span>
                    </div>
                    {planParam && PLAN_PRICING[planParam] && form.device_count > 0 && (
                      <>
                        {promo && (
                          <div className="flex justify-between text-grass font-semibold">
                            <span>Promo ({form.promo_code.trim().toUpperCase()})</span>
                            <span>− {fmtNGN(promo.discount_ngn)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                          <span>Total (paid in full)</span>
                          <span className="font-bold text-secondary">
                            {fmtNGN(promo ? promo.total_ngn : form.device_count * PLAN_PRICING[planParam].perDeviceNGN)}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Location</span>
                      <span className="font-semibold">
                        {[form.city, form.state, "Nigeria"]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                    {form.address_line1 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Address</span>
                        <span className="font-semibold text-right max-w-[55%] truncate">
                          {form.address_line1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions — required */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        onClick={() =>
                          set("agreed_to_contact", !form.agreed_to_contact)
                        }
                        className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${form.agreed_to_contact ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary/50"}`}
                      >
                        {form.agreed_to_contact && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">
                        I accept the{" "}
                        <span className="font-semibold text-secondary">
                          Terms &amp; Conditions
                        </span>{" "}
                        and agree to be contacted by Blue Sands STEM Labs about
                        my preorder.
                      </span>
                    </label>
                    <FieldError msg={errors.agreed_to_contact} />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-rose-500 font-medium bg-rose-50 rounded-xl px-4 py-3">
                      {errMsg}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < SECTIONS.length ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-400 text-white text-sm font-bold hover:bg-amber-500 transition-colors shadow-lg shadow-amber-400/30 disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Reserve &amp; Pay in Full
                </>
              )}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Limited early rollout slots available nationwide.
        </p>
      </div>
    </div>
  );
}

export default function PreorderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFBF0" }}><div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
      <PreorderForm />
    </Suspense>
  );
}
