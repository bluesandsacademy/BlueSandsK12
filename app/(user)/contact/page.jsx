"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348139622583";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi, I'm interested in the Blue Sands K12 AR Pedia",
)}`;

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

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "A valid email is required.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Please enter a message (at least 10 characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/k12-ar-pedia/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setStatus("success");
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="overflow-x-hidden" style={{ background: "#FFFBF0" }}>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky/25 via-cream to-cream">
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sunshine px-5 py-2.5 text-secondary font-extrabold text-sm sm:text-base shadow-[0_6px_0_rgba(0,0,0,0.08)] kid-wobble">
            <Mail className="w-5 h-5" strokeWidth={2.5} />
            Get in Touch
          </div>
          <h1 className="mt-6 font-display font-bold text-secondary leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
            We&apos;d Love to{" "}
            <span className="text-primary doodle-underline">Hear From You</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600 font-semibold">
            Questions about K12 AR Pedia for your school or family? Send us a
            message and our team will get back to you.
          </p>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            {status === "success" ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={1.75} />
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-2" style={{ fontFamily: "var(--font-jarkata)" }}>
                  Message Sent!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Thank you, {form.name.split(" ")[0]}! We&apos;ve received your
                  message and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-5"
              >
                <div>
                  <Label required>Full Name</Label>
                  <Input
                    placeholder="e.g. Chukwuemeka Obi"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>}
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
                    {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="+234 801 234 5678"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label required>Message</Label>
                  <textarea
                    rows={5}
                    placeholder="How can we help?"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-colors resize-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.message}</p>}
                </div>

                {status === "error" && (
                  <p className="text-sm text-rose-500 font-medium bg-rose-50 rounded-xl px-4 py-3">
                    {errMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-secondary transition-colors shadow-lg shadow-primary/20 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Other channels */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-[#25D366]/30 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-bold text-secondary text-sm">Chat on WhatsApp</p>
                <p className="text-gray-500 text-sm mt-0.5">Fastest way to reach us — replies in minutes.</p>
              </div>
            </a>

            <a
              href="https://calendly.com/bluesandstemlabs/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-primary/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-bold text-secondary text-sm">Book a Free Demo</p>
                <p className="text-gray-500 text-sm mt-0.5">Schedule a 30-minute session with our team.</p>
              </div>
            </a>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-bold text-secondary text-sm">Call / WhatsApp</p>
                <p className="text-gray-500 text-sm mt-0.5">+{WA_NUMBER}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
