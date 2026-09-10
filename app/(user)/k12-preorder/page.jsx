"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  SCHOOL_TYPES,
  PREORDER_PACKAGES,
  SUBSCRIPTION_DURATIONS,
  ACADEMIC_YEAR_OPTIONS,
  TABLET_OPTIONS,
  validateK12Preorder,
  labelFor,
  getPackage,
  packagePrice,
} from "@/lib/k12-preorder";
import { fmtNGN } from "@/lib/products";

/* Blue Sands K12 platform pre-order.

   Built mobile-first on purpose: one decision per step, every field full-width
   on a phone, inputs at 16px so iOS never zooms on focus, numeric keypads for
   counts, and a thumb-reachable action bar pinned to the bottom of the screen
   on small viewports. The desktop layout widens the same steps and moves the
   controls inline. */

const STEPS = [
  { id: "contact", title: "Your contact details" },
  { id: "school", title: "About your school" },
  { id: "package", title: "Your pre-order package" },
  { id: "launch", title: "When you want to launch" },
  { id: "requirements", title: "Anything else we should know" },
  { id: "review", title: "Review and confirm" },
];

const EMPTY = {
  school_org_name: "",
  contact_person: "",
  job_title: "",
  email: "",
  phone: "",
  location: "",
  school_type: "",
  student_count: "",
  teacher_count: "",
  current_lms: "",
  package: "",
  tablet_option: "with",
  student_licenses: "",
  subscription_durations: [],
  implementation_date: "",
  academic_year: "",
  demo_requested: null,
  additional_requirements: "",
  agreed_preorder: false,
};

// ── Small building blocks ──────────────────────────────────────────────────

function Label({ children, required, hint }) {
  return (
    <span className="block mb-1.5">
      <span className="text-[15px] font-semibold text-secondary">
        {children}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {hint && (
        <span className="block text-[13px] font-medium text-gray-400 mt-0.5">
          {hint}
        </span>
      )}
    </span>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-[13px] text-rose-500 font-medium">{msg}</p>;
}

// 16px (text-base) on mobile keeps iOS from zooming the viewport on focus.
const inputBase =
  "w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-base sm:text-[15px] " +
  "text-gray-800 placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors";

function TextField({ label, required, hint, error, ...props }) {
  return (
    <label className="block">
      <Label required={required} hint={hint}>
        {label}
      </Label>
      <input className={inputBase} {...props} />
      <FieldError msg={error} />
    </label>
  );
}

function NumberField(props) {
  return <TextField inputMode="numeric" pattern="[0-9]*" {...props} />;
}

// Full-width selectable row. Big touch target, whole row is the control.
function OptionRow({ selected, onClick, kind = "radio", children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-3 w-full min-h-13.5 px-4 py-3 text-left rounded-xl border-2 transition-colors ${
        selected
          ? "border-primary bg-primary/5 text-secondary"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
      }`}
    >
      <span
        className={`shrink-0 w-5 h-5 flex items-center justify-center border-2 ${
          kind === "radio" ? "rounded-full" : "rounded-md"
        } ${selected ? "border-primary bg-primary text-white" : "border-gray-300 bg-white"}`}
      >
        {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </span>
      <span className="text-[15px] font-semibold">{children}</span>
    </button>
  );
}

function RadioCards({ options, value, onChange }) {
  return (
    <div className="space-y-2.5">
      {options.map((o) => (
        <OptionRow
          key={o.id}
          selected={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </OptionRow>
      ))}
    </div>
  );
}

function CheckList({ options, values, onToggle }) {
  return (
    <div className="space-y-2.5">
      {options.map((o) => (
        <OptionRow
          key={o.id}
          kind="check"
          selected={values.includes(o.id)}
          onClick={() => onToggle(o.id)}
        >
          {o.label}
        </OptionRow>
      ))}
    </div>
  );
}

// Picture picker for the four pre-order packages. All four stay visible at once
// (two columns, even on the smallest phones) so a school can compare them, and
// the chosen one expands a detail panel underneath.
function PackagePicker({ value, onChange, tabletOption, onTabletOption }) {
  const chosen = getPackage(value);
  const cardPrice = (p) =>
    p.hasTabletOption ? `From ${fmtNGN(p.priceWithoutNGN)}` : fmtNGN(p.priceNGN);
  const unit = (p) => (p.hasTabletOption ? "per student" : "per kit");
  const chosenPrice = chosen ? packagePrice(chosen, tabletOption) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {PREORDER_PACKAGES.map((p) => {
          const selected = value === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              aria-pressed={selected}
              className={`relative flex flex-col rounded-2xl border-2 p-3 text-left transition-colors ${
                selected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {selected && (
                <span className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
              <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-white h-28 sm:h-32 mb-2.5">
                <Image
                  src={p.image}
                  alt={p.label}
                  width={p.imageW}
                  height={p.imageH}
                  sizes="(min-width: 640px) 240px, 45vw"
                  className="max-h-full w-auto object-contain rounded-2xl"
                />
              </div>
              <p className="font-display font-bold text-secondary text-[15px] leading-tight">
                {p.label}
              </p>
              <p className="text-[13px] font-semibold text-gray-400 mt-0.5">
                {p.ageRange}
              </p>
              <p className="text-[15px] font-display font-bold text-secondary mt-1.5">
                {cardPrice(p)}
                <span className="text-[12px] font-semibold text-gray-400">
                  {" "}
                  {unit(p)}
                </span>
              </p>
            </button>
          );
        })}
      </div>

      {chosen && (
        <motion.div
          key={chosen.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sm:p-5 space-y-4"
        >
          {chosen.hasTabletOption && (
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                Smart Tablet
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {TABLET_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.id}
                    selected={tabletOption === o.id}
                    onClick={() => onTabletOption(o.id)}
                  >
                    {o.label}
                  </OptionRow>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-baseline justify-between rounded-xl bg-primary/5 px-3.5 py-3">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-primary">
              List price
            </span>
            <span className="font-display font-bold text-secondary text-lg">
              {fmtNGN(chosenPrice.ngn)}
              <span className="text-[12px] font-semibold text-gray-400">
                {" "}
                {chosen.hasTabletOption ? "per student" : "per kit"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <p className="font-semibold uppercase tracking-wide text-gray-400">
                Age bracket
              </p>
              <p className="text-[15px] font-semibold text-secondary mt-0.5">
                {chosen.ageRange}
              </p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-gray-400">
                Books
              </p>
              <p className="text-[15px] font-semibold text-secondary mt-0.5">
                {chosen.books}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              Topics in the package
            </p>
            <div className="flex flex-wrap gap-1.5">
              {chosen.topics.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-primary/5 px-2.5 py-1 text-[13px] font-semibold text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              In the box
            </p>
            <ul className="space-y-1">
              {chosen.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[15px] font-medium text-secondary"
                >
                  <Check className="h-4 w-4 text-grass shrink-0" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-[13px] font-semibold uppercase tracking-wide text-gray-400 shrink-0">
        {label}
      </span>
      <span className="text-[15px] font-semibold text-secondary sm:text-right">
        {value || "Not provided"}
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function K12PreorderPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [submitError, setSubmitError] = useState("");
  const topRef = useRef(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: "" } : e));
  };

  const toggleIn = (field, id) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(id)
        ? f[field].filter((x) => x !== id)
        : [...f[field], id],
    }));

  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Which errors matter on the step we're leaving.
  const FIELDS_BY_STEP = {
    contact: [
      "school_org_name",
      "contact_person",
      "job_title",
      "email",
      "phone",
      "location",
    ],
    school: ["school_type", "student_count"],
    package: ["package", "student_licenses", "subscription_durations"],
    launch: ["implementation_date", "academic_year"],
    requirements: [],
    review: ["agreed_preorder"],
  };

  const validateStep = () => {
    const { errors: all } = validateK12Preorder(form);
    const relevant = {};
    for (const field of FIELDS_BY_STEP[step.id]) {
      if (all[field]) relevant[field] = all[field];
    }
    setErrors(relevant);
    return Object.keys(relevant).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    scrollToTop();
  };

  const back = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    setErrors({});
    scrollToTop();
  };

  const submit = async () => {
    if (!validateStep()) return;
    setStatus("loading");
    setSubmitError("");
    try {
      const res = await fetch("/api/k12-ar-pedia/platform-preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );
      setStatus("success");
      scrollToTop();
    } catch (err) {
      setSubmitError(err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 rounded-full bg-grass/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-grass" strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-2xl font-bold text-secondary mb-3">
            Pre-order request received! 🎉
          </h1>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            Thanks for your interest in Blue Sands K12. Our team will review
            your requirements and contact you with pricing, package options, and
            next steps.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </motion.div>
      </div>
    );
  }

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-cream">
      <div ref={topRef} className="scroll-mt-4" />

      {/* Header */}
      <div className="bg-secondary px-4 pt-6 pb-5 sm:pt-12 sm:pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-grape/30 blob-1 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <h1 className="font-display font-bold text-white text-2xl sm:text-4xl mb-1.5">
            Pre-Order Form
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Reserve Blue Sands K12 for your school. This is a request, not a
            payment. Our team follows up with pricing and next steps.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[13px] font-bold text-secondary">{step.title}</p>
            <p className="text-[13px] font-semibold text-gray-400 tabular-nums">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Body: bottom padding leaves room for the mobile action bar */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-32 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            {step.id === "contact" && (
              <div className="space-y-5">
                <TextField
                  label="School / organisation name"
                  required
                  autoComplete="organization"
                  placeholder="e.g. Bright Stars Academy"
                  value={form.school_org_name}
                  onChange={(e) => set("school_org_name", e.target.value)}
                  error={errors.school_org_name}
                />
                <TextField
                  label="Contact person"
                  required
                  autoComplete="name"
                  placeholder="e.g. Adesola Martins"
                  value={form.contact_person}
                  onChange={(e) => set("contact_person", e.target.value)}
                  error={errors.contact_person}
                />
                <TextField
                  label="Job title / role"
                  required
                  autoComplete="organization-title"
                  placeholder="e.g. Head Teacher"
                  value={form.job_title}
                  onChange={(e) => set("job_title", e.target.value)}
                  error={errors.job_title}
                />
                <TextField
                  label="Email address"
                  required
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@school.edu.ng"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  error={errors.email}
                />
                <TextField
                  label="Phone / WhatsApp"
                  required
                  type="tel"
                  autoComplete="tel"
                  placeholder="+234 801 234 5678"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  error={errors.phone}
                />
                <TextField
                  label="City / state / country"
                  required
                  placeholder="e.g. Lekki, Lagos, Nigeria"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  error={errors.location}
                />
              </div>
            )}

            {step.id === "school" && (
              <div className="space-y-6">
                <div>
                  <Label>School type</Label>
                  <RadioCards
                    options={SCHOOL_TYPES}
                    value={form.school_type}
                    onChange={(v) => set("school_type", v)}
                  />
                  <FieldError msg={errors.school_type} />
                </div>
                <NumberField
                  label="Approximate number of students"
                  required
                  placeholder="e.g. 420"
                  value={form.student_count}
                  onChange={(e) => set("student_count", e.target.value)}
                  error={errors.student_count}
                />
                <NumberField
                  label="Number of teachers"
                  placeholder="e.g. 30"
                  value={form.teacher_count}
                  onChange={(e) => set("teacher_count", e.target.value)}
                />
                <TextField
                  label="Current LMS / learning platform"
                  hint="If you use one already"
                  placeholder="e.g. Google Classroom"
                  value={form.current_lms}
                  onChange={(e) => set("current_lms", e.target.value)}
                />
              </div>
            )}

            {step.id === "package" && (
              <div className="space-y-6">
                <div>
                  <Label required>Package you are interested in</Label>
                  <PackagePicker
                    value={form.package}
                    onChange={(v) => {
                      set("package", v);
                      set("tablet_option", "with");
                    }}
                    tabletOption={form.tablet_option}
                    onTabletOption={(v) => set("tablet_option", v)}
                  />
                  <FieldError msg={errors.package} />
                </div>
                <NumberField
                  label="Number of student licenses"
                  required
                  placeholder="e.g. 420"
                  value={form.student_licenses}
                  onChange={(e) => set("student_licenses", e.target.value)}
                  error={errors.student_licenses}
                />

                <div>
                  <Label hint="Choose any that could work for your school">
                    Preferred subscription duration
                  </Label>
                  <CheckList
                    options={SUBSCRIPTION_DURATIONS}
                    values={form.subscription_durations}
                    onToggle={(id) => toggleIn("subscription_durations", id)}
                  />
                </div>
              </div>
            )}

            {step.id === "launch" && (
              <div className="space-y-6">
                <label className="block">
                  <Label required>Desired implementation date</Label>
                  <input
                    type="date"
                    className={inputBase}
                    value={form.implementation_date}
                    onChange={(e) => set("implementation_date", e.target.value)}
                  />
                  <FieldError msg={errors.implementation_date} />
                </label>
                <div>
                  <Label>Is this for the current or next academic year?</Label>
                  <RadioCards
                    options={ACADEMIC_YEAR_OPTIONS}
                    value={form.academic_year}
                    onChange={(v) => set("academic_year", v)}
                  />
                  <FieldError msg={errors.academic_year} />
                </div>
                <div>
                  <Label>Would you like a product demonstration?</Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <OptionRow
                      selected={form.demo_requested === true}
                      onClick={() => set("demo_requested", true)}
                    >
                      Yes
                    </OptionRow>
                    <OptionRow
                      selected={form.demo_requested === false}
                      onClick={() => set("demo_requested", false)}
                    >
                      No
                    </OptionRow>
                  </div>
                </div>
              </div>
            )}

            {step.id === "requirements" && (
              <label className="block">
                <Label hint="Curriculum, integrations, training, or specific features your school needs.">
                  Additional requirements
                </Label>
                <textarea
                  rows={6}
                  className={`${inputBase} resize-none`}
                  placeholder="Tell us what matters for your school…"
                  value={form.additional_requirements}
                  onChange={(e) =>
                    set("additional_requirements", e.target.value)
                  }
                />
              </label>
            )}

            {step.id === "review" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <SummaryRow label="School" value={form.school_org_name} />
                  <SummaryRow
                    label="Contact"
                    value={[form.contact_person, form.job_title]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <SummaryRow label="Email" value={form.email} />
                  <SummaryRow label="Phone" value={form.phone} />
                  <SummaryRow label="Location" value={form.location} />
                  <SummaryRow
                    label="School type"
                    value={
                      form.school_type &&
                      labelFor(SCHOOL_TYPES, form.school_type)
                    }
                  />
                  <SummaryRow label="Students" value={form.student_count} />
                  <SummaryRow label="Teachers" value={form.teacher_count} />
                  <SummaryRow
                    label="Package"
                    value={
                      form.package && labelFor(PREORDER_PACKAGES, form.package)
                    }
                  />
                  {getPackage(form.package)?.hasTabletOption && (
                    <SummaryRow
                      label="Smart Tablet"
                      value={labelFor(TABLET_OPTIONS, form.tablet_option)}
                    />
                  )}
                  {getPackage(form.package) && (
                    <SummaryRow
                      label="List price"
                      value={`${fmtNGN(
                        packagePrice(
                          getPackage(form.package),
                          form.tablet_option,
                        ).ngn,
                      )} ${
                        getPackage(form.package).hasTabletOption
                          ? "per student"
                          : "per kit"
                      }`}
                    />
                  )}
                  <SummaryRow
                    label="Student licenses"
                    value={form.student_licenses}
                  />
                  <SummaryRow
                    label="Duration"
                    value={form.subscription_durations
                      .map((d) => labelFor(SUBSCRIPTION_DURATIONS, d))
                      .join(", ")}
                  />
                  <SummaryRow
                    label="Implementation date"
                    value={form.implementation_date}
                  />
                  <SummaryRow
                    label="Academic year"
                    value={
                      form.academic_year &&
                      labelFor(ACADEMIC_YEAR_OPTIONS, form.academic_year)
                    }
                  />
                  <SummaryRow
                    label="Demo"
                    value={
                      form.demo_requested === null
                        ? ""
                        : form.demo_requested
                          ? "Yes"
                          : "No"
                    }
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreed_preorder}
                    onChange={(e) => set("agreed_preorder", e.target.checked)}
                    className="w-5 h-5 mt-0.5 accent-primary shrink-0"
                  />
                  <span className="text-[15px] text-gray-600 leading-relaxed">
                    I understand that submitting this form is a pre-order
                    request and does not constitute final payment or a binding
                    purchase agreement.
                  </span>
                </label>
                <FieldError msg={errors.agreed_preorder} />

                {status === "error" && (
                  <p className="text-sm text-rose-600 font-medium bg-rose-50 rounded-xl px-4 py-3">
                    {submitError}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop nav: inline below the step */}
        <div className="hidden sm:flex items-center justify-between mt-10">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <span />
          )}
          <StepButton
            isLast={isLast}
            status={status}
            onNext={next}
            onSubmit={submit}
          />
        </div>
      </div>

      {/* Mobile action bar: pinned, thumb-reachable, respects the home indicator */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center justify-center gap-1.5 h-12 px-4 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <div className="flex-1">
            <StepButton
              isLast={isLast}
              status={status}
              onNext={next}
              onSubmit={submit}
              block
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepButton({ isLast, status, onNext, onSubmit, block = false }) {
  const width = block ? "w-full" : "";
  if (!isLast) {
    return (
      <button
        type="button"
        onClick={onNext}
        className={`${width} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20`}
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={status === "loading"}
      className={`${width} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-coral text-white text-sm font-bold hover:bg-coral/90 transition-colors shadow-lg shadow-coral/30 disabled:opacity-60`}
    >
      {status === "loading" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Sending…
        </>
      ) : (
        <>
          Request K12 Pre-Order <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
