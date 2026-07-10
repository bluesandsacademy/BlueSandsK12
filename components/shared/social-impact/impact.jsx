"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, School, MapPin, Target } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import CountUp from "./count-up";

// These are TARGETS, not verified results — labelled as such throughout.
const targets = [
  { display: <CountUp to={1} suffix="M+" />, label: "learners reached", Icon: Users },
  { display: <CountUp to={100000} suffix="+" />, label: "teachers trained", Icon: GraduationCap },
  { display: <CountUp to={20000} suffix="+" />, label: "schools & centres", Icon: School },
  { display: <CountUp to={6} />, label: "states, North & South", Icon: MapPin },
];

export default function ImpactNumbers() {
  return (
    <section id="impact" className="relative py-16 sm:py-20 lg:py-24 bg-cream scroll-mt-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <SectionKicker>Impact by the numbers</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            The scale we&apos;re building{" "}
            <span className="text-primary doodle-underline">toward</span>
          </h2>
        </motion.div>

        {/* Target cards — clearly flagged as targets, not achieved results */}
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {targets.map(({ display, label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl bg-white p-6 sm:p-7 border-2 border-secondary/5 shadow-sm"
            >
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-secondary/6 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary/55">
                <Target className="w-3 h-3" strokeWidth={2.5} />
                Target
              </span>
              <Icon className="w-6 h-6 text-primary" strokeWidth={2.1} />
              <p className="mt-4 font-display font-black text-secondary leading-none text-3xl sm:text-4xl lg:text-5xl">
                {display}
              </p>
              <p className="mt-2 text-gray-600 text-sm font-semibold leading-snug">
                {label}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-gray-600 text-base sm:text-lg font-semibold leading-relaxed">
          Today, more than 20,000 students learn on Blue Sands platforms across
          over 100 schools in 6 countries. The figures above show where we are
          headed next, and partners are how we get there.
        </p>

        {/* Publishable goal */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden mt-8 rounded-[1.8rem] bg-secondary px-6 py-9 sm:px-10 sm:py-11 shadow-[0_14px_0_rgba(2,52,90,0.15)]"
        >
          <div className="absolute -top-16 -right-10 w-72 h-72 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex items-center gap-5">
            <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-sunshine/20 shrink-0">
              <Target className="w-8 h-8 text-sunshine" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg sm:text-2xl leading-snug">
                Our goal: reach{" "}
                <span className="text-sunshine">5 million learners</span> with
                immersive, curriculum-aligned learning by 2029.
              </p>
              <p className="mt-3 text-white/85 font-semibold text-sm sm:text-base leading-snug">
                Every sponsored deployment is reported back to you: schools
                reached, pupils onboarded, teachers trained.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
