"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { nigeriaStates } from "@/lib/nigeria-map-data";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

// The 20 northern states (North-Central + FCT, North-East, North-West).
// Every other state is Southern (South-East, South-South, South-West).
const NORTH = new Set([
  "benue", "kogi", "kwara", "nassarawa", "niger", "plateau", "fct",
  "adamawa", "bauchi", "borno", "gombe", "taraba", "yobe",
  "jigawa", "kaduna", "kano", "katsina", "kebbi", "sokoto", "zamfara",
]);

const WARM = "#F59E0B"; // North — access & inclusion
const COOL = "#0483E2"; // South — quality & scale

function SplitNigeriaMap() {
  return (
    <svg
      viewBox="0 0 744 600"
      className="w-full h-auto"
      role="img"
      aria-label="Map of Nigeria split into Northern states (warm) and Southern states (cool)"
      xmlns="http://www.w3.org/2000/svg"
    >
      {nigeriaStates.map((s) => {
        const north = NORTH.has(s.id);
        return (
          <path
            key={s.id}
            d={s.path}
            fill={north ? WARM : COOL}
            stroke="#ffffff"
            strokeWidth={1}
            strokeLinejoin="round"
            className="transition-opacity duration-200 hover:opacity-75"
          >
            <title>{`${s.name} · ${north ? "Northern" : "Southern"} Nigeria`}</title>
          </path>
        );
      })}
    </svg>
  );
}

const regions = [
  {
    tag: "Northern Nigeria",
    title: "In the North: widening the door to school",
    focus:
      "Our focus here is access and inclusion, reaching underserved children with engaging, dignified learning, and equipping teachers where infrastructure is thin.",
    points: [
      "Reach out-of-school and first-generation learners",
      "Advance girls' education and equitable participation",
      "Work through SUBEBs and community structures",
      "Design for low-power, low-connectivity classrooms",
    ],
    color: WARM,
    panel: "bg-amber-50 border-amber-200",
    chip: "bg-amber-400 text-white",
  },
  {
    tag: "Southern Nigeria",
    title: "In the South: deepening quality at scale",
    focus:
      "Our focus here is quality and scale, helping schools stand out, building early STEM confidence, and including lower-cost schools as we grow.",
    points: [
      "Scale across dense private-school networks in Lagos & the South-West",
      "Build early STEM confidence through hands-on AR learning",
      "Deliver continuous teacher development and support",
      "Open affordability pathways so quality reaches more schools",
    ],
    color: COOL,
    panel: "bg-blue-50 border-blue-200",
    chip: "bg-primary text-white",
  },
];

export default function ImpactRegions() {
  return (
    <section id="reach" className="relative py-16 sm:py-20 lg:py-24 bg-white scroll-mt-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <SectionKicker>Northern &amp; Southern Nigeria</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Meeting every region{" "}
            <span className="text-primary doodle-underline">where it is</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg font-semibold">
            One nation, two focuses, so quality learning reaches every child.
          </p>
        </motion.div>

        {/* The split map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-2xl"
        >
          <SplitNigeriaMap />
          <div className="mt-4 flex items-center justify-center gap-6">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary">
              <span className="w-4 h-4 rounded-md" style={{ background: WARM }} />
              North: access &amp; inclusion
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary">
              <span className="w-4 h-4 rounded-md" style={{ background: COOL }} />
              South: quality &amp; scale
            </span>
          </div>
        </motion.div>

        {/* Two mirrored region panels */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {regions.map(({ tag, title, focus, points, color, panel, chip }, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className={`rounded-[1.8rem] border-2 p-7 lg:p-8 ${panel}`}
            >
              <span className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${chip}`}>
                {tag}
              </span>
              <h3 className="mt-4 font-display font-bold text-secondary text-xl sm:text-2xl leading-tight">
                {title}
              </h3>
              <p className="mt-3 text-gray-600 font-semibold leading-relaxed">
                {focus}
              </p>
              <ul className="mt-5 space-y-3">
                {points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 shrink-0"
                      style={{ color }}
                      strokeWidth={2.4}
                    />
                    <span className="text-secondary/90 text-sm font-semibold leading-snug">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
