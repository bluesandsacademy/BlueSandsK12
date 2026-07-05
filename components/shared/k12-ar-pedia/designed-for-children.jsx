"use client";

import { motion } from "framer-motion";
import { Blocks, GraduationCap } from "lucide-react";
import { FloatAtom, FloatPlanet } from "./science-floats";
import SectionKicker from "./section-kicker";

/* Two mirrored audiences, one product. The warm amber panel is for the
   younger cohort; the cool blue panel for teens. Kept as data + a single
   Panel component so both stay perfectly in sync. */
const audiences = [
  {
    id: "children",
    Icon: Blocks,
    range: "5–11",
    ages: "Ages 5 to 11",
    word: "Children",
    stage: "Built from the ground up for ages 5 to 11, nursery through primary.",
    types: [
      "Nursery Schools",
      "Primary Schools",
      "Homeschool",
      "STEM Clubs",
      "Learning Labs",
    ],
    theme: {
      panel: "border-amber-300 bg-amber-50/80",
      chip: "bg-amber-100 text-amber-600",
      ring: "bg-amber-400 shadow-amber-400/40",
      accent: "text-amber-600",
      subtle: "text-amber-700/70",
      pill: "bg-amber-400 text-white shadow-amber-400/30",
    },
  },
  {
    id: "teens",
    Icon: GraduationCap,
    range: "13–18",
    ages: "Ages 13 to 18",
    word: "Teens",
    stage: "Built from the ground up for ages 13 to 18, secondary or high school.",
    types: ["Secondary School", "High School", "STEM Clubs", "Science Labs"],
    theme: {
      panel: "border-blue-300 bg-blue-50/80",
      chip: "bg-blue-100 text-blue-600",
      ring: "bg-blue-500 shadow-blue-500/40",
      accent: "text-blue-600",
      subtle: "text-blue-700/70",
      pill: "bg-blue-500 text-white shadow-blue-500/30",
    },
  },
];

function AudiencePanel({ audience, index }) {
  const { Icon, range, ages, word, stage, types, theme } = audience;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
      className={`relative flex flex-col items-center text-center gap-5 rounded-[2rem] border-2 bg-white/80 backdrop-blur-sm px-6 sm:px-8 py-9 shadow-xl ${theme.panel}`}
    >
      {/* Icon chip */}
      <span
        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${theme.chip}`}
      >
        <Icon className="w-7 h-7" strokeWidth={2.2} />
      </span>

      {/* Big age ring — the focal point */}
      <div
        className={`flex items-center justify-center w-28 h-28 rounded-full text-white shadow-lg ${theme.ring}`}
      >
        <span
          className="font-black text-3xl leading-none"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          {range}
        </span>
      </div>

      <div className="space-y-1.5">
        <p className={`text-sm font-bold uppercase tracking-wide ${theme.subtle}`}>
          {ages}
        </p>
        <h3 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl">
          Designed for <span className={theme.accent}>{word}</span>
        </h3>
        <p className="text-gray-600 text-base sm:text-lg font-semibold max-w-sm mx-auto pt-1">
          {stage}
        </p>
      </div>

      {/* Setting pills */}
      <div className="flex flex-wrap justify-center gap-2.5 pt-1">
        {types.map((type) => (
          <span
            key={type}
            className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${theme.pill}`}
          >
            {type}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function DesignedForChildrenSection() {
  return (
    <section
      className="relative py-16 sm:py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(150deg, #fef9c3 0%, #fef3c7 38%, #eff6ff 100%)",
      }}
    >
      {/* Blobs — warm on the left, cool on the right */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
      <FloatAtom className="absolute top-10 right-8 lg:top-16 lg:right-14 opacity-30" size={90} />
      <FloatPlanet className="absolute bottom-10 left-6 lg:bottom-14 lg:left-12 opacity-25" size={80} />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shared header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 space-y-3 max-w-2xl mx-auto"
        >
          <SectionKicker>Just for Young Minds</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            Designed for{" "}
            <span className="text-amber-600 doodle-underline">Every Age</span>
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl font-semibold">
            One platform, two purpose-built experiences, from first discoveries
            to exam-ready STEM.
          </p>
        </motion.div>

        {/* Two mirrored panels */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {audiences.map((audience, index) => (
            <AudiencePanel
              key={audience.id}
              audience={audience}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
