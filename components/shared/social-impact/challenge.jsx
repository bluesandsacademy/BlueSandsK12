"use client";

import { motion } from "framer-motion";
import { UserRoundX, MapPinned, UsersRound } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import CountUp from "./count-up";

const stats = [
  {
    display: <CountUp to={10} suffix="M+" />,
    label: "primary-age children out of school",
    Icon: UserRoundX,
  },
  {
    display: "~2 in 3",
    label: "of them in the North-East & North-West",
    Icon: MapPinned,
  },
  {
    display: "50–100+",
    label: "pupils per class in stretched states",
    Icon: UsersRound,
  },
];

// UN Sustainable Development Goals referenced here, in their official colours.
const sdgs = [
  { n: 4, name: "Quality Education", color: "#C5192D" },
  { n: 9, name: "Innovation", color: "#FD6925" },
  { n: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { n: 17, name: "Partnerships for the Goals", color: "#19486A" },
];

export default function ImpactChallenge() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-cream">
      {/* Soft warm + cool washes: the divide */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <SectionKicker>The challenge</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Nigeria&apos;s education divide is real, and{" "}
            <span className="text-primary doodle-underline">solvable</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg font-semibold leading-relaxed">
            Nigeria has 47M+ pupils, yet access and quality are sharply uneven:
            the North carries most of the country&apos;s out-of-school children,
            while the South faces rising fees and crowded classrooms. AR Pedia
            makes high-quality, engaging learning reachable on both sides of
            that divide.
          </p>
        </motion.div>

        {/* Divide stats */}
        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {stats.map(({ display, label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[1.6rem] bg-white p-8 border-2 border-secondary/5 shadow-[0_10px_0_rgba(2,52,90,0.04)] hover:-translate-y-1 hover:shadow-[0_14px_0_rgba(2,52,90,0.06)] transition-all text-center"
            >
              {/* Coral accent bar */}
              {/* <span className="absolute inset-x-0 top-0 h-1.5 bg-coral/80" /> */}

              <span className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-coral/10 text-coral">
                <Icon className="w-7 h-7" strokeWidth={2.1} />
              </span>
              <p className="mt-5 font-display font-black text-coral leading-none text-5xl sm:text-6xl">
                {display}
              </p>
              <p className="mt-3 text-gray-600 font-semibold leading-snug">
                {label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* SDG alignment — official-style goal tiles */}
        <div className="mt-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary/60">
            Aligned to global goals
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {sdgs.map(({ n, name, color }) => (
              <div
                key={n}
                className="inline-flex items-center gap-3 rounded-2xl bg-white border-2 border-secondary/5 py-2 pl-2 pr-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-white font-display font-black text-lg leading-none"
                  style={{ background: color }}
                >
                  {n}
                </span>
                <span className="text-sm font-bold text-secondary">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
