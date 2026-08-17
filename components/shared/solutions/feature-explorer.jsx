"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

/* The capability browser.

   The client's brief lists 8 capability groups carrying 5 to 9 sub-points each,
   131 bullets on the tablet page if rendered flat. An accordion fixes the
   reading problem but not the space one: its height is the sum of every row
   plus whichever panel is open, so it only ever grows, and it is the answer
   every site reaches for.

   This is a master/detail instead, so the section is bounded by the taller of
   two columns rather than the total of eight rows. The index is a dark rail
   echoing the toolbar that sits on the board itself in the hero photo, and on
   the tablet page it reads as the dock of an app. Selecting an entry writes it
   onto the panel beside it.

   On a phone the rail turns on its side and scrolls horizontally, which keeps
   the vertical cost flat no matter how many capabilities get added later. */
export default function FeatureExplorer({ groups, color, kicker, title }) {
  const [active, setActive] = useState(0);
  const current = groups[active];

  // On a phone the rail scrolls further than one screen can show, and a flat
  // cut edge gives no hint that "Safe for Students" exists four taps to the
  // right. These fades read the rail's own scroll position, so they are only
  // ever visible on the side there is still something to scroll to.
  const railRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const readEdges = () => {
    const el = railRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 1,
    });
  };

  useEffect(() => {
    readEdges();
    window.addEventListener("resize", readEdges);
    return () => window.removeEventListener("resize", readEdges);
  }, [groups]);

  return (
    <section
      className="relative section-y overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      <div className="relative page-frame">
        <div className="max-w-2xl mb-10 space-y-3">
          <SectionKicker className="text-primary">{kicker}</SectionKicker>
          <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
            {title}
          </h2>
        </div>

        <div>
          {/* The index is a toolbar, laid across the top rather than down the
              side. A side rail is eight rows tall whatever is selected, and
              three of the board's capabilities carry no sub-points, so the
              panel beside it rendered as a large empty card. Across the top
              the strip costs one or two rows and the panel is only ever as
              tall as its own content. It also matches the real toolbar sitting
              on the board in the photo above. */}
          <div className="relative">
            <div
              ref={railRef}
              onScroll={readEdges}
              role="tablist"
              aria-label="Capabilities"
              className="
                flex gap-1.5 lg:flex-wrap
                overflow-x-auto lg:overflow-visible
                px-3 py-3
                snap-x snap-mandatory lg:snap-none
                rounded-3xl bg-secondary
                scrollbar-none [&::-webkit-scrollbar]:hidden
              "
            >
              {groups.map((f, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={f.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={`
                      shrink-0 snap-start
                      flex items-center gap-2.5 text-left
                      rounded-2xl px-4 py-3
                      font-display font-bold text-sm leading-tight
                      transition-colors duration-200
                      ${
                        isActive
                          ? "text-white"
                          : "text-white/55 hover:text-white hover:bg-white/5"
                      }
                    `}
                    style={isActive ? { background: color } : undefined}
                  >
                    <f.Icon
                      className="w-5 h-5 shrink-0"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <span className="whitespace-nowrap">{f.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Edge fades, phone only: the rail's own bg-secondary bleeding
                to transparent, so a tab sitting half-cut at the edge reads as
                "more here" instead of looking like the last one. */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 w-10 rounded-l-3xl bg-gradient-to-r from-secondary to-transparent transition-opacity duration-200 lg:hidden ${
                edges.start ? "opacity-0" : "opacity-100"
              }`}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-3xl bg-gradient-to-l from-secondary to-transparent transition-opacity duration-200 lg:hidden ${
                edges.end ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>

          {/* Detail panel */}
          <div
            role="tabpanel"
            className="mt-4 rounded-3xl bg-white border-2 border-secondary/10 p-6 sm:p-8 shadow-[0_8px_0_rgba(0,0,0,0.05)]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}14` }}
                  >
                    <current.Icon
                      className="w-5 h-5"
                      style={{ color }}
                      strokeWidth={2.2}
                    />
                  </span>
                  <h3 className="font-display font-bold text-secondary text-xl sm:text-2xl leading-tight">
                    {current.title}
                  </h3>
                </div>

                {current.body && (
                  <p className="mt-4 text-gray-600 font-semibold leading-relaxed">
                    {current.body}
                  </p>
                )}

                {current.items?.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {current.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-secondary"
                        style={{ background: `${color}12` }}
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
