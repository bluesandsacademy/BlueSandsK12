"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

/* Objection handling, which neither page had.
   Deliberately a different shape from the feature explorer above it: ruled
   rows, no icons, no tinted chips. Questions are the ones a head teacher asks
   in a demo, and every answer is drawn from the client's own brief. Anything
   we cannot answer from it (warranty length, support response times, power and
   connectivity) is left out rather than guessed at. */
export default function SolutionFaqs({ faqs, color }) {
  const [open, setOpen] = useState(null);

  return (
    <section
      className="relative section-y overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      <div className="relative page-frame">
        {/* Measure is constrained inside the frame, not by narrowing the frame:
           a question list wants ~65 characters. On desktop the block is
           centered in the frame; on mobile and tablet it stays pinned to the
           left edge like every other section. */}
        <div className="max-w-3xl lg:mx-auto">
        <div className="mb-10 space-y-3">
          <SectionKicker className="text-primary">Before you decide</SectionKicker>
          <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
            Questions schools ask
          </h2>
        </div>

        <div className="border-t-2 border-secondary/10">
          {faqs.map((f, i) => {
            const isOpen = i === open;
            return (
              <div key={f.q} className="border-b-2 border-secondary/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start gap-4 text-left py-5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="font-display font-bold text-secondary text-lg leading-snug flex-1 group-hover:text-primary transition-colors">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 mt-1 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      style={{ color }}
                      strokeWidth={2.5}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-9 text-gray-600 font-semibold leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
