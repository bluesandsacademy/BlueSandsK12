"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, CalendarCheck, BookOpen, Package, Tablet } from "lucide-react";
import { products, getProduct, howItWorks, buyUrl, TABLET_NGN } from "@/lib/products";
import AppStores from "@/components/shared/products/app-stores";
import Price from "@/components/common/price";
import CurrencyNote from "@/components/common/currency-note";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import {
  FloatPlanet,
  FloatSparkle,
} from "@/components/shared/k12-ar-pedia/science-floats";

const DEMO_URL = "https://calendly.com/bluesandstemlabs/30min";

export default function ProductDetail({ slug }) {
  // Resolve the product (incl. its lucide Icon) on the client so the
  // component never has to be serialized across the server boundary.
  const p = getProduct(slug);
  if (!p) return null;
  const others = products.filter((x) => x.slug !== p.slug);
  const buyHref = buyUrl(p) || DEMO_URL;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky/20 via-cream to-cream">
        <div className="absolute top-16 left-8 w-10 h-10 bg-coral/30 blob-1 kid-float pointer-events-none" />
        <FloatSparkle className="absolute top-24 right-1/4 opacity-60" size={30} color="#FFC83D" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-secondary font-bold mb-8 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-4xl border-4 overflow-hidden aspect-square flex items-center justify-center p-8 bg-white shadow-[0_14px_0_rgba(0,0,0,0.08)]"
              style={{ borderColor: p.color }}
            >
              <span
                className="absolute top-5 left-5 z-10 px-4 py-1.5 rounded-full text-xs font-extrabold text-white shadow-sm"
                style={{ background: p.color }}
              >
                {p.ageRange}
              </span>
              <Image
                src={p.image}
                alt={p.name}
                width={p.imageW}
                height={p.imageH}
                preload
                sizes="(min-width: 1024px) 480px, 90vw"
                className="w-full h-full object-contain drop-shadow-[0_16px_28px_rgba(2,52,90,0.18)] kid-float"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <SectionKicker className="text-primary">AR Book · {p.ageRange}</SectionKicker>
              <h1 className="font-display font-bold text-secondary leading-[1.05] text-4xl sm:text-5xl">
                {p.name}
              </h1>
              <p className="text-gray-600 text-lg sm:text-2xl font-semibold leading-snug">
                {p.tagline}
              </p>

              {/* Pricing */}
              <div
                className="rounded-2xl p-5 border-2 flex items-center justify-between gap-4"
                style={{ background: `${p.color}10`, borderColor: `${p.color}40` }}
              >
                <div>
                  <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">
                    From
                  </p>
                  <p className="font-display font-black text-3xl leading-none mt-1" style={{ color: p.color }}>
                    <Price ngn={p.priceNGN} />
                  </p>
                </div>
                <p className="text-xs font-semibold text-gray-500 max-w-[46%] text-right">
                  Tablet not included, add one for <Price ngn={TABLET_NGN} />.
                </p>
              </div>

              {/* Currency control beside the price, not only in the header */}
              <CurrencyNote align="left" />

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={buyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
                >
                  Get Yours
                  <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
                </a>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg border-2 border-secondary/10 shadow-[0_8px_0_rgba(2,52,90,0.12)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.12)] transition-all"
                >
                  <CalendarCheck className="w-5 h-5" strokeWidth={2.5} />
                  Book a Demo
                </a>
              </div>

              {/* App included — Android + iOS */}
              <AppStores className="pt-2" />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full" style={{ height: 50 }}>
            <path fill="#FFFBF0" d="M0,50 C240,90 480,10 720,40 C960,70 1200,10 1440,40 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      {/* ── About + features ── */}
      <section className="relative py-14 sm:py-18 lg:py-24 overflow-hidden" style={{ background: "#FFFBF0" }}>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
              What makes it{" "}
              <span className="doodle-underline" style={{ color: p.color }}>special</span>
            </h2>
            <p className="text-gray-600 text-lg font-semibold leading-relaxed">{p.description}</p>
          </div>

          <div className="space-y-3">
            {p.features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 border-2 shadow-[0_5px_0_rgba(0,0,0,0.05)]"
                style={{ borderColor: `${p.color}33` }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${p.color}1f` }}
                >
                  <CheckCircle2 className="w-6 h-6" style={{ color: p.color }} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-secondary">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inside the package ── */}
      {p.package?.length > 0 && (
        <section className="relative py-14 sm:py-18 lg:py-24 overflow-hidden" style={{ background: "#FFFBF0" }}>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-3">
              <SectionKicker className="text-primary">What&apos;s in the box</SectionKicker>
              <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl">
                Inside the{" "}
                <span className="doodle-underline" style={{ color: p.color }}>package</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {p.package.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="flex items-start gap-4 rounded-2xl bg-white p-5 border-2 shadow-[0_5px_0_rgba(0,0,0,0.05)]"
                  style={{ borderColor: `${p.color}22` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${p.color}1f` }}
                  >
                    <Package className="w-5 h-5" style={{ color: p.color }} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-secondary leading-tight">{item.name}</p>
                    <p className="text-gray-500 text-sm font-semibold mt-0.5 leading-snug">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tablet callout — clearly not part of the kit */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-amber-50 border-2 border-amber-200 px-5 py-4">
              <Tablet className="w-6 h-6 text-amber-500 shrink-0" strokeWidth={2.2} />
              <p className="text-sm font-semibold text-amber-800">
                A tablet is <span className="font-bold">not included</span>. Spotty holds your own, or add one at checkout for <Price ngn={TABLET_NGN} />.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── What's included (series titles) ── */}
      {p.included?.length > 0 && (
        <section className="relative py-14 sm:py-18 lg:py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFBF0 0%, #EAF6FF 100%)" }}>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-3">
              <SectionKicker className="text-primary">8 Books · 130 Experiments</SectionKicker>
              <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl">
                The full science{" "}
                <span className="doodle-underline" style={{ color: p.color }}>series</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.included.map((title) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 border-2 border-primary/10 shadow-[0_5px_0_rgba(0,0,0,0.05)]"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" strokeWidth={2.25} />
                  </div>
                  <span className="font-bold text-secondary text-sm sm:text-base">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="relative py-14 sm:py-18 lg:py-24 overflow-hidden" style={{ background: "#FFFBF0" }}>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display font-bold text-secondary text-3xl sm:text-4xl lg:text-5xl mb-12">
            How the AR Books <span className="text-grass doodle-underline">Work</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {howItWorks.map((s, i) => (
              <div
                key={s.title}
                className="relative flex flex-col items-center text-center gap-2 rounded-[1.6rem] bg-white p-6 border-4 border-primary/15 shadow-[0_8px_0_rgba(0,0,0,0.06)]"
              >
                <span className="absolute -top-4 -left-3 w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white shadow-md bg-primary">
                  {i + 1}
                </span>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <s.Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-secondary leading-tight">{s.title}</h3>
                <p className="text-gray-600 text-sm font-semibold">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other products ── */}
      <section className="relative py-14 sm:py-18 lg:py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}>
        <FloatPlanet className="absolute top-10 right-8 opacity-40" size={70} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display font-bold text-secondary text-3xl sm:text-4xl mb-10">
            Explore More <span className="text-coral doodle-underline">Books</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/products/${o.slug}`}
                className="group flex flex-col rounded-[1.6rem] bg-white border-4 overflow-hidden shadow-[0_8px_0_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform"
                style={{ borderColor: o.color }}
              >
                <div className="relative aspect-square flex items-center justify-center p-4 bg-white">
                  <Image
                    src={o.image}
                    alt={o.name}
                    width={o.imageW}
                    height={o.imageH}
                    sizes="(min-width: 768px) 300px, 45vw"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-display font-bold text-secondary text-sm sm:text-base leading-tight">
                    {o.name}
                  </h3>
                  <p className="inline-flex items-center gap-1 text-primary text-sm font-bold mt-1 group-hover:translate-x-0.5 transition-transform">
                    View <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
