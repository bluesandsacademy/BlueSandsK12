"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, MapPin, Banknote, Users, Award } from "lucide-react";
import { FloatSparkle } from "./science-floats";

const benefits = [
  { Icon: MapPin, label: "Your Territory", sub: "Exclusive state rights", color: "#0483e2" },
  { Icon: Banknote, label: "Earn Commission", sub: "Competitive structure", color: "#3DD68C" },
  { Icon: Users, label: "Grow a Network", sub: "Schools & learning centres", color: "#9B5DE5" },
  { Icon: Award, label: "Get Certified", sub: "Training & recognition", color: "#FFC83D" },
];

export default function CoordinatorSection() {
  return (
    <section
      id="coordinator"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(180deg, #FFFBF0 0%, #EAF6FF 100%)" }}
    >
      {/* Playful floating shapes */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-sunshine/30 blob-1 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-8 w-10 h-10 bg-coral/30 rounded-full kid-float pointer-events-none" />
      <FloatSparkle className="absolute top-16 left-1/4 opacity-60" size={34} color="#9B5DE5" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-grass px-5 py-2.5 text-white font-extrabold text-sm sm:text-base shadow-[0_5px_0_rgba(0,0,0,0.1)] kid-wobble">
            <Rocket className="w-4 h-4" strokeWidth={2.5} />
            Lead Your Region
          </div>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            Join Nigeria&apos;s{" "}
            <span className="text-primary doodle-underline">STEM Revolution</span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-2xl font-semibold">
            Become a State Distribution Officer and bring AR learning to your region.
          </p>
        </motion.div>

        {/* 4 big benefit cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-12 max-w-4xl mx-auto">
          {benefits.map(({ Icon, label, sub, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center gap-4 p-6 lg:p-7 bg-white rounded-[1.8rem] border-4 text-center shadow-[0_8px_0_rgba(0,0,0,0.06)]"
              style={{ borderColor: color }}
            >
              <div
                className="w-18 h-18 rounded-full flex items-center justify-center shadow-md kid-wobble"
                style={{ background: `${color}22` }}
              >
                <Icon className="w-9 h-9" style={{ color }} strokeWidth={2} />
              </div>
              <div>
                <p className="font-display font-bold text-secondary text-base sm:text-lg">{label}</p>
                <p className="text-gray-500 text-sm font-semibold mt-1">{sub}</p>
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
            href="/apply"
            className="inline-flex items-center gap-3 rounded-2xl bg-coral px-10 py-5 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
          >
            Apply Now
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-gray-500 text-sm font-semibold mt-3">Limited positions per state</p>
        </motion.div>
      </div>
    </section>
  );
}
