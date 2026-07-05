"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FloatAtom, FloatPlanet, FloatSparkle } from "./science-floats";
import SectionKicker from "./section-kicker";

const features = [
  {
    label: "Interactive Learning",
    line: "AR books turn reading into an animated, hands-on experience.",
    imgSrc: "/interactive-learning.JPG",
    color: "#0483e2",
  },
  {
    label: "Hands-On STEM",
    line: "Run real experiments — zero mess, zero risk.",
    imgSrc: "/hands-on-stem.jpg",
    color: "#9B5DE5",
  },
  {
    label: "Adaptive AI",
    line: "Smart guidance that adapts to each child's pace.",
    imgSrc: "/adaptive-ai.jpg",
    color: "#3DD68C",
  },
  {
    label: "Any Classroom",
    line: "Works in any school — online or offline.",
    imgSrc: "/any-classroom.jpg",
    color: "#FFC83D",
  },
];

function FeatureCard({ label, line, imgSrc, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-4xl cursor-default bg-white shadow-[0_12px_30px_rgba(2,52,90,0.12)] aspect-5/8"
    >
      {/* Photo */}
      <Image
        src={imgSrc}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover transition-transform duration-500 ease-out lg:group-hover:scale-105"
      />

      {/* Color tint — clean photo at rest on desktop, washes in on hover.
         Shown by default on touch devices, which have no hover. */}
      <div
        className="absolute inset-0 backdrop-blur-[2px] transition-opacity duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        style={{ background: `linear-gradient(160deg, ${color}b3 0%, ${color}e0 100%)` }}
      />

      {/* Title + one punchy line — centered, same reveal logic as the tint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-300 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
        <h3 className="font-display font-bold text-white text-xl lg:text-2xl leading-tight drop-shadow">
          {label}
        </h3>
        <p className="text-white/95 text-sm font-semibold leading-snug mt-3 max-w-60">
          {line}
        </p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      className="relative py-12 sm:py-14 lg:py-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}
    >
      {/* Science float decorations */}
      <FloatAtom className="absolute top-10 right-8 lg:top-16 lg:right-14 opacity-25" size={90} />
      <FloatPlanet className="absolute bottom-10 left-6 lg:bottom-14 lg:left-12 opacity-20" size={80} />
      <FloatSparkle className="absolute top-24 left-[28%] opacity-50" size={30} color="#FFC83D" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 space-y-3 max-w-2xl mx-auto"
        >
          <SectionKicker>What Makes It Magic</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Four Ways Learning{" "}
            <span className="text-primary doodle-underline">Comes Alive</span>
          </h2>
        </motion.div>

        {/* Feature grid — four rectangles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <FeatureCard key={f.label} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
