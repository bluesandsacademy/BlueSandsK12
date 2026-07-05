"use client";

import { motion } from "framer-motion";
import { Sparkles, WifiOff, Users, BookOpenCheck } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

const pillars = [
  {
    title: "Engagement that sticks",
    desc: "AR Pedia turns abstract lessons into living, interactive experiences.",
    Icon: Sparkles,
    tint: "bg-coral/10 text-coral",
  },
  {
    title: "Access in low-resource settings",
    desc: "Print plus affordable AR hardware works without a computer lab.",
    Icon: WifiOff,
    tint: "bg-amber-100 text-amber-600",
  },
  {
    title: "Teachers at the centre",
    desc: "We equip educators with training and ongoing support, not replace them.",
    Icon: Users,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Aligned to the curriculum",
    desc: "Content maps to the Nigerian basic-education curriculum.",
    Icon: BookOpenCheck,
    tint: "bg-grass/15 text-green-600",
  },
];

export default function ImpactApproach() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <SectionKicker>Our approach</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Learning that meets children{" "}
            <span className="text-primary doodle-underline">where they are</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ title, desc, Icon, tint }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl bg-cream p-7 border-2 border-secondary/5 shadow-sm hover:shadow-lg transition-shadow"
            >
              <span className={`flex items-center justify-center w-12 h-12 rounded-2xl ${tint}`}>
                <Icon className="w-6 h-6" strokeWidth={2.2} />
              </span>
              <h3 className="mt-5 font-display font-bold text-secondary text-lg leading-tight">
                {title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm font-semibold leading-snug">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
