"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Wand2,
  Rocket,
  School,
  FlaskConical,
  BookOpen,
  Users,
  Monitor,
  MapPin,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FloatPlanet, FloatSparkle } from "./science-floats";
import SectionKicker from "./section-kicker";

const CALENDLY_URL = "https://calendly.com/bluesandstemlabs/30min";
const AUTOPLAY_MS = 6500;

const builtFor = [
  { label: "Schools", Icon: School },
  { label: "STEM Academies", Icon: FlaskConical },

  { label: "Parents", Icon: Users },
  { label: "Smart Classrooms", Icon: Monitor },
];

/* Extras rendered only on the first (AR Pedia) slide. */
function ArPediaExtras() {
  return (
    <>
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

      {/* Partner CTA — tertiary action for a different audience,
         separated and visually quieter than the primary CTAs above */}
      <div className="flex justify-center lg:justify-start border-t border-secondary/10 pt-6 mt-2">
        <Link
          href="/apply"
          className="group inline-flex items-center gap-2.5 rounded-2xl border-2 border-grape/60 bg-grape/5 px-6 py-3 text-grape font-display font-bold text-base hover:bg-grape/10 hover:border-grape transition-colors"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-grape/15">
            <MapPin className="w-4 h-4" strokeWidth={2.5} />
          </span>
          Become a State Distribution Officer
        </Link>
      </div>
    </>
  );
}

const slides = [
  {
    id: "ar-pedia",
    kicker: "Magic Learning for Ages 5–11",
    heading: (
      <>
        Revolutionizing STEM Learning with{" "}
        <span className="text-primary doodle-underline">AR Books</span>
      </>
    ),
    body: "Point the tablet at any book and watch planets, animals and experiments pop to life right in front of you.",
    primaryCta: { label: "Preorder Now", Icon: Rocket },
    secondaryCta: { label: "See the Magic", Icon: Wand2 },
    Extras: ArPediaExtras,
  },
  {
    id: "africa-innovators",
    kicker: "The Future of STEM Learning in Africa is Virtual and Real",
    heading: (
      <>
        Empowering Africa&apos;s Next Generation of
        <span className="text-primary doodle-underline">STEM Innovators</span>
      </>
    ),

    body: "World-class virtual labs that bridge the digital divide, unlocking STEM potential from Lagos to Cape Town.",
    primaryCta: { label: "Pre-Order", Icon: Rocket },
    secondaryCta: { label: "Book a Demo", Icon: CalendarCheck },
  },
  {
    id: "africa-vr-ar",
    kicker: "The Future of STEM Learning in Africa is Virtual and Real",
    heading: (
      <>
        Immersive VR & AR Labs for{" "}
        <span className="text-primary doodle-underline">
          Secondary & Tertiary Schools
        </span>
      </>
    ),
    body: "Engaging STEM courses on any tablet or PC, learn anywhere, anytime.",
    primaryCta: { label: "Pre-Order", Icon: Rocket },
    secondaryCta: { label: "Book a Demo", Icon: CalendarCheck },
  },
];

/* A bright, friendly "AR magic" scene — real photos of children learning,
   framed playfully with a planet + rocket bursting up and floating sparkles. */
function ArMagicScene() {
  return (
    <div className="relative mx-auto w-full max-w-md aspect-square">
      {/* Big soft sun blob behind */}
      <div className="absolute inset-6 bg-sunshine/40 blob-1 blur-[2px]" />
      <div className="absolute inset-10 bg-sunshine/70 blob-2" />

      {/* Bursting planet — overflows above the photo */}
      <FloatPlanet className="absolute -top-6 left-6 z-30" size={110} />
      {/* Bursting rocket */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 right-8 z-30 w-16 h-16 rounded-2xl bg-coral flex items-center justify-center shadow-lg -rotate-12"
      >
        <Rocket className="w-9 h-9 text-white" strokeWidth={2} />
      </motion.div>

      {/* Sparkles */}
      <FloatSparkle
        className="absolute top-2 left-1/2 z-30"
        size={40}
        color="#ffffff"
      />
      <FloatSparkle
        className="absolute bottom-16 -left-2 z-30"
        size={34}
        color="#FF5A5F"
      />
      <FloatSparkle
        className="absolute bottom-24 right-0 z-30"
        size={28}
        color="#3DD68C"
      />

      {/* Main photo — a child exploring a lesson */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-6 bottom-4 top-14 z-10"
      >
        <div className="relative h-full w-full rounded-[2.2rem] overflow-hidden border-[8px] border-white shadow-[0_24px_60px_rgba(2,52,90,0.28)]">
          <Image
            src="/hero2.jpg"
            alt="A child exploring a STEM lesson with Blue Sands K12 AR Pedia"
            fill
            preload
            sizes="(min-width: 1024px) 450px, 90vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Smaller overlapping photo — a classroom moment */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-3 -right-1 z-20 w-40 sm:w-48"
      >
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-[6px] border-white shadow-[0_16px_40px_rgba(2,52,90,0.25)]">
          <Image
            src="/hero1.jpg"
            alt="Children learning together in an AR-powered classroom"
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}

/* Primary + secondary call-to-action buttons for a slide.
   Primary always routes to /preorder; secondary opens the demo booking link. */
function SlideCtas({ primaryCta, secondaryCta }) {
  const { label: primaryLabel, Icon: PrimaryIcon } = primaryCta;
  const { label: secondaryLabel, Icon: SecondaryIcon } = secondaryCta;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
      <Link
        href="/preorder"
        className="group inline-flex items-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
      >
        <PrimaryIcon className="w-6 h-6" strokeWidth={2.5} />
        {primaryLabel}
      </Link>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all border-2 border-secondary/10"
      >
        <SecondaryIcon className="w-6 h-6 text-grape" strokeWidth={2.5} />
        {secondaryLabel}
      </a>
    </div>
  );
}

function SlideCopy({ slide }) {
  const {
    kicker,
    heading,
    subheading,
    body,
    primaryCta,
    secondaryCta,
    Extras,
  } = slide;

  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5 }}
      className="space-y-7 text-center lg:text-left"
    >
      {/* Eyebrow */}
      <SectionKicker>{kicker}</SectionKicker>

      <h1 className="font-display font-bold text-secondary leading-[1.05] text-[2.4rem] sm:text-5xl lg:text-6xl">
        {heading}
      </h1>

      {subheading && (
        <p className="mx-auto lg:mx-0 max-w-md text-xl sm:text-2xl text-primary font-display font-bold leading-snug">
          {subheading}
        </p>
      )}

      <p className="mx-auto lg:mx-0 max-w-md text-lg sm:text-xl text-gray-600 font-semibold leading-snug">
        {body}
      </p>

      {/* CTAs */}
      <SlideCtas primaryCta={primaryCta} secondaryCta={secondaryCta} />

      {Extras && <Extras />}
    </motion.div>
  );
}

export default function K12HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, []);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, index]);

  const activeSlide = slides[index];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-sky/25 via-cream to-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Blue Sands STEM highlights"
    >
      {/* Floating background shapes */}
      <div className="absolute top-16 left-6 w-10 h-10 bg-coral/30 blob-1 kid-float pointer-events-none" />
      <div
        className="absolute top-40 right-10 w-6 h-6 bg-grape/40 rounded-full kid-float pointer-events-none"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="absolute top-1/3 right-4 w-8 h-8 bg-grass/30 rounded-full kid-float pointer-events-none"
        style={{ animationDelay: "0.6s" }}
      />
      <FloatSparkle
        className="absolute top-24 left-1/2 opacity-70"
        size={30}
        color="#FFC83D"
      />

      <div className="relative z-10 mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — copy (swaps per slide) */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <SlideCopy key={activeSlide.id} slide={activeSlide} />
            </AnimatePresence>
          </div>

          {/* Right — AR magic scene (persists across slides) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <ArMagicScene />
          </motion.div>
        </div>

        {/* Slider controls */}
        <div className="mt-12 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-secondary shadow-[0_6px_0_rgba(2,52,90,0.12)] border-2 border-secondary/10 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(2,52,90,0.12)] transition-all"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-3 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-coral"
                    : "w-3 bg-secondary/20 hover:bg-secondary/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-secondary shadow-[0_6px_0_rgba(2,52,90,0.12)] border-2 border-secondary/10 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(2,52,90,0.12)] transition-all"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bottom playful wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 70 }}
        >
          <path
            fill="#ffffff"
            d="M0,50 C180,100 360,10 540,40 C720,70 900,110 1080,80 C1260,55 1380,20 1440,40 L1440,110 L0,110 Z"
          />
        </svg>
      </div>
    </section>
  );
}
