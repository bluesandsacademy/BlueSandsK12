"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, ArrowRight } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

export default function ImpactHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Warm (North) → cool (South) wash: the divide, as a gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-100 via-cream to-sky/25" />
      <div className="absolute top-16 left-8 w-12 h-12 bg-amber-300/40 blob-1 kid-float pointer-events-none" />
      <div
        className="absolute top-40 right-12 w-8 h-8 bg-primary/30 rounded-full kid-float pointer-events-none"
        style={{ animationDelay: "0.8s" }}
      />
      <div
        className="absolute bottom-16 left-1/3 w-6 h-6 bg-coral/30 rounded-full kid-float pointer-events-none"
        style={{ animationDelay: "1.4s" }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionKicker>Social Impact</SectionKicker>
          <h1 className="mt-5 font-display font-bold text-secondary leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
            Learning without limits, for every child in{" "}
            <span className="text-primary doodle-underline">
              Northern and Southern Nigeria
            </span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 font-semibold leading-snug">
            AR Pedia brings immersive, curriculum-aligned learning to children
            across Nigeria, closing the gap between where a child is born and
            what they can become.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/partnership"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
            >
              <Handshake className="w-6 h-6" strokeWidth={2.5} />
              Partner with us
            </Link>
            <a
              href="#reach"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all border-2 border-secondary/10"
            >
              See our reach
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
