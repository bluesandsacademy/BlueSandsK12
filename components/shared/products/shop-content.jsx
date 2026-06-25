"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  ShoppingBag,
  ChevronDown,
  CalendarCheck,
  ListOrdered,
  MessageCircle,
  School,
} from "lucide-react";
import { products, preorderSteps, fmtUSD, fmtNGN } from "@/lib/products";
import {
  FloatAtom,
  FloatPlanet,
  FloatSparkle,
} from "@/components/shared/k12-ar-pedia/science-floats";

function ProductCard({ p, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex flex-col rounded-[2rem] bg-white border-4 overflow-hidden shadow-[0_10px_0_rgba(0,0,0,0.06)]"
      style={{ borderColor: p.color }}
    >
      {/* Image placeholder */}
      <Link
        href={`/products/${p.slug}`}
        className="relative aspect-[16/10] flex items-center justify-center group"
        style={{ background: p.gradient }}
      >
        <p.Icon className="w-20 h-20 sm:w-24 sm:h-24 text-white drop-shadow-xl kid-float" strokeWidth={1.75} />
        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 text-xs font-extrabold text-secondary">
          Pre-order now
        </span>
        <FloatSparkle className="absolute top-4 right-4 opacity-80" size={28} color="#ffffff" />
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div>
          <h3 className="font-display font-bold text-secondary text-xl sm:text-2xl leading-tight">
            {p.name.replace("Blue Sands ", "")}
          </h3>
          <p className="text-gray-500 text-base font-semibold mt-1">{p.blurb}</p>
        </div>

        {/* Price box */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: `${p.color}14` }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">Full Price</p>
            <p className="font-display font-bold text-2xl" style={{ color: p.color }}>
              {fmtUSD(p.priceUSD)}
            </p>
            <p className="text-xs font-bold text-gray-400">{fmtNGN(p.priceNGN)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">Payment</p>
            <p className="font-display font-bold text-lg text-secondary">Pay in Full</p>
            <p className="text-xs font-bold text-gray-400">Secure checkout</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2 flex-1">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: p.color }} strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex gap-3 pt-1">
          <Link
            href={`/products/${p.slug}`}
            className="flex-1 text-center rounded-xl bg-white px-4 py-3 font-display font-bold text-secondary border-2 border-secondary/10 shadow-[0_5px_0_rgba(2,52,90,0.12)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(2,52,90,0.12)] transition-all"
          >
            Details
          </Link>
          <Link
            href={`/preorder?product=${p.slug}`}
            className="flex-1 text-center rounded-xl px-4 py-3 font-display font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.18)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(0,0,0,0.18)] transition-all"
            style={{ background: p.color }}
          >
            Preorder
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopContent() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky/25 via-cream to-cream">
        <div className="absolute top-16 left-8 w-10 h-10 bg-coral/30 blob-1 kid-float pointer-events-none" />
        <FloatSparkle className="absolute top-24 left-1/3 opacity-60" size={28} color="#9B5DE5" />

        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-sunshine px-5 py-2.5 text-secondary font-extrabold text-sm sm:text-base shadow-[0_5px_0_rgba(0,0,0,0.08)] kid-wobble">
                <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
                The AR Media Shop
              </div>

              <h1 className="font-display font-bold text-secondary leading-[1.06] text-[2.4rem] sm:text-5xl lg:text-[3.4rem]">
                Immersive EdTech Education for K–12{" "}
                <span className="text-primary doodle-underline">Starts Here</span>
              </h1>

              <p className="mx-auto lg:mx-0 max-w-xl text-lg sm:text-xl text-gray-600 font-semibold leading-snug">
                Transform classrooms into interactive STEM learning environments
                with next-generation AR and immersive learning hardware designed
                for modern schools, teachers, and young innovators.
              </p>

              <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-gray-500 font-semibold leading-relaxed">
                Pre-order immersive STEM devices today with{" "}
                <span className="font-display font-bold text-coral">secure full payment</span>{" "}
                and position your school at the forefront of digital learning
                innovation.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-1">
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
                >
                  Browse Devices
                  <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
                </Link>
                <a
                  href="https://calendly.com/bluesandstemlabs/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all border-2 border-secondary/10"
                >
                  <CalendarCheck className="w-5 h-5 text-primary" strokeWidth={2.5} />
                  Book a Demo
                </a>
              </div>
            </motion.div>

            {/* Right — device preview cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <FloatPlanet className="absolute -top-6 -right-2 z-10 opacity-90" size={80} />
              <FloatAtom className="absolute -bottom-6 -left-4 z-10 opacity-60" size={64} />
              <div className="grid grid-cols-2 gap-4 sm:gap-5 max-w-md mx-auto">
                {products.map((p, i) => (
                  <div
                    key={p.slug}
                    className="rounded-[1.6rem] bg-white border-4 p-4 shadow-[0_8px_0_rgba(0,0,0,0.06)] kid-float"
                    style={{ borderColor: p.color, animationDelay: `${i * 0.4}s` }}
                  >
                    <div
                      className="aspect-square rounded-2xl flex items-center justify-center mb-3"
                      style={{ background: p.gradient }}
                    >
                      <p.Icon className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={1.75} />
                    </div>
                    <p className="font-display font-bold text-secondary text-sm leading-tight text-center">
                      {p.name.replace("Blue Sands ", "")}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full" style={{ height: 56 }}>
            <path fill="#FFFBF0" d="M0,50 C240,90 480,10 720,40 C960,70 1200,10 1440,40 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      {/* ── Product grid ── */}
      <section id="products" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" style={{ background: "#FFFBF0" }}>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How pre-order works ── */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}>
        <FloatSparkle className="absolute top-16 right-1/4 opacity-60" size={32} color="#FFC83D" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-grass px-5 py-2.5 text-white font-extrabold text-sm sm:text-base shadow-[0_5px_0_rgba(0,0,0,0.1)] kid-wobble">
              <ListOrdered className="w-4 h-4" strokeWidth={2.5} />
              Easy as 1-2-3-4
            </div>
            <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
              How Pre-Order{" "}
              <span className="text-grass doodle-underline">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {preorderSteps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative flex flex-col items-center text-center gap-3 rounded-[1.8rem] bg-white p-7 border-4 border-primary/15 shadow-[0_8px_0_rgba(0,0,0,0.06)]"
              >
                <span className="absolute -top-4 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-lg shadow-md kid-wobble bg-primary">
                  {i + 1}
                </span>
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                  <s.Icon className="w-9 h-9 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-secondary text-lg leading-tight">{s.title}</h3>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional purchase ── */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" style={{ background: "#FFFBF0" }}>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.2rem] bg-secondary text-white p-8 sm:p-12 relative overflow-hidden"
          >
            <FloatPlanet className="absolute -top-4 -right-2 opacity-60" size={110} />
            <div className="relative max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-sunshine px-5 py-2.5 text-secondary font-extrabold text-sm shadow-[0_4px_0_rgba(0,0,0,0.15)]">
                <School className="w-4 h-4" strokeWidth={2.5} />
                For Schools &amp; Institutions
              </div>
              <h2 className="font-display font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl">
                Bulk &amp; Institutional{" "}
                <span className="text-sunshine">Pre-Orders</span>
              </h2>
              <p className="text-white/80 text-lg font-semibold">
                We support bulk pre-orders for schools, STEM centers, academies, and
                educational organizations — with everything you need to roll out smoothly.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  "Bulk pricing options",
                  "Deployment support",
                  "Teacher onboarding & training",
                  "Dedicated customer success",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-grass shrink-0" strokeWidth={2.5} />
                    <span className="font-semibold text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/preorder"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
                >
                  Start a Bulk Order
                </Link>
                <a
                  href="https://calendly.com/bluesandstemlabs/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-8 py-4 text-white font-display font-bold text-lg border-2 border-white/20 hover:bg-white/20 transition-all"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
                  Talk to Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
