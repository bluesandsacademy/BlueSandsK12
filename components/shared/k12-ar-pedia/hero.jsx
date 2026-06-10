"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Rocket, School, FlaskConical, BookOpen, Users, Monitor } from "lucide-react";
import { FloatAtom, FloatPlanet, FloatSparkle } from "./science-floats";

const builtFor = [
  { label: "Schools", Icon: School },
  { label: "STEM Academies", Icon: FlaskConical },
  { label: "Learning Centers", Icon: BookOpen },
  { label: "Parents", Icon: Users },
  { label: "Smart Classrooms", Icon: Monitor },
];

/* A bright, friendly "AR magic" scene — a tablet with a storybook and a
   planet + rocket bursting up off the page. All flat, candy-colored shapes. */
function ArMagicScene() {
  return (
    <div className="relative mx-auto w-full max-w-md aspect-square">
      {/* Big soft sun blob behind */}
      <div className="absolute inset-6 bg-sunshine/40 blob-1 blur-[2px]" />
      <div className="absolute inset-10 bg-sunshine/70 blob-2" />

      {/* Bursting planet — overflows above the tablet */}
      <FloatPlanet className="absolute -top-6 left-6 z-20" size={120} />
      {/* Bursting rocket */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 right-8 z-20 w-16 h-16 rounded-2xl bg-coral flex items-center justify-center shadow-lg -rotate-12"
      >
        <Rocket className="w-9 h-9 text-white" strokeWidth={2} />
      </motion.div>

      {/* Sparkles */}
      <FloatSparkle className="absolute top-2 left-1/2 z-20" size={40} color="#ffffff" />
      <FloatSparkle className="absolute bottom-16 -left-2 z-20" size={34} color="#FF5A5F" />
      <FloatSparkle className="absolute bottom-24 right-0 z-20" size={28} color="#3DD68C" />

      {/* Tablet */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-4 bottom-2 top-20 z-10"
      >
        <div className="relative h-full w-full rounded-[2.2rem] bg-white border-[10px] border-secondary shadow-[0_24px_60px_rgba(2,52,90,0.28)] overflow-hidden">
          {/* Screen */}
          <div className="relative h-full w-full rounded-[1.2rem] bg-gradient-to-b from-sky/20 to-cream flex items-center justify-center overflow-hidden">
            {/* Open storybook */}
            <div className="relative w-[78%] aspect-[4/3]">
              {/* Book shadow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[88%] h-4 bg-secondary/15 blur-md rounded-full" />
              {/* Pages */}
              <div className="absolute inset-0 flex rounded-xl overflow-hidden shadow-lg">
                <div className="flex-1 bg-cream border-r-2 border-amber-200/60 p-3 space-y-1.5">
                  <div className="h-1.5 rounded-full bg-coral/40 w-3/4" />
                  <div className="h-1.5 rounded-full bg-gray-200 w-full" />
                  <div className="h-1.5 rounded-full bg-gray-200 w-5/6" />
                  <div className="mt-2 h-8 rounded-lg bg-grass/30" />
                </div>
                <div className="flex-1 bg-white p-3 flex items-center justify-center">
                  {/* Atom rising off the page */}
                  <FloatAtom size={70} />
                </div>
              </div>
            </div>
          </div>
          {/* Camera dot */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-secondary/40" />
        </div>
      </motion.div>
    </div>
  );
}

export default function K12HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky/25 via-cream to-cream">
      {/* Floating background shapes */}
      <div className="absolute top-16 left-6 w-10 h-10 bg-coral/30 blob-1 kid-float pointer-events-none" />
      <div className="absolute top-40 right-10 w-6 h-6 bg-grape/40 rounded-full kid-float pointer-events-none" style={{ animationDelay: "1.2s" }} />
      <div className="absolute top-1/3 right-4 w-8 h-8 bg-grass/30 rounded-full kid-float pointer-events-none" style={{ animationDelay: "0.6s" }} />
      <FloatSparkle className="absolute top-24 left-1/2 opacity-70" size={30} color="#FFC83D" />

      <div className="relative z-10 mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7 text-center lg:text-left"
          >
            {/* Sticker badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-sunshine px-5 py-2.5 text-secondary font-extrabold text-sm sm:text-base shadow-[0_6px_0_rgba(0,0,0,0.08)] kid-wobble">
              <Sparkles className="w-5 h-5" strokeWidth={2.5} />
              Magic Learning for Ages 5–11
            </div>

            <h1
              className="font-display font-bold text-secondary leading-[1.05] text-[2.6rem] sm:text-6xl lg:text-7xl"
            >
              Watch Science{" "}
              <span className="text-primary doodle-underline">Leap</span>{" "}
              Off the Page!
            </h1>

            <p className="mx-auto lg:mx-0 max-w-md text-lg sm:text-2xl text-gray-600 font-semibold leading-snug">
              Point the tablet at any book and watch planets, animals and
              experiments pop to life right in front of you.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/preorder"
                className="group inline-flex items-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
              >
                <Rocket className="w-6 h-6" strokeWidth={2.5} />
                Preorder Now
              </Link>
              <a
                href="https://calendly.com/bluesandstemlabs/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all border-2 border-secondary/10"
              >
                <Sparkles className="w-6 h-6 text-sunshine" strokeWidth={2.5} />
                See the Magic
              </a>
            </div>

            {/* Built-for pills */}
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start pt-1">
              {builtFor.map(({ label, Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-secondary shadow-sm border-2 border-sunshine/40"
                >
                  <Icon className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  {label}
                </span>
              ))}
            </div>

            <Link
              href="/apply"
              className="inline-block text-base font-bold text-primary underline-offset-4 hover:underline"
            >
              Become a State Distribution Officer →
            </Link>
          </motion.div>

          {/* Right — AR magic scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <ArMagicScene />
          </motion.div>
        </div>
      </div>

      {/* Bottom playful wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
        <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="w-full" style={{ height: 70 }}>
          <path
            fill="#ffffff"
            d="M0,50 C180,100 360,10 540,40 C720,70 900,110 1080,80 C1260,55 1380,20 1440,40 L1440,110 L0,110 Z"
          />
        </svg>
      </div>
    </section>
  );
}
