"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

/* The decision moment on the blackboard page.
   A list of nine features tells a head teacher nothing about what the board
   does in a room. This puts the features back where they happen: on the actual
   classroom photo, anchored to the thing being described. The markers are
   positioned from real pixel measurements of the source image, so each one sits
   on the object in its own caption.

   The detail panel sits below the photo rather than in a tooltip, so it reads
   identically on a phone and on a desktop and never covers the picture. */
export default function LessonHotspots({ lessonView, image, color }) {
  const [active, setActive] = useState(0);
  const spot = lessonView.hotspots[active];

  return (
    <section
      className="relative section-y overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}
    >
      <div className="relative page-frame">
        <div className="max-w-2xl mb-8 space-y-3">
          <SectionKicker className="text-primary">{lessonView.kicker}</SectionKicker>
          <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
            {lessonView.title}
          </h2>
          <p className="text-gray-600 text-lg font-semibold leading-relaxed">
            {lessonView.body}
          </p>
        </div>

        <div
          className="relative rounded-4xl overflow-hidden border-4 bg-white shadow-[0_14px_0_rgba(0,0,0,0.08)]"
          style={{ borderColor: color }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.w}
            height={image.h}
            sizes="(min-width: 1152px) 1080px, 92vw"
            className="w-full h-auto"
          />

          {lessonView.hotspots.map((h, i) => {
            const isActive = i === active;
            return (
              <button
                key={h.title}
                type="button"
                onClick={() => setActive(i)}
                aria-label={h.title}
                aria-pressed={isActive}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                {/* A ring, not a filled disc: at 40px across a translucent
                    circle reads as a blob sitting on top of the classroom
                    rather than a pointer into it. */}
                <span
                  className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                    isActive ? "scale-[1.8] opacity-70" : "scale-100 opacity-0"
                  }`}
                  style={{ borderColor: color }}
                />
                <span
                  className={`relative flex items-center justify-center rounded-full font-display font-bold text-white border-2 border-white shadow-lg transition-all duration-200 ${
                    isActive
                      ? "w-9 h-9 text-sm"
                      : "w-7 h-7 text-xs hover:scale-110"
                  }`}
                  style={{ background: isActive ? color : "rgba(2,52,90,0.85)" }}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Caption panel. One row of tabs, one paragraph. */}
        <div className="mt-6 rounded-3xl bg-white border-2 border-secondary/10 p-5 sm:p-7 shadow-[0_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap gap-2 mb-5">
            {lessonView.hotspots.map((h, i) => (
              <button
                key={h.title}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-colors ${
                  i === active
                    ? "text-white"
                    : "border-secondary/15 text-secondary/70 hover:border-secondary/40"
                }`}
                style={
                  i === active
                    ? { background: color, borderColor: color }
                    : undefined
                }
              >
                <span className="tabular-nums opacity-60 mr-1.5">{i + 1}</span>
                {h.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={spot.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="text-gray-600 text-base sm:text-lg font-semibold leading-relaxed"
            >
              {spot.detail}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
