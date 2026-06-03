"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

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
      <div
        className="w-[52px] h-[46px] rounded-xl flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.07)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="text-white font-bold text-lg tabular-nums leading-none"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-white/30 text-[9px] font-semibold uppercase tracking-[0.12em]">
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
          <div
            className="relative w-[296px] rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(175deg, #0e4068 0%, #071f30 100%)",
              boxShadow: "0 32px 64px rgba(2,52,90,0.55), 0 0 0 1px rgba(255,255,255,0.07)",
            }}
          >
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Amber accent bar at top */}
            <div
              className="h-[3px] w-full"
              style={{ background: "linear-gradient(90deg, transparent 0%, #f59e0b 40%, #d97706 70%, transparent 100%)" }}
            />

            <div className="relative p-5 space-y-4">

              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                  </span>
                  <span
                    className="text-white/55 text-[10px] font-bold uppercase tracking-[0.14em]"
                  >
                    Rollout closes August 2026
                  </span>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/8 transition-all duration-200"
                >
                  <X className="w-3 h-3" strokeWidth={2.5} />
                </button>
              </div>

              {/* Timer blocks */}
              <div className="flex items-center justify-between">
                {units.map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-1">
                    <TimeBlock value={unit.value} label={unit.label} />
                    {i < units.length - 1 && (
                      <span className="text-white/20 text-sm font-light mb-4 select-none">:</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress — slots claimed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">
                    Early Access Slots
                  </span>
                  <span className="text-white/60 text-[10px] font-bold tabular-nums">
                    {CLAIMED.toLocaleString()}
                    <span className="text-white/25 font-normal"> / {TOTAL_SLOTS.toLocaleString()}</span>
                  </span>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(CLAIMED / TOTAL_SLOTS) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)" }}
                  />
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/products/k12-ar-pedia/preorder"
                className="block w-full py-3 rounded-2xl text-sm font-bold text-white text-center transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  boxShadow: "0 8px 24px rgba(245,158,11,0.28), inset 0 1px 0 rgba(255,255,255,0.15)",
                  fontFamily: "var(--font-jarkata)",
                }}
              >
                Reserve My Slot
              </Link>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
