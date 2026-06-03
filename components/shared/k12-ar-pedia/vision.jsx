"use client";

import { motion } from "framer-motion";
import { Microscope, Heart, Monitor, Star } from "lucide-react";

const pillars = [
  {
    number: "01",
    Icon: Microscope,
    title: "Modernise STEM",
    tagline: "Hands-on AR, not passive reading.",
    color: "bg-blue-500",
    shadow: "shadow-blue-500/50",
  },
  {
    number: "02",
    Icon: Heart,
    title: "Feel Science",
    tagline: "Every child deserves to experience it.",
    color: "bg-rose-500",
    shadow: "shadow-rose-500/50",
  },
  {
    number: "03",
    Icon: Monitor,
    title: "Future Classrooms",
    tagline: "Schools ready for the AI era.",
    color: "bg-emerald-500",
    shadow: "shadow-emerald-500/50",
  },
  {
    number: "04",
    Icon: Star,
    title: "African Innovators",
    tagline: "Inspire the next generation.",
    color: "bg-amber-500",
    shadow: "shadow-amber-500/50",
  },
];

export default function VisionSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark brand overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(4,131,226,0.90) 0%, rgba(2,52,90,0.95) 100%)",
          }}
        />
      </div>

      {/* Grid texture on top */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Dot accent */}
      <div className="absolute bottom-10 right-10 opacity-15 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="3" fill="white" />
            )),
          )}
        </svg>
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-3 max-w-3xl mx-auto"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            A National STEM{" "}
            <span className="text-amber-400">Movement</span>
          </h2>
          <p
            className="text-white/75 text-xl"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            More than devices — a mission.
          </p>
        </motion.div>

        {/* Mission pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {pillars.map(({ number, Icon, title, tagline, color, shadow }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center text-center gap-4 rounded-3xl p-8 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center shadow-2xl ${shadow} shrink-0`}>
                <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <p
                className="text-white/15 font-black text-6xl leading-none"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {number}
              </p>
              <h3
                className="text-white font-black text-xl leading-tight"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {title}
              </h3>
              <p className="text-white/65 text-sm leading-relaxed" style={{ fontFamily: "var(--font-jarkata)" }}>
                {tagline}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
