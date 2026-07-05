"use client";

import { motion } from "framer-motion";
import { Users, School, FlaskConical, MapPin, TrendingUp } from "lucide-react";
import { FloatSparkle } from "./science-floats";
import SectionKicker from "./section-kicker";

const metrics = [
  {
    value: "30M+",
    label: "Accessible K-12 Learners",
    Icon: Users,
    color: "#0483e2",
  },
  { value: "1M+", label: "K-12 Schools", Icon: School, color: "#FF5A5F" },
  {
    value: "150+",
    label: "Virtual STEM Experiments",
    Icon: FlaskConical,
    color: "#3DD68C",
  },
  { value: "36+FCT", label: "States Covered", Icon: MapPin, color: "#9B5DE5" },
  {
    value: "$2B+",
    label: "Market Opportunity",
    Icon: TrendingUp,
    color: "#FFC83D",
  },
];

export default function MetricsSection() {
  return (
    <section
      className="relative py-14 sm:py-16 lg:py-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #EAF6FF 100%)",
      }}
    >
      {/* Playful decorations */}
      <FloatSparkle
        className="absolute top-8 left-[12%] opacity-50"
        size={28}
        color="#FFC83D"
      />
      <FloatSparkle
        className="absolute bottom-10 right-[14%] opacity-40"
        size={32}
        color="#9B5DE5"
      />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto"
        >
          <SectionKicker>
            The Opportunity Ahead
          </SectionKicker>
          <h2 className="mt-4 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            A Nation Ready for{" "}
            <span className="text-primary doodle-underline">AR Learning</span>
          </h2>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {metrics.map(({ value, label, Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`flex flex-col items-center text-center gap-3 rounded-[1.6rem] bg-white p-6 lg:p-7 border-4 shadow-[0_8px_0_rgba(0,0,0,0.06)] ${
                i === metrics.length - 1 ? "col-span-2 lg:col-span-1" : ""
              }`}
              style={{ borderColor: color }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md kid-wobble"
                style={{ background: color }}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <p
                className="font-display font-black text-secondary text-3xl sm:text-4xl leading-none tabular-nums"
                style={{ color }}
              >
                {value}
              </p>
              <p className="text-gray-600 text-sm font-bold leading-snug">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
