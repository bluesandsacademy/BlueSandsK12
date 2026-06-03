"use client";

import { motion } from "framer-motion";
import { Microscope, TrendingUp, Rocket, GraduationCap, BookOpen, Wifi } from "lucide-react";
import { FloatDNA, FloatSparkle } from "./science-floats";

const superpowers = [
  { Icon: Microscope, title: "Immersive STEM",       color: "bg-blue-500",    shadow: "shadow-blue-500/35",    light: "bg-blue-50",    border: "border-blue-100" },
  { Icon: TrendingUp, title: "Higher Engagement",    color: "bg-emerald-500", shadow: "shadow-emerald-500/35", light: "bg-emerald-50", border: "border-emerald-100" },
  { Icon: Rocket,     title: "Future-Ready Kids",    color: "bg-violet-500",  shadow: "shadow-violet-500/35",  light: "bg-violet-50",  border: "border-violet-100" },
  { Icon: GraduationCap, title: "Teacher Friendly",  color: "bg-orange-500",  shadow: "shadow-orange-500/35",  light: "bg-orange-50",  border: "border-orange-100" },
  { Icon: BookOpen,   title: "Curriculum-Aligned",   color: "bg-rose-500",    shadow: "shadow-rose-500/35",    light: "bg-rose-50",    border: "border-rose-100" },
  { Icon: Wifi,       title: "Smart Classroom",      color: "bg-cyan-500",    shadow: "shadow-cyan-500/35",    light: "bg-cyan-50",    border: "border-cyan-100" },
];

export default function BenefitsSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" style={{ background: "#FFFBF0" }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-160 h-64 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Science float decorations */}
      <FloatDNA className="absolute top-10 right-8 lg:top-16 lg:right-14 opacity-30" />
      <FloatSparkle className="absolute bottom-16 left-10 lg:bottom-20 lg:left-16 opacity-40" size={44} color="#3b82f6" />
      <FloatSparkle className="absolute top-24 left-[30%] opacity-20" size={28} color="#10b981" />
      <FloatSparkle className="absolute bottom-10 right-[22%] opacity-30" size={36} color="#f59e0b" />

      {/* Scattered dots */}
      <div className="absolute top-14 left-10 w-6 h-6 rounded-full bg-blue-400/20 pointer-events-none" />
      <div className="absolute top-8 right-12 w-4 h-4 rounded-full bg-violet-400/25 pointer-events-none" />
      <div className="absolute bottom-14 left-16 w-5 h-5 rounded-full bg-emerald-400/20 pointer-events-none" />
      <div className="absolute bottom-8 right-16 w-8 h-8 rounded-full border-2 border-rose-300/30 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
            <Rocket className="w-4 h-4" />
            Why It Works
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Your Child Gains{" "}
            <span className="text-primary">Real Superpowers</span>
          </h2>
        </motion.div>

        {/* Split layout: feature photo + icon grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[440px_1fr] gap-6 lg:gap-8 items-start">

          {/* Feature photo card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            whileHover="hovered"
            className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/20"
            style={{ aspectRatio: "3/4", background: "linear-gradient(160deg,#0483e2,#02345a)" }}
          >
            {/* Photo */}
            <motion.img
              variants={{ hovered: { scale: 1.05 } }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=85"
              alt="Children engaged and excited learning"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(4,131,226,0.15) 0%, transparent 40%, rgba(2,52,90,0.92) 100%)",
              }}
            />

            {/* Bottom text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
              {/* Stat pill */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
                <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                  Why Schools Love It
                </span>
              </div>

              <p
                className="text-white font-black text-2xl leading-tight"
                style={{ fontFamily: "var(--font-jarkata)", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
              >
                Kids who learn with AR stay 3× more curious.
              </p>

              <p className="text-white/65 text-sm leading-relaxed" style={{ fontFamily: "var(--font-jarkata)" }}>
                Engagement, curiosity, and confidence — all measurably higher.
              </p>
            </div>
          </motion.div>

          {/* Superpowers icon grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {superpowers.map(({ Icon, title, color, shadow, light, border }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.04 }}
                className={`flex flex-col items-center gap-4 p-6 lg:p-7 ${light} rounded-3xl border-2 ${border} shadow-sm hover:shadow-xl transition-all duration-300 cursor-default`}
              >
                <div
                  className={`w-16 h-16 rounded-full ${color} flex items-center justify-center shadow-xl ${shadow}`}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={1.75} />
                </div>
                <p
                  className="text-secondary font-bold text-sm text-center leading-snug"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
