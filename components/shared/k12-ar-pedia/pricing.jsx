"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, GraduationCap, CheckCircle2, Star, Award } from "lucide-react";

const plans = [
  {
    id: "family",
    planParam: "family",
    badge: "Most Popular",
    Icon: Users,
    iconBg: "bg-amber-400",
    iconShadow: "shadow-amber-400/50",
    name: "Smart Family STEM Pack",
    tagline: "For parents, homeschool families & multi-child households.",
    cardBg: "from-amber-50 via-orange-50 to-yellow-50",
    border: "border-amber-200",
    priceBg: "bg-amber-100/70",
    accentText: "text-amber-600",
    checkBg: "bg-amber-400/15",
    checkColor: "text-amber-600",
    glow: "bg-amber-300/20",
    ctaPrimary: "bg-amber-400 hover:bg-amber-500 text-white shadow-xl shadow-amber-400/30",
    ctaSecondary: "border-amber-300 text-amber-700 hover:bg-amber-50",
    fullUSD: 150, fullNGN: 210000,
    depositUSD: 45, depositNGN: 63000,
    highlights: [
      "1 AR Pedia Tablet",
      "5 Interactive AR Books",
      "STEM Challenges & Activities",
      "Parent Support Community",
      "Monthly STEM Challenges",
      "Learning Analytics Dashboard",
    ],
    popular: true,
  },
  {
    id: "school",
    planParam: "school",
    badge: "For Schools",
    Icon: GraduationCap,
    iconBg: "bg-primary",
    iconShadow: "shadow-primary/50",
    name: "Smart Classroom Starter",
    tagline: "For nursery & primary schools with 100–300 students.",
    cardBg: "from-blue-50 via-sky-50 to-indigo-50",
    border: "border-blue-200",
    priceBg: "bg-blue-100/70",
    accentText: "text-primary",
    checkBg: "bg-primary/10",
    checkColor: "text-primary",
    glow: "bg-blue-300/20",
    ctaPrimary: "bg-primary hover:bg-secondary text-white shadow-xl shadow-primary/30",
    ctaSecondary: "border-blue-300 text-primary hover:bg-blue-50",
    fullUSD: 300, fullNGN: 420000,
    depositUSD: 90, depositNGN: 126000,
    highlights: [
      "5–10 AR Pedia Tablets",
      "Classroom AR Book Library",
      "Teacher Orientation",
      "Classroom Deployment Setup",
      "School LMS Access",
      "STEM Showcase Session",
      "Basic Technical Support",
    ],
    popular: false,
  },
];

export default function K12PricingSection() {
  const [currency, setCurrency] = useState("ngn");

  const fmt = (usd, ngn) =>
    currency === "usd" ? `$${usd.toLocaleString()}` : `₦${ngn.toLocaleString()}`;

  return (
    <section
      id="pricing"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
            <Star className="w-4 h-4" />
            Choose Your Plan
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            One Plan.{" "}
            <span className="text-primary">Infinite Discovery.</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg" style={{ fontFamily: "var(--font-jarkata)" }}>
            Pick the right fit — for home or for school.
          </p>

          {/* Currency toggle */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <span className={`text-sm font-bold ${currency === "usd" ? "text-secondary" : "text-gray-400"}`}>USD</span>
            <button
              onClick={() => setCurrency(currency === "usd" ? "ngn" : "usd")}
              aria-label="Toggle currency"
              className="relative w-14 h-7 bg-primary rounded-full transition-all duration-300 shadow-inner"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${currency === "ngn" ? "translate-x-7" : ""}`}
              />
            </button>
            <span className={`text-sm font-bold ${currency === "ngn" ? "text-secondary" : "text-gray-400"}`}>NGN</span>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.12 }}
              className="relative"
            >
              {/* Floating "Most Popular" badge above card */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-amber-400 text-white text-xs font-black shadow-lg shadow-amber-400/40 whitespace-nowrap"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`relative rounded-3xl border-2 ${plan.border} bg-linear-to-br ${plan.cardBg} p-7 sm:p-8 flex flex-col gap-6 overflow-hidden h-full`}
                style={{
                  boxShadow: plan.popular
                    ? "0 20px 60px rgba(245,158,11,0.18), 0 0 0 2px rgba(245,158,11,0.3)"
                    : "0 20px 60px rgba(4,131,226,0.12)",
                }}
              >
                {/* Decorative background glow */}
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${plan.glow} pointer-events-none blur-2xl`} />

                {/* Icon + name */}
                <div className="flex items-start gap-4 relative">
                  <div
                    className={`w-20 h-20 rounded-2xl ${plan.iconBg} flex items-center justify-center shadow-2xl ${plan.iconShadow} shrink-0`}
                  >
                    <plan.Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="pt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${plan.popular ? "bg-amber-400/20 text-amber-700" : "bg-primary/10 text-primary"}`}
                    >
                      {plan.badge}
                    </span>
                    <h3
                      className="text-lg font-black text-secondary leading-tight"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {plan.name}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed -mt-2" style={{ fontFamily: "var(--font-jarkata)" }}>
                  {plan.tagline}
                </p>

                {/* Price box */}
                <div className={`rounded-2xl p-5 ${plan.priceBg} border ${plan.border}`}>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Full Price</p>
                  <p
                    className={`text-4xl font-black ${plan.accentText} leading-none`}
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {fmt(plan.fullUSD, plan.fullNGN)}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">30% Deposit</p>
                      <p className="text-xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
                        {fmt(plan.depositUSD, plan.depositNGN)}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      Reserve Now
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full ${plan.checkBg} flex items-center justify-center shrink-0`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${plan.checkColor}`} strokeWidth={2.5} />
                      </div>
                      <span
                        className="text-sm font-medium text-gray-700"
                        style={{ fontFamily: "var(--font-jarkata)" }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    href={`/products/k12-ar-pedia/preorder?plan=${plan.planParam}`}
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-base transition-all duration-300 ${plan.ctaPrimary}`}
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    <Award className="w-5 h-5 shrink-0" />
                    Preorder {plan.popular ? "Family Pack" : "School Pack"}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-400 text-sm mt-10"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          All prices include setup and onboarding support. Early access slots are limited.
        </motion.p>
      </div>
    </section>
  );
}
