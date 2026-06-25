"use client";

import { motion } from "framer-motion";
import { Heart, PawPrint, Orbit, FlaskConical, Wrench, Lightbulb } from "lucide-react";
import { FloatSparkle } from "./science-floats";
import SectionKicker from "./section-kicker";

const modules = [
  {
    Icon: Heart,
    title: "Human Anatomy",
    tagline: "Explore the body system by system",
    description: "Walk through bones, organs, and systems in full 3D. Tap any part to learn how it works — no body required.",
    imgSrc: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=85",
    color: "#FF5A5F",
  },
  {
    Icon: PawPrint,
    title: "Animals & Nature",
    tagline: "Wildlife up close in AR",
    description: "Lions, dolphins, and dinosaurs appear life-size in your classroom. Spin them. Study them. Be amazed.",
    imgSrc: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=85",
    color: "#3DD68C",
  },
  {
    Icon: Orbit,
    title: "Space & Planets",
    tagline: "Journey through the cosmos",
    description: "Land on the Moon, orbit Saturn's rings, and fly through a nebula — all from a classroom in Nigeria.",
    imgSrc: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=85",
    color: "#9B5DE5",
  },
  {
    Icon: FlaskConical,
    title: "Science Lab",
    tagline: "Experiments without equipment",
    description: "Mix acids and bases, grow crystals, watch chemical reactions unfold — zero risk, maximum discovery.",
    imgSrc: "https://images.unsplash.com/photo-1532094349884-543559059989?auto=format&fit=crop&w=600&q=85",
    color: "#4CC9F0",
  },
  {
    Icon: Wrench,
    title: "Engineering",
    tagline: "Build and test virtual machines",
    description: "Design bridges, wire circuits, and launch rockets. Engineering concepts made tangible for young minds.",
    imgSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=85",
    color: "#FFC83D",
  },
  {
    Icon: Lightbulb,
    title: "STEM Discovery",
    tagline: "Guided curiosity challenges",
    description: "Why does a bridge hold? How does electricity flow? Find out through hands-on AR challenges built to spark curiosity.",
    imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=85",
    color: "#0483e2",
  },
];

function PortalCard({ Icon, title, tagline, description, imgSrc, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover="hovered"
      className="group relative overflow-hidden rounded-[1.8rem] cursor-default bg-white border-4 shadow-[0_10px_0_rgba(0,0,0,0.06)]"
      style={{ aspectRatio: "1/1", borderColor: color }}
    >
      {/* Photo */}
      <motion.img
        variants={{ hovered: { scale: 1.08 } }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        src={imgSrc}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Light color scrim from the bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${color} 0%, ${color}cc 22%, transparent 60%)`,
        }}
      />

      {/* Icon sticker */}
      <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md kid-wobble">
        <Icon className="w-6 h-6" style={{ color }} strokeWidth={2.5} />
      </div>

      {/* Default title (fades on hover) */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-4"
        variants={{ hovered: { opacity: 0, y: 8 } }}
        transition={{ duration: 0.25 }}
      >
        <h3 className="font-display font-bold text-white text-xl leading-tight drop-shadow-md">
          {title}
        </h3>
        <p className="text-white/90 text-sm font-semibold">{tagline}</p>
      </motion.div>

      {/* Hover reveal panel */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-4"
        variants={{ initial: { y: "100%", opacity: 0 }, hovered: { y: 0, opacity: 1 } }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        style={{ background: `linear-gradient(to top, ${color} 60%, ${color}ee 100%)` }}
      >
        <h3 className="font-display font-bold text-white text-lg leading-tight mb-1.5">
          {title}
        </h3>
        <p className="text-white/95 text-xs sm:text-sm font-semibold leading-relaxed">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function ProductExperienceSection() {
  return (
    <section
      className="relative py-12 sm:py-14 lg:py-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}
    >
      {/* Playful floating shapes */}
      <div className="absolute top-12 left-8 w-10 h-10 bg-coral/30 blob-1 kid-float pointer-events-none" />
      <div className="absolute bottom-24 right-12 w-8 h-8 bg-grape/30 rounded-full kid-float pointer-events-none" style={{ animationDelay: "0.8s" }} />
      <FloatSparkle className="absolute top-20 right-1/4 opacity-60" size={32} color="#FFC83D" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 space-y-3 max-w-3xl mx-auto"
        >
          <SectionKicker className="text-grape">Explore the Worlds</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            6 Amazing Worlds{" "}
            <span className="text-grape doodle-underline">to Discover</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl font-semibold">
            Tap a world to unlock its secrets!
          </p>
        </motion.div>

        {/* Portal grid — 6 worlds in an even 2 / 3 column layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-6xl mx-auto">
          {modules.map((mod, i) => (
            <PortalCard key={mod.title} {...mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
