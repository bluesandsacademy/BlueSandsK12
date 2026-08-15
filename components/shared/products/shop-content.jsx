"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  CalendarCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { products, howItWorks } from "@/lib/products";
import { solutions } from "@/lib/solutions";
import Price from "@/components/common/price";
import CurrencyNote from "@/components/common/currency-note";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import { FloatSparkle } from "@/components/shared/k12-ar-pedia/science-floats";
import AppStores from "@/components/shared/products/app-stores";

const DEMO_URL = "https://calendly.com/bluesandstemlabs/30min";

// One brand accent per step, cycled across the how-it-works cards.
const STEP_COLORS = [
  "#0483e2",
  "#FF5A5F",
  "#9B5DE5",
  "#3DD68C",
  "#4CC9F0",
  "#FFC83D",
  "#FF8FAB",
];

// Readable number colour on a coloured badge (navy on light hues, white on dark).
function readableOn(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#02345a" : "#ffffff";
}

function ProductCard({ p, index }) {
  // The tablet is a per-student annual subscription priced only in USD (see
  // lib/solutions.js), not a one-off NGN/USD kit price, so it renders through
  // its own `price` field instead of <Price>.
  const isSubscription = p.price?.mode === "subscription";
  const cheapestTier = isSubscription
    ? p.price.tiers.reduce((a, b) => (b.usd < a.usd ? b : a))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        href={`/products/${p.slug}`}
        className="group flex flex-col h-full rounded-4xl bg-white border-4 overflow-hidden shadow-[0_10px_0_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform"
        style={{ borderColor: p.color }}
      >
        {/* Image: the star, floating on white like the source.
            `fill`, not width/height: an in-flow image wins over the box's
            aspect-ratio via min-height:auto, so each card sized to its own
            cover and the prices below them stopped lining up. */}
        <div className="relative aspect-4/3">
          <span
            className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-extrabold text-white shadow-sm"
            style={{ background: p.color }}
          >
            {p.badge}
          </span>
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw"
            className={`object-contain p-5 drop-shadow-[0_14px_22px_rgba(2,52,90,0.16)] group-hover:scale-[1.04] transition-transform duration-500 ${
              isSubscription ? "rounded-3xl" : ""
            }`}
          />
        </div>

        {/* Minimal footer */}
        <div className="px-6 pb-6 pt-1">
          <h3 className="font-display font-bold text-secondary text-xl sm:text-2xl leading-tight">
            {p.name}
          </h3>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">
            {p.blurb}
          </p>
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="text-[11px] uppercase tracking-wide font-bold text-gray-400">
                {isSubscription ? "For schools" : "From"}
              </span>
              <p
                className="font-display font-bold text-2xl leading-none mt-0.5"
                style={{ color: p.color }}
              >
                {isSubscription ? (
                  `From $${cheapestTier.usd}`
                ) : (
                  <Price ngn={p.priceNGN} usd={p.priceUSD} />
                )}
              </p>
              <p className="text-xs font-bold text-gray-400 mt-1">{p.badge}</p>
            </div>
            <span
              className="font-display font-bold text-sm group-hover:translate-x-0.5 transition-transform"
              style={{ color: p.color }}
            >
              View →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// The Virtual Science Lab Tablet sits in the shop row beside the three AR
// books, so head teachers browsing books see the school hardware too. It
// keeps its own detail page (/products/virtual-science-lab-tablet) and its
// full marketing block further down in "for schools": this is just a
// second entry point, reshaped to fit the same card as the books.
const tabletSolution = solutions.find(
  (s) => s.slug === "virtual-science-lab-tablet",
);
const tabletCard = {
  slug: tabletSolution.slug,
  name: tabletSolution.name,
  image: tabletSolution.hero.src,
  blurb: tabletSolution.blurb,
  color: tabletSolution.color,
  badge: "SS1-SS3",
  price: tabletSolution.price,
};

export default function ShopContent() {
  const shopRowItems = [
    ...products.map((p) => ({ ...p, badge: p.ageRange })),
    tabletCard,
  ];

  return (
    <>
      {/* ── Hero: a router, not a pitch ──
          Two different people land here. A parent buying one AR book set for a
          7-year-old, and a head teacher costing a classroom display or a bulk
          kit order. The old hero spoke only to the parent
          ("made for curious kids ages 4-13") on a page that now sells both, so
          the school buyer had to scroll past three book cards to find out they
          were catered for. The hero's job is to sort them in one glance. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky/25 via-cream to-cream">
        <div className="relative page-frame pt-14 pb-12 sm:pt-16 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <SectionKicker className="text-primary">
              The Blue Sands catalogue
            </SectionKicker>
            <h1 className="mt-3 font-display font-bold text-secondary leading-[1.04] text-[2.4rem] sm:text-5xl lg:text-[3.4rem]">
              AR books for home.{" "}
              <span className="text-primary doodle-underline">
                Classroom technology
              </span>{" "}
              for schools.
            </h1>
            <p className="mt-5 max-w-xl text-lg sm:text-xl text-gray-600 font-semibold leading-snug">
              Point a tablet at the page and watch a lesson come to life, or fit
              a whole school with an interactive board and a science lab on
              every desk.
            </p>
          </motion.div>

          {/* The two paths. Deliberately not matching cards: the home route is
              light and priced, the school route is navy and quoted, so they
              read as two different kinds of purchase before a word is read. */}
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <motion.a
              href="#products"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="group rounded-4xl bg-white border-4 border-coral p-7 shadow-[0_10px_0_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform"
            >
              <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">
                For your home
              </p>
              <h2 className="mt-2 font-display font-bold text-secondary text-2xl leading-tight">
                AR book sets, ages 4 to 13
              </h2>
              <p className="mt-2 text-gray-500 font-semibold text-sm leading-snug">
                Three sets, from five picture books to a 130-experiment science
                lab. Buy one and read it tonight.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-display font-bold text-coral">
                Browse the books
                <ChevronDown
                  className="w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                  strokeWidth={2.5}
                />
              </span>
            </motion.a>

            <motion.a
              href="#for-schools"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group rounded-4xl bg-secondary text-white p-7 shadow-[0_10px_0_rgba(2,52,90,0.25)] hover:-translate-y-1 transition-transform"
            >
              <p className="text-[11px] uppercase tracking-wide font-bold text-white/50">
                For your school
              </p>
              <h2 className="mt-2 font-display font-bold text-2xl leading-tight">
                Classroom technology
              </h2>
              <p className="mt-2 text-white/70 font-semibold text-sm leading-snug">
                An interactive board for the front of the room, and a tablet
                that puts a science laboratory on every desk.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-display font-bold text-sunshine">
                See the school range
                <ArrowRight
                  className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                  strokeWidth={2.5}
                />
              </span>
            </motion.a>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: 56 }}
          >
            <path
              fill="#FFFBF0"
              d="M0,50 C240,90 480,10 720,40 C960,70 1200,10 1440,40 L1440,90 L0,90 Z"
            />
          </svg>
        </div>
      </section>

      {/* ── Product grid ── */}
      <section
        id="products"
        className="relative pt-8 pb-16 sm:pb-20 lg:pb-24 overflow-hidden"
        style={{ background: "#FFFBF0" }}
      >
        <div className="relative page-frame">
          {/* Currency control sits with the prices, not only in the header */}
          <CurrencyNote className="mb-8 sm:mb-10" />

          {/* Four cards (three AR books + the tablet) squeeze awkwardly into
              any fixed grid width, so the row scrolls horizontally instead of
              wrapping or shrinking the cards. */}
          <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth">
            {shopRowItems.map((p, i) => (
              <div
                key={p.slug}
                className="shrink-0 w-[78vw] sm:w-80 lg:w-[340px] snap-start"
              >
                <ProductCard p={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── For schools: the classroom technology, not the book kits ── */}
      <section
        id="for-schools"
        className="relative section-y overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFFBF0 0%, #EAF6FF 100%)",
        }}
      >
        <div className="relative page-frame">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-3 max-w-2xl mx-auto"
          >
            <SectionKicker className="text-primary">For schools</SectionKicker>
            <h2 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
              Classroom{" "}
              <span className="text-primary doodle-underline">Technology</span>
            </h2>
            <p className="text-gray-600 text-lg font-semibold">
              Beyond the book kits: an interactive board that replaces the
              chalkboard at the front of the room.
            </p>
          </motion.div>

          {/* The Virtual Science Lab Tablet has its own card in the shop row
              above, so it's left out of `solutions` here to avoid showing it
              twice on the page. Kept as a mapped list, not a single card, in
              case more classroom-technology solutions join the blackboard. */}
          <div className="space-y-14 lg:space-y-20 max-w-6xl mx-auto">
            {solutions
              .filter((s) => s.slug !== tabletSolution.slug)
              .map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                >
                  <Link
                    href={`/products/${s.slug}`}
                    className={`group block rounded-4xl bg-white border-4 overflow-hidden shadow-[0_10px_0_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform ${
                      i % 2 === 1 ? "lg:order-2" : ""
                    }`}
                    style={{ borderColor: s.color }}
                  >
                    <Image
                      src={s.hero.src}
                      alt={s.hero.alt}
                      width={s.hero.w}
                      height={s.hero.h}
                      sizes="(min-width: 1024px) 560px, 92vw"
                      className="w-full h-auto"
                    />
                  </Link>

                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <h3 className="font-display font-bold text-secondary text-2xl sm:text-3xl lg:text-4xl leading-tight">
                      {s.name}
                    </h3>
                    <p className="text-gray-600 text-lg font-semibold mt-2 leading-snug">
                      {s.tagline}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {s.outcomes.items.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-5 h-5 mt-0.5 shrink-0"
                            style={{ color: s.color }}
                            strokeWidth={2.5}
                          />
                          <span className="text-gray-600 font-semibold text-sm leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-end gap-x-6 gap-y-4 mt-6">
                      <div>
                        <span className="text-[11px] uppercase tracking-wide font-bold text-gray-400">
                          {s.price.mode === "subscription"
                            ? "Per student, per year"
                            : "Pricing"}
                        </span>
                        <p
                          className="font-display font-bold text-3xl leading-none mt-1"
                          style={{ color: s.color }}
                        >
                          {s.price.mode === "subscription"
                            ? `$${s.price.usd}`
                            : "Coming soon"}
                        </p>
                      </div>
                      <Link
                        href={`/products/${s.slug}`}
                        className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-white font-display font-bold shadow-[0_6px_0_rgba(0,0,0,0.15)] hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all"
                        style={{ background: s.color }}
                      >
                        See the Details
                        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
      {/* ── How it works ── */}
      <section
        className="relative section-y overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)",
        }}
      >
        <FloatSparkle
          className="absolute top-16 right-1/4 opacity-60"
          size={32}
          color="#FFC83D"
        />
        <div className="relative page-frame">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-14 space-y-3"
          >
            <SectionKicker className="text-grass">
              As Easy as Scan &amp; Watch
            </SectionKicker>
            <h2 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
              How the AR Books{" "}
              <span className="text-grass doodle-underline">Work</span>
            </h2>
          </motion.div>

          {/* Centered flex so 7 cards balance as 4 + 3 instead of an orphan row */}
          <div className="flex flex-wrap justify-center gap-5 lg:gap-6">
            {howItWorks.map((s, i) => {
              const color = STEP_COLORS[i % STEP_COLORS.length];
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="relative flex flex-col items-center text-center gap-3 rounded-[1.8rem] bg-white p-7 border-4 shadow-[0_8px_0_rgba(0,0,0,0.06)] w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-1.125rem)]"
                  style={{ borderColor: `${color}29` }}
                >
                  <span
                    className="absolute -top-4 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shadow-md kid-wobble"
                    style={{ background: color, color: readableOn(color) }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm"
                    style={{ background: `${color}1a` }}
                  >
                    <s.Icon
                      className="w-9 h-9"
                      style={{ color }}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="font-display font-bold text-secondary text-lg leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                    {s.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Get the app: Android + iOS */}
          <AppStores className="mt-12 text-center" align="center" />
        </div>
      </section>
    </>
  );
}
