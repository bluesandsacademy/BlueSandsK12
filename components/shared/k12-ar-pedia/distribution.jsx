"use client";

import { motion } from "framer-motion";
import { MapPin, Map, Star } from "lucide-react";
import { nigeriaStates } from "@/lib/nigeria-map-data";

const priorityStates = nigeriaStates.filter((s) => s.priority);
const allStates = nigeriaStates;

// Candy colors cycled across the live states so the map feels playful.
const CANDY = ["#0483e2", "#FF5A5F", "#3DD68C", "#9B5DE5", "#FFC83D", "#4CC9F0", "#FF8FAB"];

function StarPin({ cx, cy, color }) {
  // Small chunky 5-point star marker.
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? 9 : 4;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <g>
      <circle cx={cx} cy={cy} r={13} fill="white" opacity={0.35} />
      <polygon points={pts} fill={color} stroke="white" strokeWidth={1.5} strokeLinejoin="round" />
    </g>
  );
}

function NigeriaMap() {
  let live = -1;
  return (
    <svg viewBox="0 0 744 600" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="744" height="600" fill="#FFF7E0" rx="14" />
      {allStates.map((state) => {
        const color = state.priority ? CANDY[(++live) % CANDY.length] : "#CFE6FF";
        return (
          <path
            key={state.id}
            d={state.path}
            fill={color}
            stroke="white"
            strokeWidth={state.priority ? "2.2" : "1.1"}
            strokeLinejoin="round"
          />
        );
      })}
      {priorityStates.map(
        (state, i) =>
          state.label && (
            <g key={`label-${state.id}`}>
              <StarPin cx={state.label.cx} cy={state.label.cy} color={CANDY[i % CANDY.length]} />
              <rect
                x={state.label.cx + 12}
                y={state.label.cy - 12}
                width={state.label.name.length * 7 + 16}
                height={24}
                rx={12}
                fill="white"
              />
              <text x={state.label.cx + 18} y={state.label.cy + 5} fontSize="12" fontWeight="800" fill="#02345a" fontFamily="sans-serif">
                {state.label.name}
              </text>
            </g>
          ),
      )}
    </svg>
  );
}

export default function DistributionSection() {
  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Dots */}
      <div className="absolute top-10 left-10 w-5 h-5 rounded-full bg-blue-400/20 pointer-events-none" />
      <div className="absolute bottom-14 right-14 w-8 h-8 rounded-full border-2 border-primary/20 pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left – text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="space-y-7 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-grass px-5 py-2.5 text-white font-extrabold text-sm sm:text-base shadow-[0_5px_0_rgba(0,0,0,0.1)] kid-wobble">
              <MapPin className="w-4 h-4" strokeWidth={2.5} />
              Rolling Out Now
            </div>

            <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
              Reaching Every{" "}
              <span className="text-primary doodle-underline">Corner of Nigeria</span>
            </h2>

            <p className="text-gray-600 text-lg sm:text-xl font-semibold leading-relaxed">
              We&apos;re bringing AR magic to schools all across Nigeria — and we&apos;re
              starting with these 7 superstar states!
            </p>

            {/* Rollout progress */}
            <div className="space-y-2.5 bg-white rounded-3xl p-5 border-4 border-sunshine/50 shadow-[0_8px_0_rgba(0,0,0,0.05)]">
              <div className="flex justify-between text-base font-display font-bold">
                <span className="inline-flex items-center gap-1.5 text-secondary">
                  <Map className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  We&apos;re growing fast!
                </span>
                <span className="text-primary">Step 1 of 3</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4">
                <motion.div
                  className="bg-grass h-4 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "33%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </div>
              <p className="text-gray-500 text-sm font-semibold">7 states live now · more joining soon!</p>
            </div>

            {/* State pills */}
            <div className="flex flex-wrap gap-2.5">
              {priorityStates.map((state, i) => (
                <motion.span
                  key={state.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-primary/25 text-secondary rounded-full text-sm font-bold shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                  {state.id === "fct" ? "Abuja (FCT)" : state.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right – Nigeria map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full bg-white rounded-[1.8rem] border-4 border-primary/30 shadow-[0_12px_0_rgba(0,0,0,0.06)] p-5 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="inline-flex items-center gap-1.5 text-secondary font-display font-bold text-base">
                  <Star className="w-4 h-4 fill-sunshine text-sunshine" strokeWidth={2} />
                  Where We&apos;re Live
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-grass/15 text-green-700 rounded-full text-xs font-extrabold">
                  <span className="w-2 h-2 bg-grass rounded-full animate-pulse" />
                  Live now!
                </span>
              </div>
              <div className="w-full">
                <NigeriaMap />
              </div>
              <div className="flex items-center gap-5 mt-3 pt-3 border-t-2 border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-sunshine text-sunshine" strokeWidth={2} />
                  <span className="text-gray-600 text-sm font-bold">Live state</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-[#CFE6FF]" />
                  <span className="text-gray-600 text-sm font-bold">Coming soon</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
