"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Clock, Rocket } from "lucide-react";

function getTimeLeft() {
  const target = new Date("2026-08-31T23:59:59");
  const diff = target - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const TOTAL_SLOTS = 1000;
const CLAIMED     = 100;

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-13 h-12 rounded-xl flex items-center justify-center bg-primary shadow-[0_4px_0_#0266b0]">
        <span className="text-white font-display font-bold text-xl tabular-nums leading-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-secondary/60 text-[10px] font-bold uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default function CountdownFloat() {
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [time,      setTime]      = useState(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days",  value: time?.days    ?? 0 },
    { label: "Hours", value: time?.hours   ?? 0 },
    { label: "Mins",  value: time?.minutes ?? 0 },
    { label: "Secs",  value: time?.seconds ?? 0 },
  ];

  const expired = time !== null && units.every((u) => u.value === 0);

  return (
    <AnimatePresence>
      {visible && !dismissed && !expired && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 hidden lg:block"
        >
          <div className="relative w-74 rounded-3xl overflow-hidden bg-white border-4 border-sunshine shadow-[0_18px_40px_rgba(2,52,90,0.25)]">
            {/* Sunshine accent bar at top */}
            <div className="h-2 w-full bg-sunshine" />

            <div className="relative p-5 space-y-4">

              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-coral" strokeWidth={2.5} />
                  <span className="text-secondary text-xs font-extrabold">
                    Closes August 2026
                  </span>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              </div>

              {/* Timer blocks */}
              <div className="flex items-center justify-between">
                {units.map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-1">
                    <TimeBlock value={unit.value} label={unit.label} />
                    {i < units.length - 1 && (
                      <span className="text-primary/30 text-sm font-bold mb-4 select-none">:</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress — slots claimed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-secondary/70 text-xs font-bold">
                    Early Access Slots
                  </span>
                  <span className="text-secondary text-xs font-extrabold tabular-nums">
                    {CLAIMED.toLocaleString()}
                    <span className="text-gray-400 font-bold"> / {TOTAL_SLOTS.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
                  <motion.div
                    className="h-full rounded-full bg-grass"
                    initial={{ width: 0 }}
                    animate={{ width: `${(CLAIMED / TOTAL_SLOTS) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/preorder"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-base font-display font-bold text-white text-center bg-coral shadow-[0_6px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_3px_0_#d63a3f] transition-all"
              >
                Reserve My Slot
                <Rocket className="w-5 h-5" strokeWidth={2.5} />
              </Link>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
