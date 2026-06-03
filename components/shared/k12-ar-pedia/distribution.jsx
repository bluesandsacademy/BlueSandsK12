"use client";

import { motion } from "framer-motion";
import { nigeriaStates } from "@/lib/nigeria-map-data";

const priorityStates = nigeriaStates.filter((s) => s.priority);
const allStates = nigeriaStates;

function NigeriaMap() {
  return (
    <svg viewBox="0 0 744 600" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="priority-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0483e2" floodOpacity="0.45" />
        </filter>
      </defs>
      <rect width="744" height="600" fill="#e8f0fe" rx="6" />
      {allStates.map((state) => (
        <path
          key={state.id}
          d={state.path}
          fill={state.priority ? "#0483e2" : "#93c5fd"}
          stroke="white"
          strokeWidth={state.priority ? "1.6" : "0.9"}
          strokeLinejoin="round"
          filter={state.priority ? "url(#priority-shadow)" : undefined}
        />
      ))}
      {priorityStates.map(
        (state) =>
          state.label && (
            <g key={`label-${state.id}`}>
              <circle cx={state.label.cx} cy={state.label.cy} r={8} fill="white" opacity={0.25} />
              <circle cx={state.label.cx} cy={state.label.cy} r={5} fill="white" stroke="#0483e2" strokeWidth={1.8} />
              <rect
                x={state.label.cx + 10}
                y={state.label.cy - 11}
                width={state.label.name.length * 6.4 + 12}
                height={22}
                rx={11}
                fill="white"
                opacity={0.96}
              />
              <text x={state.label.cx + 15} y={state.label.cy + 5} fontSize="11" fontWeight="700" fill="#02345a" fontFamily="sans-serif">
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
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Rolling Out Now
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Reaching Every{" "}
              <span className="text-primary">Corner of Nigeria</span>
            </h2>

            <p
              className="text-gray-600 text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              State by state, we are building Nigeria's largest immersive STEM learning network — starting with 7 priority states.
            </p>

            {/* Rollout progress */}
            <div className="space-y-2.5 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-secondary">National Rollout</span>
                <span className="text-primary">Phase 1 of 3</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <motion.div
                  className="bg-primary h-3 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "33%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </div>
              <p className="text-gray-500 text-sm">7 priority states active · More joining in Phase 2</p>
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary/8 border border-primary/20 text-secondary rounded-full text-sm font-semibold"
                >
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0 animate-pulse" />
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
            <div className="relative w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-5 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-secondary font-bold text-sm" style={{ fontFamily: "var(--font-jarkata)" }}>
                  Priority States – Phase 1
                </p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <div className="w-full">
                <NigeriaMap />
              </div>
              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-sm bg-primary" />
                  <span className="text-gray-600 text-xs font-medium">Active State</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#93c5fd]" />
                  <span className="text-gray-600 text-xs font-medium">Coming Soon</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
