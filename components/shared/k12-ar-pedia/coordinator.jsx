"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, DollarSign, Users, Award } from "lucide-react";

const benefits = [
  { Icon: MapPin, label: "Your Territory", sub: "Exclusive state rights", color: "bg-blue-500", shadow: "shadow-blue-500/40" },
  { Icon: DollarSign, label: "Earn Commission", sub: "Competitive structure", color: "bg-emerald-500", shadow: "shadow-emerald-500/40" },
  { Icon: Users, label: "Grow a Network", sub: "Schools & learning centres", color: "bg-violet-500", shadow: "shadow-violet-500/40" },
  { Icon: Award, label: "Get Certified", sub: "Training & recognition", color: "bg-amber-500", shadow: "shadow-amber-500/40" },
];

export default function CoordinatorSection() {
  return (
    <section
      id="coordinator"
      className="relative overflow-hidden bg-[#0D3B5C] py-16 sm:py-20 lg:py-24"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Dot accent */}
      <div className="absolute top-10 right-10 opacity-15 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
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
          className="text-center mb-12 space-y-3 max-w-2xl mx-auto"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Join Nigeria&apos;s{" "}
            <span className="text-amber-400">STEM Revolution</span>
          </h2>
          <p
            className="text-white/70 text-lg"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Become a State Distribution Officer and lead AR learning in your region.
          </p>
        </motion.div>

        {/* 4 big benefit icons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-12 max-w-4xl mx-auto">
          {benefits.map(({ Icon, label, sub, color, shadow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className="flex flex-col items-center gap-4 p-6 lg:p-8 bg-white/8 border border-white/12 rounded-3xl backdrop-blur-sm hover:bg-white/14 transition-all duration-300 text-center"
            >
              <div
                className={`w-[72px] h-[72px] rounded-full ${color} flex items-center justify-center shadow-xl ${shadow}`}
              >
                <Icon className="w-9 h-9 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p
                  className="text-white font-black text-base"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {label}
                </p>
                <p className="text-white/50 text-xs mt-1">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/products/k12-ar-pedia/apply"
            className="inline-flex items-center gap-3 px-10 py-5 bg-amber-400 text-secondary font-black rounded-2xl hover:bg-amber-300 transition-all duration-300 shadow-2xl shadow-amber-400/30 text-lg"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Apply Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-white/30 text-sm mt-3">Limited positions per state</p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
