"use client";

import { motion } from "framer-motion";
import { Heart, PawPrint, Orbit, FlaskConical, Wrench, BookOpen, Lightbulb, Globe } from "lucide-react";
import { FloatSparkle } from "./science-floats";

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
    Icon: BookOpen,
    title: "AR Storytelling",
    tagline: "Stories that leap off the page",
    description: "Characters leap out of the book and act their scenes. Reading that children actually beg for.",
    imgSrc: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=85",
    color: "#FF8FAB",
  },
  {
    Icon: Lightbulb,
    title: "STEM Discovery",
    tagline: "Guided curiosity challenges",
    description: "Why does a bridge hold? How does electricity flow? What makes a plant grow? Find out through hands-on AR challenges built to spark the next generation of Nigerian scientists.",
    imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    color: "#0483e2",
  },
];

function PortalCard({ Icon, title, tagline, description, imgSrc, color, index, wide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover="hovered"
      className={`group relative overflow-hidden rounded-[1.8rem] cursor-pointer bg-white border-4 shadow-[0_10px_0_rgba(0,0,0,0.06)] ${wide ? "col-span-2" : ""}`}
      style={{ aspectRatio: wide ? "16/9" : "3/4", borderColor: color }}
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

      {/* Mobile: always-visible info panel */}
      <div
        className="absolute inset-x-0 bottom-0 p-3 sm:hidden"
        style={{ background: `linear-gradient(to top, ${color} 60%, ${color}ee 100%)` }}
      >
        <h3 className="font-display font-bold text-white text-base leading-tight mb-0.5">{title}</h3>
        <p className="text-white/90 text-[11px] font-semibold leading-snug line-clamp-3">{description}</p>
      </div>

      {/* Desktop: default title (fades on hover) */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-4 hidden sm:block"
        variants={{ hovered: { opacity: 0, y: 8 } }}
        transition={{ duration: 0.25 }}
      >
        <h3 className="font-display font-bold text-white text-xl leading-tight drop-shadow-md">
          {title}
        </h3>
        <p className="text-white/90 text-sm font-semibold">{tagline}</p>
      </motion.div>

      {/* Desktop: hover reveal panel */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-4 hidden sm:block"
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
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
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
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-grape px-5 py-2.5 text-white font-extrabold text-sm sm:text-base shadow-[0_5px_0_rgba(0,0,0,0.1)] kid-wobble">
            <Globe className="w-4 h-4" strokeWidth={2.5} />
            Explore the Worlds
          </div>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            7 Amazing Worlds{" "}
            <span className="text-grape doodle-underline">to Discover</span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-2xl font-semibold">
            Tap a world to unlock its secrets!
          </p>
        </motion.div>

        {/* Portal grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {modules.map((mod, i) => (
            <PortalCard key={mod.title} {...mod} index={i} wide={i === 6} />
          ))}
        </div>
      </div>
    </section>
  );
}
