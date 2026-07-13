"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Wand2,
  Rocket,
  ShoppingBag,
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

/* "Available on" store badges — informational only, not links. */
function StoreBadges() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 justify-center lg:justify-start">
      <span className="text-sm font-bold text-secondary/60">Available on</span>
      <div className="flex items-center gap-3">
        <Image
          src="/badges/app-store.svg"
          alt="Available on the App Store"
          width={132}
          height={44}
          unoptimized
          className="h-11 w-auto"
        />
        <Image
          src="/badges/google-play.png"
          alt="Available on Google Play"
          width={148}
          height={44}
          unoptimized
          className="h-11 w-auto"
        />
      </div>
    </div>
  );
}

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
    images: [
      {
        src: "/real-products/arpedia-spotty.png",
        alt: "An ARpedia AR book with a 3D shark leaping off the page above the Spotty tablet holder",
      },
      {
        src: "/real-products/arpedia-books.webp",
        alt: "The ARpedia AR book collection with the Spotty holder",
      },
    ],
    kicker: "Magic Learning for Ages 5–11",
    heading: (
      <>
        Revolutionizing STEM Learning with{" "}
        <span className="text-primary doodle-underline">AR Books</span>
      </>
    ),
    body: "Bring STEM to life through AR-powered books that turn static pages into interactive 3D experiences",
    primaryCta: { label: "Shop Kits", Icon: ShoppingBag },
    secondaryCta: { label: "See the Magic", Icon: Wand2 },
    Extras: ArPediaExtras,
  },
  {
    id: "africa-innovators",
    images: [
      {
        src: "/real-products/arpedia-kit.webp",
        alt: "The ARpedia kit — Spotty stand, tablet and AR books",
      },
    ],
    kicker: "The Future of STEM Learning is Virtual Reality",
    heading: (
      <>
        Empowering Africa&apos;s Next Generation of
        <span className="text-primary doodle-underline">STEM Innovators</span>
      </>
    ),

    body: "World-class virtual labs that bridge the digital divide, unlocking STEM potential from Lagos to Cape Town.",
    primaryCta: { label: "Shop Kits", Icon: ShoppingBag },
    secondaryCta: { label: "Book a Demo", Icon: CalendarCheck },
  },
  {
    id: "africa-vr-ar",
    images: [
      {
        src: "/real-products/ar-science-lab.webp",
        alt: "The AR Science Lab kit with an AR molecule model and science books",
      },
    ],
    kicker: "The Future of STEM Learning in Africa is Augumented Reality",
    heading: (
      <>
        Immersive VR & AR Labs for{" "}
        <span className="text-primary">
          Secondary &amp;{" "}
          <span className="doodle-underline whitespace-nowrap">
            Tertiary Schools
          </span>
        </span>
      </>
    ),
    body: "Students can see, touch, and explore complex concepts in a way that makes learning clearer, faster, and genuinely exciting, bridging imagination with real understanding.",
    primaryCta: { label: "Shop Kits", Icon: ShoppingBag },
    secondaryCta: { label: "Book a Demo", Icon: CalendarCheck },
  },
];

/* A real ARpedia product shot, floating with a soft drop-shadow. */
function ProductImage({ src, alt, preload = false }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={preload}
      sizes="(min-width: 1024px) 460px, 85vw"
      className="object-contain drop-shadow-[0_22px_34px_rgba(2,52,90,0.28)]"
    />
  );
}

/* Per-slide product showcase — the slide's real product image(s) float over a
   playful backdrop (sun blob + planet + rocket + sparkles that persist while
   the product swaps with the slide). */
function ProductScene({ slide }) {
  const [main, secondary] = slide.images;
  const isFirst = slide.id === slides[0].id;

  return (
    <div className="relative mx-auto w-full max-w-xl aspect-square">
      {/* Soft sun blobs behind everything */}
      <div className="absolute inset-8 bg-sunshine/40 blob-1 blur-[2px]" />
      <div className="absolute inset-14 bg-sunshine/70 blob-2" />

      {/* Playful floats (behind the product, peeking around its edges) */}
      <FloatPlanet className="absolute -top-6 left-2 z-10" size={96} />
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 right-6 z-10 w-14 h-14 rounded-2xl bg-coral flex items-center justify-center shadow-lg -rotate-12"
      >
        <Rocket className="w-8 h-8 text-white" strokeWidth={2} />
      </motion.div>
      <FloatSparkle className="absolute bottom-16 -left-2 z-10" size={34} color="#FF5A5F" />
      <FloatSparkle className="absolute bottom-24 right-0 z-10" size={28} color="#3DD68C" />

      {/* Per-slide product image(s) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-20"
        >
          {secondary ? (
            <>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-x-2 top-0 bottom-10"
              >
                <ProductImage src={main.src} alt={main.alt} preload={isFirst} />
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-3 w-48 sm:w-56 aspect-square z-10"
              >
                <ProductImage src={secondary.src} alt={secondary.alt} />
              </motion.div>
            </>
          ) : (
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-2"
            >
              <ProductImage src={main.src} alt={main.alt} preload={isFirst} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
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
        href="/products"
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

      {/* App availability — shown on every slide */}
      <StoreBadges />

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

          {/* Right — product showcase (swaps per slide) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <ProductScene slide={activeSlide} />
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
