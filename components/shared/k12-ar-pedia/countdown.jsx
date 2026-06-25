"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Package, Building2, Clock, Zap } from "lucide-react";

const stats = [
  { label: "Total Orders", value: 100, Icon: Package },
  { label: "Schools Onboarded", value: 10, Icon: Building2 },
  { label: "Early Access Slots Remaining", value: 900, Icon: Clock },
];

function getTimeLeft() {
  const target = new Date("2026-08-31T23:59:59");
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Pad({ n }) {
  return String(n).padStart(2, "0");
}

function CountUp({ target, duration = 1800 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime = null;
    const raf = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [isInView, target, duration]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

export default function CountdownSection() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time?.days ?? 0 },
    { label: "Hours", value: time?.hours ?? 0 },
    { label: "Minutes", value: time?.minutes ?? 0 },
    { label: "Seconds", value: time?.seconds ?? 0 },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0D3B5C] py-16 sm:py-20 lg:py-24">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* CSS ring decorations — no text emoji */}
      <div className="absolute top-8 left-12 w-10 h-10 rounded-full border-2 border-white/20 pointer-events-none" />
      <div className="absolute top-16 right-16 w-6 h-6 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute bottom-12 left-16 w-5 h-5 rounded-full border border-white/15 pointer-events-none" />
      <div className="absolute bottom-8 right-12 w-10 h-10 rounded-full border-2 border-white/20 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-bold border border-white/20 mb-2">
            <Zap className="w-4 h-4" />
            Limited Availability
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Nigeria National Rollout Countdown
          </h2>
          <p className="text-white/60 text-sm font-medium uppercase tracking-wider">
            First 10,000 Orders Campaign
          </p>
        </motion.div>

        {/* Stat cards with count-up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-14">
          {stats.map(({ label, value, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-white/8 border border-white/12 rounded-3xl p-6 text-center backdrop-blur-sm hover:bg-white/12 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-white/80" strokeWidth={1.75} />
              </div>
              <p
                className="text-4xl sm:text-5xl font-bold text-white mb-1 tabular-nums"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                <CountUp target={value} duration={1800 + i * 200} />
              </p>
              <p className="text-white/65 text-sm font-medium">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <p
            className="text-white/70 text-base sm:text-lg font-medium text-center"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Early Access National Rollout Ends in August
          </p>

          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 sm:w-20 lg:w-24 h-14 sm:h-20 lg:h-24 bg-white/10 border-2 border-white/20 rounded-2xl sm:rounded-3xl flex items-center justify-center backdrop-blur-sm"
                    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
                  >
                    <span
                      className="text-xl sm:text-3xl lg:text-4xl font-bold text-white tabular-nums"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      <Pad n={unit.value} />
                    </span>
                  </div>
                  <span className="text-white/50 text-[10px] sm:text-sm mt-1.5 sm:mt-2 font-medium uppercase tracking-wider">
                    {unit.label}
                  </span>
                </div>

                {i < units.length - 1 && (
                  <span className="text-white/40 text-xl sm:text-3xl font-bold -mt-5">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
