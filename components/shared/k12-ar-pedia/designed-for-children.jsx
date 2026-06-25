"use client";

import { motion } from "framer-motion";
import { FloatAtom, FloatPlanet } from "./science-floats";
import SectionKicker from "./section-kicker";

const targetTypes = [
  "Nursery Schools",
  "Primary Schools",
  "Homeschool",
  "STEM Clubs",
  "Learning Labs",
];

export default function DesignedForChildrenSection() {
  return (
    <section
      className="relative py-16 sm:py-20 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fef9c3 0%, #fef3c7 50%, #fde68a 100%)" }}
    >
      {/* Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />
      <FloatAtom className="absolute top-10 right-8 lg:top-16 lg:right-14 opacity-30" size={90} />
      <FloatPlanet className="absolute bottom-10 left-6 lg:bottom-14 lg:left-12 opacity-25" size={80} />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 space-y-3 max-w-2xl mx-auto"
        >
          <SectionKicker className="text-coral">Just for Young Minds</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            Designed for{" "}
            <span className="text-amber-600 doodle-underline">Children</span>
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl font-semibold">
            Built from the ground up for ages 5 to 11 — nursery through primary.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-5 px-8 py-5 bg-white rounded-3xl shadow-xl border-2 border-amber-300">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/40 shrink-0">
              <span
                className="text-white font-black text-2xl leading-none"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                5–11
              </span>
            </div>
            <div>
              <p
                className="text-secondary font-black text-xl"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Ages 5 to 11
              </p>
              <p className="text-gray-500 text-sm">Nursery through Primary</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {targetTypes.map((type) => (
              <span
                key={type}
                className="px-4 py-2 bg-amber-400 text-white rounded-full text-sm font-bold shadow-md shadow-amber-400/30"
              >
                {type}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
