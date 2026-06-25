"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { XCircle, CheckCircle2, BookX, Tablet, ArrowRight } from "lucide-react";
import SectionKicker from "./section-kicker";

const BORED = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=85";
const ENGAGED = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=85";

const columns = [
  {
    side: "before",
    eyebrow: "Traditional Reading",
    title: "Bored Children",
    img: BORED,
    Icon: BookX,
    accent: "#dc2626",
    tint: "rgba(160,0,0,0.55)",
    points: [
      "Passive memorisation from static pages",
      "Low engagement and short attention",
      "Abstract concepts that are hard to picture",
      "One-size-fits-all, outdated textbooks",
    ],
  },
  {
    side: "after",
    eyebrow: "K12 AR Pedia",
    title: "Engaged Learners",
    img: ENGAGED,
    Icon: Tablet,
    accent: "#10b981",
    tint: "rgba(2,52,90,0.55)",
    points: [
      "Hands-on AR exploration on smart tablets",
      "High curiosity and full participation",
      "Concepts brought alive in interactive 3D",
      "Adaptive, immersive, curriculum-aligned",
    ],
  },
];

function CompareCard({ col, index }) {
  const isAfter = col.side === "after";
  const PointIcon = isAfter ? CheckCircle2 : XCircle;
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="relative rounded-[1.8rem] overflow-hidden border-4 bg-white shadow-[0_12px_0_rgba(0,0,0,0.06)]"
      style={{ borderColor: col.accent }}
    >
      {/* Photo header */}
      <div className="relative aspect-[16/10]">
        <img
          src={col.img}
          alt={col.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: isAfter ? "none" : "grayscale(0.4)" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, transparent 0%, ${col.tint} 100%)` }} />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md"
          >
            <col.Icon className="w-5 h-5" style={{ color: col.accent }} strokeWidth={2.5} />
          </div>
          <span
            className="px-3 py-1.5 rounded-full text-white text-xs font-extrabold"
            style={{ background: col.accent }}
          >
            {col.eyebrow}
          </span>
        </div>
        <h3 className="absolute bottom-4 left-4 font-display font-bold text-white text-2xl sm:text-3xl drop-shadow-lg">
          {col.title}
        </h3>
      </div>

      {/* Points */}
      <ul className="p-5 sm:p-6 space-y-3">
        {col.points.map((pt) => (
          <li key={pt} className="flex items-start gap-3">
            <PointIcon
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: col.accent }}
              strokeWidth={2.5}
            />
            <span className="text-sm sm:text-base font-semibold text-gray-700 leading-snug">
              {pt}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-slate-50">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4 max-w-3xl mx-auto"
        >
          <SectionKicker className="text-coral">See the Difference</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            Two Very Different{" "}
            <span className="text-coral doodle-underline">Classrooms</span>
          </h2>
        </motion.div>

        {/* Two cards with VS badge */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          {columns.map((col, i) => (
            <CompareCard key={col.side} col={col} index={i} />
          ))}

          {/* VS badge */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-secondary text-white font-display font-black text-xl items-center justify-center shadow-xl border-4 border-white">
            VS
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/preorder"
            className="inline-flex items-center gap-2 rounded-2xl bg-coral px-9 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
          >
            Bring AR to Your Classroom
            <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
