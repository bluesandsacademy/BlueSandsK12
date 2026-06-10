"use client";

import { motion } from "framer-motion";
import { Microscope, Heart, Monitor, Star, Sparkles } from "lucide-react";
import { FloatSparkle } from "./science-floats";

const pillars = [
  {
    number: "1",
    Icon: Microscope,
    title: "Modernise STEM",
    tagline: "Hands-on AR, not passive reading.",
    color: "#0483e2",
  },
  {
    number: "2",
    Icon: Heart,
    title: "Feel Science",
    tagline: "Every child deserves to experience it.",
    color: "#FF5A5F",
  },
  {
    number: "3",
    Icon: Monitor,
    title: "Future Classrooms",
    tagline: "Schools ready for the AI era.",
    color: "#3DD68C",
  },
  {
    number: "4",
    Icon: Star,
    title: "African Innovators",
    tagline: "Inspire the next generation.",
    color: "#FFC83D",
  },
];

export default function VisionSection() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFF1F2 100%)" }}
    >
      {/* Playful shapes */}
      <div className="absolute -top-12 left-10 w-72 h-72 bg-grape/15 blob-2 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-12 w-10 h-10 bg-grass/30 rounded-full kid-float pointer-events-none" />
      <FloatSparkle className="absolute top-16 right-1/4 opacity-60" size={36} color="#FF5A5F" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-white font-extrabold text-sm sm:text-base shadow-[0_5px_0_rgba(0,0,0,0.1)] kid-wobble">
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Our Big Dream
          </div>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            A National STEM{" "}
            <span className="text-coral doodle-underline">Movement</span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-2xl font-semibold">
            More than devices — a mission.
          </p>
        </motion.div>

        {/* Mission pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {pillars.map(({ number, Icon, title, tagline, color }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative flex flex-col items-center text-center gap-3 rounded-[1.8rem] bg-white p-8 border-4 shadow-[0_8px_0_rgba(0,0,0,0.06)]"
              style={{ borderColor: color }}
            >
              {/* Number sticker */}
              <span
                className="absolute -top-4 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-lg shadow-md kid-wobble"
                style={{ background: color }}
              >
                {number}
              </span>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: `${color}22` }}
              >
                <Icon className="w-10 h-10" style={{ color }} strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-secondary text-xl leading-tight">
                {title}
              </h3>
              <p className="text-gray-600 text-base font-semibold leading-relaxed">
                {tagline}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
