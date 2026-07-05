"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

// PLACEHOLDERS — swap for real, consented quotes before publishing.
const placeholders = [
  { role: "Teacher", hint: "A classroom teacher on engagement and confidence." },
  { role: "Pupil / Parent", hint: "A learner or parent on what changed for them." },
  { role: "Partner", hint: "A partner on the mission and the results." },
];

const sdgs = [
  { n: 4, name: "Quality Education", color: "#C5192D" },
  { n: 5, name: "Gender Equality", color: "#FF3A21" },
  { n: 10, name: "Reduced Inequalities", color: "#DD1367" },
];

export default function ImpactVoices() {
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
          <SectionKicker>Voices &amp; global goals</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Voices from the{" "}
            <span className="text-primary doodle-underline">classroom</span>
          </h2>
        </motion.div>

        {/* Placeholder quote cards — visibly marked so they never ship as real */}
        <div className="grid gap-6 md:grid-cols-3">
          {placeholders.map(({ role, hint }, i) => (
            <motion.figure
              key={role}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-3xl bg-cream p-7 border-2 border-dashed border-secondary/20"
            >
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-8 h-8 text-secondary/20 fill-secondary/5" strokeWidth={1.5} />
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                  Placeholder
                </span>
              </div>
              <blockquote className="text-secondary/50 text-lg font-semibold italic flex-1">
                &ldquo;Quote to be added.&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-secondary/10">
                <p className="text-secondary font-bold text-sm">{role}</p>
                <p className="text-gray-400 text-xs font-semibold mt-0.5 leading-snug">
                  {hint}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* SDG alignment strip */}
        <div className="mt-10 rounded-3xl bg-cream border-2 border-secondary/5 p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary/60">
            Aligned to global goals
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {sdgs.map(({ n, name, color }) => (
              <span
                key={n}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white font-bold text-sm"
                style={{ background: color }}
              >
                <span className="font-black">SDG {n}</span>
                <span className="font-semibold opacity-90">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
