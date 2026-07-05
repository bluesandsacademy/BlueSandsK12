"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Building2 } from "lucide-react";
import SectionKicker from "./section-kicker";
import TestimonialWall from "./testimonials";

const pillars = [
  { label: "Students", Icon: GraduationCap },
  { label: "Educators", Icon: Users },
  { label: "Institutions", Icon: Building2 },
];

export default function EcosystemSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-[#FFFBF0]">
      {/* Soft decorations */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-14"
        >
          <SectionKicker>Trusted across STEM education</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            A Powerful Ecosystem for{" "}
            <span className="text-primary doodle-underline">STEM Education</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg font-semibold">
            Students, educators, and institutions building the future of science
            learning together.
          </p>
        </motion.div>

        {/* Refined testimonials */}
        <TestimonialWall />

        {/* Ecosystem statement — the closing message */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mt-12 lg:mt-16 overflow-hidden rounded-[2rem] bg-secondary px-6 py-10 sm:px-12 sm:py-14 text-center shadow-[0_16px_0_rgba(2,52,90,0.15)]"
        >
          {/* subtle glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <p className="relative mx-auto max-w-4xl font-display font-bold text-white text-xl sm:text-2xl lg:text-[1.75rem] leading-snug">
            <span className="text-sunshine">Blue Sands K12</span> is the VR/AR
            and AI-powered STEM education ecosystem designed to connect learning
            with real-world innovation, empowering{" "}
            <span className="text-sky">students</span>,{" "}
            <span className="text-sky">educators</span>, and{" "}
            <span className="text-sky">institutions</span> worldwide.
          </p>

          {/* Ecosystem pillars */}
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {pillars.map(({ label, Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-5 py-2.5 text-white font-bold text-sm sm:text-base backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-sunshine" strokeWidth={2.4} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
