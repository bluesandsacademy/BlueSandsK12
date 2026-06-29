"use client";

import { motion } from "framer-motion";
import { Microscope, TrendingUp, Rocket, GraduationCap, BookOpen, Wifi } from "lucide-react";
import { FloatDNA, FloatSparkle } from "./science-floats";
import SectionKicker from "./section-kicker";

const superpowers = [
  { Icon: Microscope, title: "Immersive STEM", desc: "Touch and explore science in 3D — not just read about it.", color: "#0483e2" },
  { Icon: TrendingUp, title: "Higher Engagement", desc: "Lessons kids actually look forward to, every single day.", color: "#3DD68C" },
  { Icon: Rocket, title: "Future-Ready Kids", desc: "Builds the tech confidence tomorrow's world demands.", color: "#9B5DE5" },
  { Icon: GraduationCap, title: "Teacher Friendly", desc: "Works straight out of the box — no tech degree needed.", color: "#F59E0B" },
  { Icon: BookOpen, title: "Curriculum-Aligned", desc: "Maps neatly onto what schools already teach.", color: "#FF5A5F" },
  { Icon: Wifi, title: "Smart Classroom", desc: "Runs in any classroom, online or offline.", color: "#06B6D4" },
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-3"
        >
          <SectionKicker className="text-primary">Why It Works</SectionKicker>
          <h2 className="font-display font-bold text-secondary text-4xl sm:text-5xl lg:text-6xl">
            Your Child Gains{" "}
            <span className="text-primary doodle-underline">Real Superpowers</span>
          </h2>
        </motion.div>

        {/* Superpower cards — equal-height 3-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {superpowers.map(({ Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="flex items-start gap-4 p-6 lg:p-7 bg-white rounded-[1.8rem] border-4 shadow-[0_8px_0_rgba(0,0,0,0.06)] transition-shadow"
              style={{ borderColor: color }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md kid-wobble"
                style={{ background: color }}
              >
                <Icon className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-display font-bold text-secondary text-lg leading-tight mb-1">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social-proof stat banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 lg:mt-12 grid md:grid-cols-2 rounded-4xl overflow-hidden border-4 border-secondary/10 shadow-[0_14px_0_rgba(2,52,90,0.08)] bg-secondary"
        >
          {/* Text */}
          <div className="relative order-2 md:order-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-4 text-white">
            <FloatSparkle className="absolute top-6 left-6 opacity-50" size={34} color="#FFC83D" />
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/12 border border-white/20 px-4 py-1.5">
              <span className="w-2 h-2 bg-grass rounded-full animate-pulse shrink-0" />
              <span className="text-white/90 text-xs font-extrabold uppercase tracking-wider">
                Why Schools Love It
              </span>
            </div>
            <p className="font-display font-bold text-3xl sm:text-4xl leading-tight">
              Kids who learn with AR stay{" "}
              <span className="text-sunshine">3× more curious.</span>
            </p>
            <p className="text-white/70 text-base sm:text-lg font-semibold leading-relaxed">
              Engagement, curiosity, and confidence — all measurably higher than
              with traditional textbooks alone.
            </p>
          </div>

          {/* Photo */}
          <div className="relative order-1 md:order-2 min-h-60 md:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=85"
              alt="Children engaged and excited learning"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(255deg, transparent 45%, rgba(2,52,90,0.95) 100%)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
