"use client";

import { motion } from "framer-motion";
import { Heart, PawPrint, Globe, FlaskConical, Settings, BookOpen, Lightbulb } from "lucide-react";

const modules = [
  {
    Icon: Heart,
    title: "Human Anatomy",
    tagline: "Explore the body system by system",
    description: "Walk through bones, organs, and systems in full 3D. Tap any part to learn how it works — no body required.",
    imgSrc: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=85",
    fallback: "linear-gradient(160deg,#ef4444,#9f1239)",
  },
  {
    Icon: PawPrint,
    title: "Animals & Nature",
    tagline: "Wildlife up close in AR",
    description: "Lions, dolphins, and dinosaurs appear life-size in your classroom. Spin them. Study them. Be amazed.",
    imgSrc: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=85",
    fallback: "linear-gradient(160deg,#10b981,#0f766e)",
  },
  {
    Icon: Globe,
    title: "Space & Planets",
    tagline: "Journey through the cosmos",
    description: "Land on the Moon, orbit Saturn's rings, and fly through a nebula — all from a classroom in Nigeria.",
    imgSrc: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=85",
    fallback: "linear-gradient(160deg,#6366f1,#7c3aed)",
  },
  {
    Icon: FlaskConical,
    title: "Science Lab",
    tagline: "Experiments without equipment",
    description: "Mix acids and bases, grow crystals, watch chemical reactions unfold — zero risk, maximum discovery.",
    imgSrc: "https://images.unsplash.com/photo-1532094349884-543559059989?auto=format&fit=crop&w=600&q=85",
    fallback: "linear-gradient(160deg,#3b82f6,#0891b2)",
  },
  {
    Icon: Settings,
    title: "Engineering",
    tagline: "Build and test virtual machines",
    description: "Design bridges, wire circuits, and launch rockets. Engineering concepts made tangible for young minds.",
    imgSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=85",
    fallback: "linear-gradient(160deg,#f59e0b,#d97706)",
  },
  {
    Icon: BookOpen,
    title: "AR Storytelling",
    tagline: "Stories that leap off the page",
    description: "Characters leap out of the book and act their scenes. Reading that children actually beg for.",
    imgSrc: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=85",
    fallback: "linear-gradient(160deg,#a855f7,#c026d3)",
  },
  {
    Icon: Lightbulb,
    title: "STEM Discovery",
    tagline: "Guided curiosity challenges",
    description: "Why does a bridge hold? How does electricity flow? What makes a plant grow? Find out through hands-on AR challenges designed to spark the next generation of Nigerian scientists and engineers.",
    imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    fallback: "linear-gradient(160deg,#06b6d4,#2563eb)",
  },
];

function PortalCard({ Icon, title, tagline, description, imgSrc, fallback, index, wide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      whileHover="hovered"
      className={`relative overflow-hidden rounded-3xl cursor-default group ${wide ? "col-span-2" : ""}`}
      style={{ aspectRatio: wide ? "16/9" : "3/4", background: fallback }}
    >
      {/* Photo */}
      <motion.img
        variants={{ hovered: { scale: 1.09 } }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        src={imgSrc}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Base scrim */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 30%, rgba(0,0,0,0.82) 100%)" }}
      />

      {/* Hover glow ring */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 0px rgba(255,255,255,0.2)" }}
        variants={{ hovered: { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.28)" } }}
        transition={{ duration: 0.3 }}
      />

      {/* Default content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div
            className="px-3 py-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <span className="text-white/90 text-[9px] font-bold uppercase tracking-widest">AR Module</span>
          </div>
        </div>

        {/* Bottom: title + tagline — fade out on hover */}
        <motion.div
          className="space-y-1"
          variants={{ hovered: { opacity: 0, y: 8 } }}
          transition={{ duration: 0.25 }}
        >
          <h3
            className="text-white font-black text-lg leading-tight"
            style={{ fontFamily: "var(--font-jarkata)", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
          >
            {title}
          </h3>
          <p className="text-white/70 text-sm font-medium">{tagline}</p>
        </motion.div>
      </div>

      {/* ── Hover reveal panel ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5 overflow-hidden"
        variants={{
          initial: { y: "100%", opacity: 0 },
          hovered: { y: 0, opacity: 1 },
        }}
        transition={{ duration: 0.42, ease: [0.33, 1, 0.68, 1] }}
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.88) 70%, transparent 100%)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Scan shimmer line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(4,131,226,0.6), transparent)" }}
          variants={{
            initial: { top: "0%" },
            hovered: { top: ["0%", "100%"] },
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.3 }}
        />

        <h3
          className="text-white font-black text-base sm:text-lg leading-tight mb-2"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          {title}
        </h3>
        <p
          className="text-white/65 text-xs sm:text-sm leading-relaxed mb-3"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          {description}
        </p>

        {/* AR Active indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
          <span className="text-green-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">AR Active</span>
          <span className="ml-auto text-white/30 text-xs">→ Explore</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductExperienceSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden" style={{ background: "#080d1a" }}>
      {/* Star-field dot pattern */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Central glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-72 bg-blue-600/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-60 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* AR scan line */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none z-10"
        style={{
          height: "120px",
          background: "linear-gradient(to bottom, transparent, rgba(4,131,226,0.04) 50%, transparent)",
        }}
        animate={{ y: ["-10%", "120%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-3 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400 text-gray-900 text-sm font-bold shadow-lg shadow-amber-400/30">
            <Globe className="w-4 h-4" />
            Explore the Worlds
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            7 Amazing Worlds{" "}
            <span className="text-amber-400">to Discover</span>
          </h2>
          <p className="text-white/55 text-lg" style={{ fontFamily: "var(--font-jarkata)" }}>
            Hover any world to unlock its secrets.
          </p>
        </motion.div>

        {/* Portal grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {modules.map((mod, i) => (
            <PortalCard key={mod.title} {...mod} index={i} wide={i === 6} />
          ))}
        </div>
      </div>

      {/* Wave to next section */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
          <path fill="#FFFBF0" d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" />
        </svg>
      </div>
    </section>
  );
}
