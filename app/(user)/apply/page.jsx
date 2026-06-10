"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  User, MapPin, Briefcase, FileText, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, ArrowLeft, Upload, Users, Building2,
} from "lucide-react";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const OCCUPATIONS = [
  { id: "educator",           label: "Educator" },
  { id: "ict_professional",   label: "ICT Professional" },
  { id: "sales_professional", label: "Sales Professional" },
  { id: "school_consultant",  label: "School Consultant" },
  { id: "entrepreneur",       label: "Entrepreneur" },
  { id: "other",              label: "Other" },
];

const NETWORK_SIZES = [
  { id: "1-10",  label: "1 – 10 schools" },
  { id: "10-50", label: "10 – 50 schools" },
  { id: "50+",   label: "50+ schools" },
];

const SECTIONS = [
  { label: "Basic Info",   step: 1 },
  { label: "Location",     step: 2 },
  { label: "Background",   step: 3 },
  { label: "Why You?",     step: 4 },
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

export default function DistributionApplyPage() {
  const [step, setStep]     = useState(1);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const [form, setForm] = useState({
    full_name:             "",
    email:                 "",
    phone:                 "",
    whatsapp:              "",
    state:                 "",
    city_lga:              "",
    occupation:            "",
    has_school_connections: null,
    school_network_size:   "",
    why_apply:             "",
    cv_url:                "",
    agreed_to_represent:   false,
  });

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.full_name.trim())  e.full_name = "Full name is required.";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "A valid email is required.";
      if (!form.phone.trim())    e.phone    = "Phone number is required.";
      if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required.";
    }
    if (step === 2) {
      if (!form.state) e.state = "Please select a state.";
    }
    if (step === 3) {
      if (!form.occupation) e.occupation = "Please select your occupation.";
      if (form.has_school_connections === null) e.has_school_connections = "Please answer this question.";
    }
    if (step === 4) {
      if (!form.why_apply.trim() || form.why_apply.trim().length < 30)
        e.why_apply = "Please write at least 30 characters.";
      if (!form.agreed_to_represent)
        e.agreed_to_represent = "You must agree to represent Blue Sands STEM Labs.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    if (!validate()) return;
    setStatus("loading");
    try {
      const res  = await fetch("/api/k12-ar-pedia/distribution", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setStatus("success");
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={1.75} />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-3" style={{ fontFamily: "var(--font-jarkata)" }}>
            Application Received!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Thank you, {form.full_name.split(" ")[0]}! We&apos;ve received your application for {form.state}. Our team will review it and be in touch within 3 business days.
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
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-2xl mx-auto relative">
          <Link href="/" className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to AR Pedia
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            State Distribution Officer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-jarkata)" }}>
            Become A State Distribution Officer
          </h1>
          <p className="text-white/65 text-sm sm:text-base">
            Help deploy immersive STEM learning across Nigeria.
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
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${s < step ? "bg-emerald-500 text-white" : s === step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                    {s < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                  </div>
                  <span className="text-xs font-semibold text-gray-600 hidden sm:block whitespace-nowrap">{label}</span>
                </div>
                {s < SECTIONS.length && (
                  <div className={`flex-1 h-0.5 rounded-full mx-1 transition-colors ${s < step ? "bg-emerald-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >

            {/* ── STEP 1: Basic Info ────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-secondary mb-1" style={{ fontFamily: "var(--font-jarkata)" }}>Basic Information</h2>
                  <p className="text-gray-500 text-sm">Your personal contact details.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div>
                    <Label required>Full Name</Label>
                    <Input placeholder="e.g. Adesola Martins" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
                    <FieldError msg={errors.full_name} />
                  </div>
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
                </div>
              </div>
            )}

            {/* ── STEP 2: Location ─────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-secondary mb-1" style={{ fontFamily: "var(--font-jarkata)" }}>Location</h2>
                  <p className="text-gray-500 text-sm">Which state are you applying to represent?</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div>
                    <Label required>State Applying For</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={form.state}
                        onChange={(e) => set("state", e.target.value)}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm text-gray-800 appearance-none bg-white transition-colors"
                      >
                        <option value="">Select a state…</option>
                        {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <FieldError msg={errors.state} />
                  </div>
                  <div>
                    <Label>City / LGA</Label>
                    <Input placeholder="e.g. Surulere, Lagos Island" value={form.city_lga} onChange={(e) => set("city_lga", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Background ───────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-secondary mb-1" style={{ fontFamily: "var(--font-jarkata)" }}>Your Background</h2>
                  <p className="text-gray-500 text-sm">Help us understand your professional background.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                  {/* Occupation */}
                  <div>
                    <Label required>Occupation</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                      {OCCUPATIONS.map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => set("occupation", id)}
                          className={`px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-center ${form.occupation === id ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <FieldError msg={errors.occupation} />
                  </div>

                  {/* School connections */}
                  <div>
                    <Label required>Do You Have School Connections?</Label>
                    <div className="flex gap-3 mt-1">
                      {[{ id: true, label: "Yes" }, { id: false, label: "No" }].map(({ id, label }) => (
                        <button
                          key={String(id)}
                          type="button"
                          onClick={() => set("has_school_connections", id)}
                          className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${form.has_school_connections === id ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <FieldError msg={errors.has_school_connections} />
                  </div>

                  {/* Network size — conditional */}
                  {form.has_school_connections === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label>Estimated Schools in Your Network</Label>
                      <div className="flex gap-3 mt-1">
                        {NETWORK_SIZES.map(({ id, label }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => set("school_network_size", id)}
                            className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${form.school_network_size === id ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 4: Why You + CV + Agreement ────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-secondary mb-1" style={{ fontFamily: "var(--font-jarkata)" }}>Why You?</h2>
                  <p className="text-gray-500 text-sm">Tell us why you&apos;d be a great Distribution Officer.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div>
                    <Label required>Why Do You Want To Become a Distribution Officer?</Label>
                    <textarea
                      rows={5}
                      placeholder="Share your motivation, relevant experience, and how you plan to grow STEM education in your state…"
                      value={form.why_apply}
                      onChange={(e) => set("why_apply", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-colors resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <FieldError msg={errors.why_apply} />
                      <span className={`text-xs ml-auto ${form.why_apply.length >= 30 ? "text-emerald-500" : "text-gray-400"}`}>
                        {form.why_apply.length} / 30+ chars
                      </span>
                    </div>
                  </div>

                  {/* CV upload — optional, just a URL field for now */}
                  <div>
                    <Label>CV / Profile Link <span className="text-gray-400 font-normal">(Optional)</span></Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        className="pl-9"
                        type="url"
                        placeholder="Link to your LinkedIn, CV, or portfolio"
                        value={form.cv_url}
                        onChange={(e) => set("cv_url", e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Paste a link to your LinkedIn profile or a publicly accessible CV.</p>
                  </div>

                  {/* Agreement */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        onClick={() => set("agreed_to_represent", !form.agreed_to_represent)}
                        className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${form.agreed_to_represent ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary/50"}`}
                      >
                        {form.agreed_to_represent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">
                        I agree to represent Blue Sands STEM Labs professionally and uphold the standards of the brand.
                      </span>
                    </label>
                    <FieldError msg={errors.agreed_to_represent} />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-rose-500 font-medium bg-rose-50 rounded-xl px-4 py-3">{errMsg}</p>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button type="button" onClick={back} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < SECTIONS.length ? (
            <button type="button" onClick={next} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={status === "loading"} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-60">
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              ) : (
                <><Users className="w-4 h-4" /> Apply Now</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
