"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, CalendarCheck } from "lucide-react";
import { FloatPlanet, FloatSparkle } from "./science-floats";
import SectionKicker from "./section-kicker";

export default function FinalCtaSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF6D6 0%, #FFE0A3 100%)" }}
    >
      {/* Playful floating shapes */}
      <FloatPlanet className="absolute top-10 left-6 lg:left-20 opacity-90" size={90} />
      <FloatSparkle className="absolute top-20 right-1/4 opacity-80" size={40} color="#FF5A5F" />
      <FloatSparkle className="absolute bottom-24 left-1/4 opacity-70" size={32} color="#9B5DE5" />
      <div className="absolute bottom-16 right-10 w-12 h-12 bg-grass/40 blob-1 kid-float pointer-events-none" />
      <div className="absolute top-1/2 right-20 w-8 h-8 bg-primary/30 rounded-full kid-float pointer-events-none" style={{ animationDelay: "0.8s" }} />

      {/* Content */}
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6 max-w-3xl mx-auto mb-12"
        >
          <SectionKicker className="text-coral">Early Access · Closing Soon</SectionKicker>

          <h2 className="font-display font-bold text-secondary leading-[1.05] text-4xl sm:text-5xl lg:text-7xl">
            Ready to Transform{" "}
            <br className="hidden sm:block" />
            <span className="text-primary doodle-underline">Your Classroom?</span>
          </h2>

          <p className="text-gray-700 text-lg sm:text-2xl font-semibold leading-snug max-w-xl mx-auto">
            Early access slots are filling fast. Don&apos;t let your school miss
            Nigeria&apos;s most exciting STEM adventure.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/preorder"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all w-full sm:w-auto"
          >
            <Rocket className="w-6 h-6" strokeWidth={2.5} />
            Preorder Now
          </Link>
          <a
            href="https://calendly.com/bluesandstemlabs/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all border-2 border-secondary/10 w-full sm:w-auto"
          >
            <CalendarCheck className="w-5 h-5 text-primary" strokeWidth={2.5} />
            Request a Free Demo
          </a>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-2xl bg-secondary px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.2)] transition-all w-full sm:w-auto"
          >
            Become a Partner
          </Link>
        </motion.div>
      </div>

      {/* Top playful wave divider */}
      <div className="absolute top-0 left-0 right-0 leading-none pointer-events-none rotate-180">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full" style={{ height: 50 }}>
          <path fill="#FFFBF0" d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,40 L1440,90 L0,90 Z" />
        </svg>
      </div>
    </section>
  );
}
