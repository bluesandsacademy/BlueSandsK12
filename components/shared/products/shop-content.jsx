"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  CalendarCheck,
  MessageCircle,
} from "lucide-react";
import { products, howItWorks, fmtUSD } from "@/lib/products";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import {
  FloatAtom,
  FloatPlanet,
  FloatSparkle,
} from "@/components/shared/k12-ar-pedia/science-floats";

const DEMO_URL = "https://calendly.com/bluesandstemlabs/30min";

function ProductCard({ p, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={`/products/${p.slug}`}
        className="group flex flex-col h-full rounded-4xl bg-white border-4 overflow-hidden shadow-[0_10px_0_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform"
        style={{ borderColor: p.color }}
      >
        {/* Image — the star, floating on white like the source */}
        <div className="relative aspect-4/3 flex items-center justify-center p-5">
          <span
            className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-extrabold text-white shadow-sm"
            style={{ background: p.color }}
          >
            {p.ageRange}
          </span>
          <Image
            src={p.image}
            alt={p.name}
            width={p.imageW}
            height={p.imageH}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw"
            className="w-full h-full object-contain drop-shadow-[0_14px_22px_rgba(2,52,90,0.16)] group-hover:scale-[1.04] transition-transform duration-500"
          />
        </div>

        {/* Minimal footer */}
        <div className="px-6 pb-6 pt-1">
          <h3 className="font-display font-bold text-secondary text-xl sm:text-2xl leading-tight">
            {p.name}
          </h3>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">{p.blurb}</p>
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="text-[11px] uppercase tracking-wide font-bold text-gray-400">From</span>
              <p className="font-display font-bold text-2xl leading-none mt-0.5" style={{ color: p.color }}>
                {fmtUSD(p.priceUSD)}
              </p>
              <p className="text-xs font-bold text-gray-400 mt-1">
                {p.variants.map((v) => `${v.label} ${fmtUSD(v.priceUSD)}`).join(" · ")}
              </p>
            </div>
            <span
              className="font-display font-bold text-sm group-hover:translate-x-0.5 transition-transform"
              style={{ color: p.color }}
            >
              View →
            </span>
          </div>
        </div>
      </Link>
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
              <SectionKicker className="text-primary">The ARpedia Collection</SectionKicker>

              <h1 className="font-display font-bold text-secondary leading-[1.06] text-[2.4rem] sm:text-5xl lg:text-[3.4rem]">
                AR Books That Leap{" "}
                <span className="text-primary doodle-underline">Off the Page</span>
              </h1>

              <p className="mx-auto lg:mx-0 max-w-xl text-lg sm:text-xl text-gray-600 font-semibold leading-snug">
                Point a tablet at the page and watch animals, planets and
                experiments come to life. Real STEM learning, made for curious
                kids ages 4–13.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-1">
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
                >
                  Browse the Books
                  <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
                </Link>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all border-2 border-secondary/10"
                >
                  <CalendarCheck className="w-5 h-5 text-primary" strokeWidth={2.5} />
                  Book a Demo
                </a>
              </div>
            </motion.div>

            {/* Right — book preview cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <FloatPlanet className="absolute -top-6 -right-2 z-10 opacity-90" size={80} />
              <FloatAtom className="absolute -bottom-6 -left-4 z-10 opacity-60" size={64} />
              <div className="grid grid-cols-3 gap-4 sm:gap-5 max-w-md mx-auto">
                {products.map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="rounded-[1.4rem] bg-white border-4 p-3 shadow-[0_8px_0_rgba(0,0,0,0.06)] kid-float"
                    style={{ borderColor: p.color, animationDelay: `${i * 0.4}s` }}
                  >
                    <div className="aspect-square rounded-xl flex items-center justify-center mb-2 p-1">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={p.imageW}
                        height={p.imageH}
                        sizes="120px"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-display font-bold text-secondary text-[11px] sm:text-xs leading-tight text-center">
                      {p.name}
                    </p>
                  </Link>
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p.slug} p={p} index={i} />
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm font-semibold mt-8">
            Every book is read with <span className="text-secondary">Spotty</span>, the giraffe tablet holder —
            choose the Mirror or Camera edition. A tablet is not included.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}>
        <FloatSparkle className="absolute top-16 right-1/4 opacity-60" size={32} color="#FFC83D" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-14 space-y-3"
          >
            <SectionKicker className="text-grass">As Easy as Scan &amp; Watch</SectionKicker>
            <h2 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
              How the AR Books{" "}
              <span className="text-grass doodle-underline">Work</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {howItWorks.map((s, i) => (
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

      {/* ── Schools & bulk ── */}
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
              <SectionKicker className="text-sunshine">For Schools &amp; Centres</SectionKicker>
              <h2 className="font-display font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl">
                Bringing AR books to your{" "}
                <span className="text-sunshine">classroom</span>
              </h2>
              <p className="text-white/80 text-lg font-semibold">
                Kitting out a school, STEM centre or learning club? We help you
                roll out the AR books and Spotty kits across classrooms — with
                training and support for your teachers.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  "Bulk orders for classrooms",
                  "Teacher onboarding & training",
                  "Set-up and rollout support",
                  "Works online or offline",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-grass shrink-0" strokeWidth={2.5} />
                    <span className="font-semibold text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
                >
                  <CalendarCheck className="w-5 h-5" strokeWidth={2.5} />
                  Book a Demo
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-8 py-4 text-white font-display font-bold text-lg border-2 border-white/20 hover:bg-white/20 transition-all"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
                  Talk to Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
