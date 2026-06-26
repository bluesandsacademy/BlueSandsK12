"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  User, Building2, Landmark, ChevronRight, ChevronLeft, CheckCircle2,
  Loader2, ArrowLeft, ArrowRight, Minus, Plus, Tablet,
} from "lucide-react";
import { products, getProduct, fmtUSD } from "@/lib/products";

const TABLET_USD = 75;
const INDIVIDUAL_MAX_QTY = 10;
const SCHOOL_MIN_QTY = 5;

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const USER_TYPES = [
  { id: "individual", label: "Parent / Individual", Icon: User },
  { id: "school", label: "School", Icon: Building2 },
  { id: "institution", label: "Government / NGO / Private Sector", Icon: Landmark },
];

const SECTIONS = [
  { label: "Your Order", step: 1 },
  { label: "Your Details", step: 2 },
  { label: "Delivery", step: 3 },
  { label: "Review", step: 4 },
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
  const productParam = searchParams.get("product");
  const initialProduct = getProduct(productParam);

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const [form, setForm] = useState({
    product_slug: initialProduct?.slug ?? "",
    variant_label: initialProduct?.variants[0]?.label ?? "",
    quantity: 1,
    tablet_count: 0,
    user_type: "",
    full_name: "",
    school_org_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    state: "",
    lga: "",
    city: "",
    postal_code: "",
    address_line1: "",
    address_line2: "",
    landmark: "",
    additional_needs: [],
    student_count: "",
    teacher_count: "",
    agreed_to_contact: false,
  });

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const selectProduct = (slug) => {
    const p = getProduct(slug);
    setForm((f) => ({ ...f, product_slug: slug, variant_label: p?.variants[0]?.label ?? "" }));
    setErrors((e) => ({ ...e, product_slug: "" }));
  };

  const product = getProduct(form.product_slug);
  const variant = product?.variants.find((v) => v.label === form.variant_label) || null;
  const qty = parseInt(form.quantity, 10) || 0;
  const tablets = parseInt(form.tablet_count, 10) || 0;
  const subtotal = (variant?.priceUSD ?? 0) * qty;
  const total = subtotal + tablets * TABLET_USD;
  const isSchoolOrg = ["school", "institution"].includes(form.user_type);

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.product_slug) e.product_slug = "Please choose a book.";
      if (!form.variant_label) e.variant_label = "Please choose an edition.";
      if (qty < 1) e.quantity = "Choose at least 1.";
    }
    if (step === 2) {
      if (!form.user_type) e.user_type = "Please tell us who you are.";
      if (!form.full_name.trim()) e.full_name = "Full name is required.";
      if (isSchoolOrg && !form.school_org_name.trim()) e.school_org_name = "Organisation name is required.";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "A valid email is required.";
      if (!form.phone.trim()) e.phone = "Phone number is required.";
      if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required.";
      if (isSchoolOrg && qty < SCHOOL_MIN_QTY) e.user_type = `Schools preorder a minimum of ${SCHOOL_MIN_QTY} sets — adjust your quantity in step 1.`;
      if (!isSchoolOrg && qty > INDIVIDUAL_MAX_QTY) e.user_type = `Individuals can order up to ${INDIVIDUAL_MAX_QTY} sets. Apply as a distributor for more.`;
    }
    if (step === 3) {
      if (!form.state) e.state = "Please select a state.";
      if (!form.city.trim()) e.city = "City / town is required.";
      if (!form.address_line1.trim()) e.address_line1 = "Street address is required.";
    }
    if (step === 4) {
      if (!form.agreed_to_contact) e.agreed_to_contact = "Please accept the terms to continue.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, 4)); };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    if (!validate()) return;
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/k12-ar-pedia/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      // Hand off to the Paystack store to complete payment, if configured.
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        setStatus("success");
      }
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 rounded-full bg-grass/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-grass" strokeWidth={1.75} />
          </div>
          <h2 className="font-display text-2xl font-bold text-secondary mb-3">Preorder Received!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Thank you, {form.full_name.split(" ")[0]}! We&apos;ve logged your preorder and our
            team will email you your secure checkout link to complete payment.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-secondary py-12 px-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-grape/30 blob-1 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <Link href="/products" className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <h1 className="font-display font-bold text-white text-3xl sm:text-4xl mb-2">Preorder Your AR Books</h1>
          <p className="text-white/70 text-sm sm:text-base">
            Tell us what you&apos;d like and where to send it — you&apos;ll complete payment securely on the next step.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            {SECTIONS.map(({ label, step: s }) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-1.5 ${s <= step ? "opacity-100" : "opacity-40"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${s < step ? "bg-grass text-white" : s === step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                    {s < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                  </div>
                  <span className="text-xs font-semibold text-gray-600 hidden sm:block whitespace-nowrap">{label}</span>
                </div>
                {s < SECTIONS.length && (
                  <div className={`flex-1 h-0.5 rounded-full mx-1 transition-colors ${s < step ? "bg-grass" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {/* STEP 1 — Order */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-secondary mb-1">Choose your books</h2>
                  <p className="text-gray-500 text-sm">Pick a title, then your Spotty edition.</p>
                </div>

                {/* Product picker */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {products.map((p) => {
                    const active = form.product_slug === p.slug;
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => selectProduct(p.slug)}
                        className={`text-left rounded-2xl border-2 p-3 transition-all ${active ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                      >
                        <div className="aspect-square flex items-center justify-center mb-2">
                          <Image src={p.image} alt={p.name} width={p.imageW} height={p.imageH} sizes="160px" className="w-full h-full object-contain" />
                        </div>
                        <p className="font-display font-bold text-secondary text-sm leading-tight">{p.name}</p>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">{p.ageRange} · from {fmtUSD(p.priceUSD)}</p>
                      </button>
                    );
                  })}
                </div>
                <FieldError msg={errors.product_slug} />

                {/* Variant + quantity */}
                {product && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
                    <div>
                      <Label required>{product.optionLabel} edition</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {product.variants.map((v) => {
                          const active = form.variant_label === v.label;
                          return (
                            <button
                              key={v.label}
                              type="button"
                              onClick={() => set("variant_label", v.label)}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${active ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                            >
                              <span>{v.label}</span>
                              <span>{fmtUSD(v.priceUSD)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label required>Quantity</Label>
                      <Stepper value={qty} min={1} onChange={(n) => set("quantity", n)} />
                      <FieldError msg={errors.quantity} />
                    </div>

                    {/* Tablet add-on */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-grape/10 flex items-center justify-center shrink-0">
                          <Tablet className="w-5 h-5 text-grape" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-secondary text-sm">Add a tablet? <span className="text-gray-400 font-semibold">(+{fmtUSD(TABLET_USD)} each)</span></p>
                          <p className="text-xs text-gray-500 mb-2">Spotty holds your tablet — a tablet isn&apos;t included.</p>
                          <Stepper value={tablets} min={0} onChange={(n) => set("tablet_count", n)} />
                        </div>
                      </div>
                    </div>

                    {/* Running total */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-500">Order total</span>
                      <span className="font-display font-bold text-2xl text-secondary">{fmtUSD(total)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 — Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-secondary mb-1">Your details</h2>
                  <p className="text-gray-500 text-sm">So we know who&apos;s preordering.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div>
                    <Label required>I am a…</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {USER_TYPES.map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => set("user_type", id)}
                          className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-bold text-center transition-all ${form.user_type === id ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2} />
                          {label}
                        </button>
                      ))}
                    </div>
                    <FieldError msg={errors.user_type} />
                  </div>
                  <div>
                    <Label required>Full Name</Label>
                    <Input placeholder="e.g. Adesola Martins" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
                    <FieldError msg={errors.full_name} />
                  </div>
                  {isSchoolOrg && (
                    <div>
                      <Label required>Organisation Name</Label>
                      <Input placeholder="e.g. Bright Stars Academy" value={form.school_org_name} onChange={(e) => set("school_org_name", e.target.value)} />
                      <FieldError msg={errors.school_org_name} />
                    </div>
                  )}
                  <div>
                    <Label required>Email Address</Label>
                    <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    <FieldError msg={errors.email} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>Phone Number</Label>
                      <Input type="tel" placeholder="+234 801 234 5678" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                      <FieldError msg={errors.phone} />
                    </div>
                    <div>
                      <Label required>WhatsApp Number</Label>
                      <Input type="tel" placeholder="+234 801 234 5678" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
                      <FieldError msg={errors.whatsapp} />
                    </div>
                  </div>
                  {isSchoolOrg && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label>Students (approx.)</Label>
                        <Input type="number" placeholder="e.g. 200" value={form.student_count} onChange={(e) => set("student_count", e.target.value)} />
                      </div>
                      <div>
                        <Label>Teachers (approx.)</Label>
                        <Input type="number" placeholder="e.g. 15" value={form.teacher_count} onChange={(e) => set("teacher_count", e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 — Delivery */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-secondary mb-1">Delivery location</h2>
                  <p className="text-gray-500 text-sm">Where should we send your books?</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>State</Label>
                      <select
                        value={form.state}
                        onChange={(e) => set("state", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm text-gray-800 bg-white appearance-none transition-colors"
                      >
                        <option value="">Select a state…</option>
                        {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <FieldError msg={errors.state} />
                    </div>
                    <div>
                      <Label required>City / Town</Label>
                      <Input placeholder="e.g. Lekki" value={form.city} onChange={(e) => set("city", e.target.value)} />
                      <FieldError msg={errors.city} />
                    </div>
                  </div>
                  <div>
                    <Label required>Street Address</Label>
                    <Input placeholder="House number and street" value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)} />
                    <FieldError msg={errors.address_line1} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label>Area / LGA</Label>
                      <Input placeholder="e.g. Eti-Osa" value={form.lga} onChange={(e) => set("lga", e.target.value)} />
                    </div>
                    <div>
                      <Label>Nearest Landmark</Label>
                      <Input placeholder="Helps delivery find you" value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-secondary mb-1">Review your preorder</h2>
                  <p className="text-gray-500 text-sm">Confirm, then continue to secure payment.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 text-sm">
                  <Row label="Book" value={product?.name} />
                  <Row label="Edition" value={`${product?.optionLabel} ${form.variant_label}`} />
                  <Row label="Quantity" value={qty} />
                  {tablets > 0 && <Row label="Tablets" value={`${tablets} × ${fmtUSD(TABLET_USD)}`} />}
                  <Row label="Name" value={form.full_name} />
                  <Row label="Contact" value={form.email} />
                  <Row label="Deliver to" value={[form.city, form.state, "Nigeria"].filter(Boolean).join(", ")} />
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-secondary">Total</span>
                    <span className="font-display font-bold text-2xl text-secondary">{fmtUSD(total)}</span>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreed_to_contact}
                    onChange={(e) => set("agreed_to_contact", e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-primary shrink-0"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to be contacted about my preorder and accept the Terms &amp; Conditions.
                  </span>
                </label>
                <FieldError msg={errors.agreed_to_contact} />

                {status === "error" && (
                  <p className="text-sm text-rose-500 font-medium bg-rose-50 rounded-xl px-4 py-3">{errMsg}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button type="button" onClick={back} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button type="button" onClick={next} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={status === "loading"} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-coral text-white text-sm font-bold hover:bg-coral/90 transition-colors shadow-lg shadow-coral/30 disabled:opacity-60">
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : (
                <>Continue to Payment <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ value, min, onChange }) {
  return (
    <div className="inline-flex items-center rounded-xl border-2 border-gray-200 overflow-hidden">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="px-3 py-2.5 text-gray-500 hover:bg-gray-50" aria-label="Decrease">
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-bold text-secondary tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} className="px-3 py-2.5 text-gray-500 hover:bg-gray-50" aria-label="Increase">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-secondary text-right">{value || "—"}</span>
    </div>
  );
}

export default function PreorderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <PreorderForm />
    </Suspense>
  );
}
