"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  XCircle,
  CheckCircle2,
  BookX,
  Tablet,
  ArrowRight,
  ClipboardCheck,
  School,
  Presentation,
  DoorOpen,
} from "lucide-react";
import SectionKicker from "./section-kicker";

const BORED = "/blacks/bored.jpeg";
const ENGAGED = "/blacks/happy.jpeg";
const RESULT = "/blacks/results.png";

// What the shift adds up to. Each icon draws its subject: a marked report
// for grades, a school building for reputation, a lesson board for teaching,
// an open door for opportunity.
const outcomes = [
  { label: "Better Grades", Icon: ClipboardCheck },
  { label: "Better School Reputation", Icon: School },
  { label: "Better Teacher Outcomes", Icon: Presentation },
  { label: "Better Student Opportunities", Icon: DoorOpen },
];

const columns = [
  {
    side: "before",
    eyebrow: "Traditional Reading",
    title: "Bored Children",
    img: BORED,
    // Landscape photo in a tall card, so only the horizontal focal point
    // shows. The bored girl sits on the right; center the crop on her.
    pos: "70% center",
    Icon: BookX,
    accent: "#dc2626",
    scrimRGB: "94,12,12",
    points: [
      "Passive memorisation from static pages",
      "Low engagement and short attention",
      "Abstract concepts that are hard to picture",
      "One-size-fits-all, outdated textbooks",
    ],
  },
  {
    side: "after",
    eyebrow: "BlueSands K12",
    title: "Engaged Learners",
    img: ENGAGED,
    pos: "center",
    Icon: Tablet,
    accent: "#10b981",
    scrimRGB: "2,40,70",
    points: [
      "Hands-on AR exploration on smart tablets",
      "High curiosity and full participation",
      "Concepts brought alive in interactive 3D",
      "Adaptive, immersive, curriculum-aligned",
    ],
  },
];

function CompareCard({ col, index }) {
  const isAfter = col.side === "after";
  const PointIcon = isAfter ? CheckCircle2 : XCircle;
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative w-full h-full rounded-[1.8rem] overflow-hidden border-4 shadow-[0_12px_0_rgba(0,0,0,0.06)] min-h-[580px] sm:min-h-[640px] lg:min-h-[720px]"
      style={{ borderColor: col.accent }}
    >
      {/* Full-bleed photo — the image is the card */}
      <Image
        src={col.img}
        alt={col.title}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          objectPosition: col.pos,
          filter: isAfter ? "none" : "grayscale(0.25)",
        }}
      />

      {/* Gradient scrim — keeps the overlaid copy legible over the photo */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(${col.scrimRGB},0.96) 0%, rgba(${col.scrimRGB},0.72) 38%, rgba(${col.scrimRGB},0.18) 64%, transparent 84%)`,
        }}
      />

      {/* Top chip */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md">
          <col.Icon
            className="w-5 h-5"
            style={{ color: col.accent }}
            strokeWidth={2.5}
          />
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-white text-xs font-extrabold shadow-sm"
          style={{ background: col.accent }}
        >
          {col.eyebrow}
        </span>
      </div>

      {/* Bottom — title + points overlaid on the photo */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <h3 className="font-display font-bold text-white text-3xl sm:text-4xl drop-shadow-lg mb-4">
          {col.title}
        </h3>
        <ul className="space-y-2.5">
          {col.points.map((pt) => (
            <li key={pt} className="flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                <PointIcon
                  className="w-4 h-4"
                  style={{ color: col.accent }}
                  strokeWidth={2.5}
                />
              </span>
              <span className="text-sm sm:text-base font-semibold text-white leading-snug drop-shadow">
                {pt}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ResultBand() {
  const accent = "#f59e0b";
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full rounded-[1.8rem] overflow-hidden border-4 shadow-[0_12px_0_rgba(0,0,0,0.06)] min-h-[580px] sm:min-h-[640px] lg:min-h-[720px]"
      style={{ borderColor: accent }}
    >
      {/* Full-bleed photo — swap in the thriving-classroom image */}
      <Image
        src={RESULT}
        alt="Students thriving with AR-powered learning"
        fill
        sizes="100vw"
        className="object-cover"
      />

      {/* Gradient scrim keeps the overlaid copy legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(2,40,70,0.96) 0%, rgba(2,40,70,0.78) 42%, rgba(2,40,70,0.35) 72%, rgba(2,40,70,0.12) 100%)",
        }}
      />

      {/* Top chip */}
      <div className="absolute top-4 left-4">
        <span
          className="px-4 py-1.5 rounded-full text-white text-xs font-extrabold shadow-sm uppercase tracking-wide"
          style={{ background: accent }}
        >
          The Result
        </span>
      </div>

      {/* Outcomes overlaid on the photo */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <h3 className="font-display font-bold text-white text-3xl sm:text-4xl drop-shadow-lg mb-5">
          It all adds up to more.
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {outcomes.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3.5"
            >
              <span className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow">
                <Icon
                  className="w-5 h-5"
                  style={{ color: accent }}
                  strokeWidth={2.4}
                />
              </span>
              <span className="text-white font-bold text-base sm:text-lg leading-snug drop-shadow">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-slate-50">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4 max-w-3xl mx-auto"
        >
          <SectionKicker>See the Difference</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            Two Very Different{" "}
            <span className="text-coral doodle-underline">Classrooms</span>
          </h2>
        </motion.div>

        {/* One line: before VS after = result */}
        <div className="relative flex flex-col lg:flex-row items-stretch gap-8 lg:gap-4">
          <div className="flex flex-1">
            <CompareCard col={columns[0]} index={0} />
          </div>

          {/* VS badge */}
          <div className="flex shrink-0 items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-secondary text-white font-display font-black text-lg leading-none flex items-center justify-center shadow-xl border-4 border-white">
              VS
            </div>
          </div>

          <div className="flex flex-1">
            <CompareCard col={columns[1]} index={1} />
          </div>

          {/* Equals badge — the comparison adds up to real outcomes */}
          <div className="flex shrink-0 items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-secondary text-white font-display font-black text-3xl leading-none flex items-center justify-center shadow-xl border-4 border-white">
              =
            </div>
          </div>

          <div className="flex flex-1">
            <ResultBand />
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-2xl bg-coral px-9 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
          >
            Bring AR to Your Classroom
            <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
