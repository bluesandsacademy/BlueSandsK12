"use client";

import { motion } from "framer-motion";
import { BookMarked, FlaskConical, Bot, Monitor, Microscope } from "lucide-react";
import { FloatAtom, FloatPlanet } from "./science-floats";

const portals = [
  {
    Icon: BookMarked,
    label: "AR Books",
    sub: "Scan any page. Watch the world appear.",
    imgSrc: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=85",
    fallback: "linear-gradient(160deg,#2563eb,#1e40af)",
    rotate: "-rotate-2",
    overlay: "from-blue-900/30 via-transparent to-blue-950/80",
    accent: "bg-blue-500",
  },
  {
    Icon: FlaskConical,
    label: "STEM Lab",
    sub: "Run experiments. No equipment needed.",
    imgSrc: "https://images.unsplash.com/photo-1532094349884-543559059989?auto=format&fit=crop&w=700&q=85",
    fallback: "linear-gradient(160deg,#7c3aed,#4f46e5)",
    rotate: "rotate-1",
    overlay: "from-violet-900/30 via-transparent to-violet-950/80",
    accent: "bg-violet-500",
  },
  {
    Icon: Bot,
    label: "AI Learning",
    sub: "Adapts to every child's curiosity.",
    imgSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85",
    fallback: "linear-gradient(160deg,#059669,#065f46)",
    rotate: "-rotate-1",
    overlay: "from-emerald-900/30 via-transparent to-emerald-950/80",
    accent: "bg-emerald-500",
  },
  {
    Icon: Monitor,
    label: "Smart Classroom",
    sub: "Works in any school. Anywhere.",
    imgSrc: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=700&q=85",
    fallback: "linear-gradient(160deg,#d97706,#b45309)",
    rotate: "rotate-2",
    overlay: "from-amber-900/30 via-transparent to-amber-950/80",
    accent: "bg-amber-500",
  },
];

const targetTypes = ["Nursery Schools", "Primary Schools", "Homeschool", "STEM Clubs", "Learning Labs"];

export default function WhatIsSection() {
  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fef9c3 0%, #fef3c7 50%, #fde68a 100%)" }}
    >
      {/* Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-lg h-128 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Science float decorations */}
      <FloatAtom className="absolute top-10 right-8 lg:top-16 lg:right-14 opacity-35" size={100} />
      <FloatPlanet className="absolute bottom-10 left-6 lg:bottom-14 lg:left-12 opacity-25" size={88} />

      {/* Scattered dots */}
      {[
        { top: "10", right: "16", size: "5", opacity: "25" },
        { top: "24", right: "32", size: "3", opacity: "30" },
        { top: "20", left: "24", size: "8", opacity: "20" },
        { bottom: "20", left: "12", size: "6", opacity: "20" },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-500/20 pointer-events-none"
          style={{
            width: `${d.size * 4}px`,
            height: `${d.size * 4}px`,
            ...(d.top ? { top: `${d.top * 4}px` } : { bottom: `${d.bottom * 4}px` }),
            ...(d.right ? { right: `${d.right * 4}px` } : { left: `${d.left * 4}px` }),
          }}
        />
      ))}

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-400/40">
            <Microscope className="w-4 h-4" />
            What is it?
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Learning That Jumps{" "}
            <span className="text-amber-600">Off the Page</span>
          </h2>
          <p
            className="text-gray-700 text-lg sm:text-xl max-w-md mx-auto"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Point the tablet at any page. Watch the world appear.
          </p>
        </motion.div>

        {/* 2x2 photo portal grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto mb-14">
          {portals.map(({ Icon, label, sub, imgSrc, fallback, rotate, overlay, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover="hovered"
              className={`relative overflow-hidden rounded-3xl cursor-default ${rotate}`}
              style={{ aspectRatio: "4/5", background: fallback }}
            >
              {/* Photo */}
              <motion.img
                variants={{ hovered: { scale: 1.07 } }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                src={imgSrc}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 35%, rgba(0,0,0,0.85) 100%)",
                }}
              />

              {/* Hover inset ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                variants={{ hovered: { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.3)" } }}
                transition={{ duration: 0.25 }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between">
                {/* Top: icon pill */}
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    <Icon className="w-4 h-4 text-white shrink-0" strokeWidth={2} />
                    <span
                      className="text-white font-bold text-xs"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {label}
                    </span>
                  </div>
                </div>

                {/* Bottom */}
                <div>
                  <p
                    className="text-white/75 text-xs sm:text-sm leading-snug font-medium"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {sub}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Age badge + target types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex items-center gap-5 px-8 py-5 bg-white rounded-3xl shadow-xl border-2 border-amber-300">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/40 shrink-0">
              <span
                className="text-white font-black text-2xl leading-none"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                5–11
              </span>
            </div>
            <div>
              <p
                className="text-secondary font-black text-xl"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Designed for Children
              </p>
              <p className="text-gray-500 text-sm">Ages 5 to 11 · Nursery through Primary</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {targetTypes.map((type) => (
              <span
                key={type}
                className="px-4 py-2 bg-amber-400 text-white rounded-full text-sm font-bold shadow-md shadow-amber-400/30"
              >
                {type}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
