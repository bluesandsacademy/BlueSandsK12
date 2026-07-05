"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import { Wrench, TrendingUp, PiggyBank } from "lucide-react";
import { africaCountries, AFRICA_VIEWBOX } from "@/lib/africa-map-data";
import SectionKicker from "./section-kicker";

/* Share of secondary schools WITHOUT adequate science labs, by country.
   Sorted worst-first so the chart reads as a severity ranking. */
const gaps = [
  { code: "rw", country: "Rwanda", value: 74.5 },
  { code: "za", country: "South Africa", value: 70 },
  { code: "ug", country: "Uganda", value: 70 },
  { code: "ng", country: "Nigeria", value: 65 },
  { code: "gh", country: "Ghana", value: 60 },
  { code: "ke", country: "Kenya", value: 45 },
];
const gapByCode = Object.fromEntries(gaps.map((g) => [g.code, g.value]));

const GAP_MIN = 45;
const GAP_MAX = 75;
const NEUTRAL = "#DCE4EE";

/* Sequential single-hue ramp (light coral → deep red): magnitude, not
   identity. Higher gap = deeper, so map + bars share one severity scale. */
function severityColor(value) {
  const t = Math.max(0, Math.min(1, (value - GAP_MIN) / (GAP_MAX - GAP_MIN)));
  const light = [255, 180, 182];
  const deep = [214, 42, 48];
  const rgb = light.map((c, i) => Math.round(c + (deep[i] - c) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/* Real Africa map, projected from public boundary data. The six focus
   countries are shaded by their lab gap; the rest sit in a soft neutral. */
function AfricaChoropleth() {
  return (
    <svg
      viewBox={AFRICA_VIEWBOX}
      className="w-full h-auto"
      role="img"
      aria-label="Map of Africa with six countries shaded by the share of secondary schools lacking adequate science labs"
      xmlns="http://www.w3.org/2000/svg"
    >
      {africaCountries.map((c) => {
        const value = c.code ? gapByCode[c.code] : undefined;
        const focus = value !== undefined;
        return (
          <path
            key={c.id}
            d={c.path}
            fill={focus ? severityColor(value) : NEUTRAL}
            stroke="#ffffff"
            strokeWidth={focus ? 1.4 : 0.7}
            strokeLinejoin="round"
          >
            {focus && (
              <title>{`${c.name}: ${value}% of secondary schools lack adequate labs`}</title>
            )}
          </path>
        );
      })}
    </svg>
  );
}

/* Counts 0 → `to` once, when scrolled into view. */
function CountUp({ to, suffix = "", duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

function GapBar({ country, code, value, index }) {
  return (
    <div
      className="flex items-center gap-3 group"
      title={`${country}: ${value}% of secondary schools lack adequate labs`}
    >
      <div className="flex items-center gap-2 w-28 sm:w-36 shrink-0">
        <Image
          src={`https://flagcdn.com/w40/${code}.png`}
          alt=""
          width={24}
          height={16}
          className="rounded-sm object-cover shadow-sm shrink-0"
        />
        <span className="font-bold text-secondary text-sm sm:text-[0.95rem] truncate">
          {country}
        </span>
      </div>

      <div className="flex-1 h-3.5 rounded-full bg-secondary/[0.07] overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-[filter] group-hover:brightness-105"
          style={{ background: severityColor(value) }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, delay: 0.2 + index * 0.08, ease: "easeOut" }}
        />
      </div>

      <span className="w-12 text-right font-display font-black text-secondary tabular-nums text-sm sm:text-base">
        {value}%
      </span>
    </div>
  );
}

/* Supporting figures: the equipment gap (problem) and what virtual labs
   unlock (the turn). */
const supportingStats = [
  {
    value: "91%",
    text: "report insufficient equipment for hands-on science training",
    Icon: Wrench,
    tint: "bg-coral/10 text-coral",
  },
  {
    value: "40–50%",
    text: "higher student engagement with virtual labs",
    Icon: TrendingUp,
    tint: "bg-grass/15 text-green-600",
  },
  {
    value: "$50k+",
    text: "saved per institution, on average, every year",
    Icon: PiggyBank,
    tint: "bg-primary/10 text-primary",
  },
];

export default function ChallengeSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-[#F6F8FB]">
      {/* Soft background wash */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header band */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionKicker>The challenge we&apos;re solving</SectionKicker>
            <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
              The lab gap holding{" "}
              <span className="text-primary doodle-underline">Africa</span> back
            </h2>
            <p className="mt-4 text-gray-600 text-lg font-semibold max-w-md">
              Across the continent, most students study science they can never
              touch.
            </p>
          </motion.div>

          {/* Lead stat */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-5 rounded-3xl bg-secondary p-6 sm:p-7 text-white shadow-[0_14px_0_rgba(2,52,90,0.15)]"
          >
            <p className="font-display font-black leading-none text-6xl sm:text-7xl text-sunshine shrink-0">
              <CountUp to={90} suffix="%" />
            </p>
            <p className="text-white/85 font-semibold text-base sm:text-lg leading-snug">
              of African secondary schools lack appropriate science-lab
              facilities.
            </p>
          </motion.div>
        </div>

        {/* Viz: one figure — the map (where) and the bars (exact ranking)
           share a title and a single severity scale. */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="rounded-[1.8rem] bg-white p-6 sm:p-8 lg:p-10 border-2 border-secondary/10 shadow-[0_12px_0_rgba(2,52,90,0.06)]"
        >
          <figcaption>
            <p className="font-display font-bold text-secondary text-lg sm:text-xl">
              Secondary schools without adequate labs
            </p>
            <p className="text-gray-500 text-sm font-semibold mt-0.5">
              Share of schools across six focus markets
            </p>
          </figcaption>

          <div className="mt-7 grid gap-8 lg:gap-12 lg:grid-cols-[0.85fr_1.15fr] items-center">
            {/* Map */}
            <div className="mx-auto w-full max-w-95">
              <AfricaChoropleth />
            </div>

            {/* Bars */}
            <div className="space-y-5">
              {gaps.map((c, i) => (
                <GapBar key={c.code} {...c} index={i} />
              ))}
            </div>
          </div>

          {/* Shared severity legend + reading note */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div className="flex items-center gap-3 w-full max-w-xs">
              <span className="text-xs font-bold text-gray-500">
                {GAP_MIN}%
              </span>
              <div
                className="h-2.5 flex-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${severityColor(
                    GAP_MIN
                  )}, ${severityColor(GAP_MAX)})`,
                }}
              />
              <span className="text-xs font-bold text-gray-500">
                {GAP_MAX}%
              </span>
            </div>
            <p className="text-xs text-gray-400 font-semibold sm:text-right">
              Deeper shading and longer bars mean fewer working labs — the gap
              virtual labs are built to close.
            </p>
          </div>
        </motion.figure>

        {/* Supporting stats */}
        <div className="grid gap-4 sm:grid-cols-3 mt-6 lg:mt-8">
          {supportingStats.map(({ value, text, Icon, tint }, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 border border-secondary/5 shadow-sm"
            >
              <span
                className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${tint}`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </span>
              <p className="text-gray-600 text-sm font-semibold leading-snug">
                <span className="font-display font-black text-secondary text-base">
                  {value}
                </span>{" "}
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
