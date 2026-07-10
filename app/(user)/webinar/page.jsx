"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video, CalendarDays, Clock, CheckCircle2, Loader2, ArrowRight,
} from "lucide-react";
import { WEBINAR, DESIGNATIONS } from "@/lib/webinar";

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

export default function WebinarPage() {
  const [form, setForm] = useState({
    full_name: "",
    designation: "",
    designation_other: "",
    school: "",
    location: "",
    student_count: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");
  // Only ever set from the API's response, so the link is never in the bundle.
  const [joinUrl, setJoinUrl] = useState("");

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const isOther = form.designation === "Other";
  const resolvedDesignation = isOther ? form.designation_other.trim() : form.designation;

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Your name is required.";
    if (!form.designation) e.designation = "Please select your designation.";
    if (isOther && !form.designation_other.trim()) e.designation_other = "Please tell us your role.";
    if (!form.school.trim()) e.school = "Your school name is required.";
    if (!form.location.trim()) e.location = "Your location is required.";
    const students = parseInt(form.student_count, 10);
    if (!Number.isInteger(students) || students < 1) e.student_count = "Enter your approximate student count.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "A valid email is required.";
    if (!form.phone.trim()) e.phone = "Your phone number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/k12-ar-pedia/webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          designation: resolvedDesignation,
          school: form.school,
          location: form.location,
          student_count: form.student_count,
          email: form.email,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      setJoinUrl(data.join_url || "");
      setStatus("success");
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  const whenChips = [
    WEBINAR.dateLabel && { Icon: CalendarDays, text: WEBINAR.dateLabel },
    WEBINAR.timeLabel && { Icon: Clock, text: WEBINAR.timeLabel },
  ].filter(Boolean);

  if (status === "success") {
    return (
      <div className="overflow-x-hidden bg-cream min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 rounded-full bg-grass/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-grass" strokeWidth={1.75} />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-secondary mb-3">
            You&apos;re registered!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Thank you, {form.full_name.split(" ")[0]}. Your seat for{" "}
            <span className="font-semibold text-secondary">{WEBINAR.title}</span> is reserved,
            and we&apos;ve emailed the joining link to{" "}
            <span className="font-semibold text-secondary">{form.email}</span>.
          </p>
          {joinUrl ? (
            <>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Use the button below to open the webinar page and add it to your calendar.
              </p>

              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
              >
                <Video className="w-4 h-4" strokeWidth={2.5} /> Join the Webinar
                <ArrowRight className="w-4 h-4" />
              </a>

              <p className="mt-5 text-xs text-gray-400 break-all">
                Or copy this link:{" "}
                <a href={joinUrl} className="text-primary font-semibold underline" target="_blank" rel="noopener noreferrer">
                  {joinUrl}
                </a>
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm leading-relaxed">
              Check your inbox for the joining link. If it doesn&apos;t arrive, contact us and
              we&apos;ll send it over.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-grape/20 via-cream to-cream">
        <div className="absolute -top-12 -right-12 w-52 h-52 bg-sunshine/30 blob-1 pointer-events-none" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sunshine px-5 py-2.5 text-secondary font-extrabold text-sm sm:text-base shadow-[0_6px_0_rgba(0,0,0,0.08)] kid-wobble">
            <Video className="w-5 h-5" strokeWidth={2.5} />
            Free Live Webinar
          </div>

          <h1 className="mt-6 font-display font-bold text-secondary leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
            {WEBINAR.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600 font-semibold">
            {WEBINAR.subtitle}
          </p>

          {whenChips.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {whenChips.map(({ Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-gray-200 px-4 py-2 text-sm font-bold text-secondary"
                >
                  <Icon className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  {text}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8 items-start">
          {/* What you'll get */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 lg:sticky lg:top-8 space-y-4"
          >
            <div className="rounded-3xl bg-secondary p-6 sm:p-7 text-white shadow-sm">
              <h2 className="font-display text-xl font-bold mb-4">What you&apos;ll take away</h2>
              <ul className="space-y-3.5">
                {WEBINAR.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-grass shrink-0 mt-0.5" strokeWidth={2.25} />
                    <span className="text-sm text-white/80 font-semibold leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white border-2 border-primary/20 p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                Register once and the joining link is yours, shown here straight away and sent to your inbox.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={submit}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-5"
            >
              <div>
                <h2 className="font-display text-xl font-bold text-secondary">Reserve your seat</h2>
                <p className="text-gray-500 text-sm mt-1">Takes under a minute. Attendance is free.</p>
              </div>

              <div>
                <Label required>Full Name</Label>
                <Input
                  placeholder="e.g. Chukwuemeka Obi"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                />
                <FieldError msg={errors.full_name} />
              </div>

              <div>
                <Label required>Designation</Label>
                <select
                  value={form.designation}
                  onChange={(e) => set("designation", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm text-gray-800 bg-white appearance-none transition-colors"
                >
                  <option value="">Select your role…</option>
                  {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <FieldError msg={errors.designation} />

                {isOther && (
                  <div className="mt-3">
                    <Input
                      placeholder="Tell us your role"
                      value={form.designation_other}
                      onChange={(e) => set("designation_other", e.target.value)}
                    />
                    <FieldError msg={errors.designation_other} />
                  </div>
                )}
              </div>

              <div>
                <Label required>School</Label>
                <Input
                  placeholder="e.g. Bright Stars Academy"
                  value={form.school}
                  onChange={(e) => set("school", e.target.value)}
                />
                <FieldError msg={errors.school} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label required>Location</Label>
                  <Input
                    placeholder="e.g. Lekki, Lagos"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                  <FieldError msg={errors.location} />
                </div>
                <div>
                  <Label required>Number of Students</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    placeholder="e.g. 250"
                    value={form.student_count}
                    onChange={(e) => set("student_count", e.target.value)}
                  />
                  <FieldError msg={errors.student_count} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              </div>

              {status === "error" && (
                <p className="text-sm text-rose-500 font-medium bg-rose-50 rounded-xl px-4 py-3">{errMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 rounded-xl bg-coral text-white font-bold text-sm hover:bg-coral/90 transition-colors shadow-lg shadow-coral/30 disabled:opacity-60"
              >
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Reserving your seat…</>
                ) : (
                  <>Register &amp; Get the Link <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                We&apos;ll only use your details to send you the joining link and updates about this webinar.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
