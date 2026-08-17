"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { products, buyUrl } from "@/lib/products";
import { solutions } from "@/lib/solutions";
import Price from "@/components/common/price";
import CurrencyNote from "@/components/common/currency-note";
import SectionKicker from "./section-kicker";

const DEMO_URL = "https://calendly.com/bluesandstemlabs/30min";
const SECTION_BG = "#FFFBF0";

/* One row, five products, scrolled horizontally.

   The catalogue no longer divides evenly: three AR kits plus two classroom
   products is five, which orphans a row in any 3-up grid and grows to seven
   screens of stacked cards on a phone. A single scrolling row keeps the whole
   range on one line at any width, and costs the same vertical space whether we
   sell five products or nine.

   The row bleeds to the viewport edge with negative margins whose padding
   matches the page frame exactly, so the first card still starts on the same
   left edge as every other section while the last one runs off-screen, which is
   what tells a reader there is more to the right. */
export default function K12PricingSection() {
  const scroller = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    // rAF rather than a synchronous call: setting state directly inside an
    // effect body is what the react-hooks/set-state-in-effect rule flags.
    const id = requestAnimationFrame(sync);
    const el = scroller.current;
    el?.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(id);
      el?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const page = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card
      ? card.getBoundingClientRect().width + 24
      : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Books and classroom products carry different fields, so they are flattened
  // into one shape here and the card below stays a single component.
  const cards = [
    ...products.map((p) => ({
      key: p.slug,
      href: `/products/${p.slug}`,
      color: p.color,
      src: p.image,
      w: p.imageW,
      h: p.imageH,
      alt: p.name,
      name: p.name,
      eyebrow: p.ageRange,
      blurb: p.blurb,
      priceLabel: "From",
      price: <Price ngn={p.priceNGN} usd={p.priceUSD} />,
      ctaHref: buyUrl(p) || DEMO_URL,
      ctaLabel: "Pre-Order",
    })),
    ...solutions.map((s) => {
      const subscription = s.price.mode === "subscription";
      const mainTier = subscription
        ? (s.price.tiers.find((t) => t.key === "with-tablet") ??
          s.price.tiers[0])
        : null;
      return {
        key: s.slug,
        href: `/products/${s.slug}`,
        color: s.color,
        src: s.hero.src,
        w: s.hero.w,
        h: s.hero.h,
        alt: s.hero.alt,
        name: s.name,
        eyebrow: s.kicker,
        blurb: s.blurb,
        priceLabel: subscription ? "Full package, tablet included" : "Pricing",
        price: subscription ? `$${mainTier.usd}` : "Coming soon",
        ctaHref: buyUrl(s) || DEMO_URL,
        ctaLabel: "Get It",
      };
    }),
  ];

  const arrowBase =
    "w-11 h-11 rounded-full bg-white border-2 border-secondary/10 flex items-center justify-center text-secondary shadow-[0_4px_0_rgba(2,52,90,0.10)] transition-all disabled:opacity-30 disabled:shadow-none enabled:hover:text-primary enabled:hover:border-primary/30";

  return (
    <section
      id="pricing"
      className="relative section-y overflow-hidden"
      style={{ background: SECTION_BG }}
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="page-frame">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          /* Centred, like every other section header on the landing page
             (about, metrics, what-is, comparison, ecosystem, audiences). The
             left-aligned heading convention belongs to the product detail
             pages, not here. */
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <SectionKicker>Simple Pricing</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            What Everything{" "}
            <span className="text-primary doodle-underline">Costs</span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl font-semibold">
            AR book kits for the home, and classroom technology for schools.
          </p>
        </motion.div>

        {/* Currency control and the scroll arrows share a line: both are
            controls for the row underneath, so they belong together above it. */}
        <div className="relative mt-8 mb-6 flex items-center justify-center">
          <CurrencyNote />
          <div className="hidden sm:flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label="Scroll to previous products"
              className={arrowBase}
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label="Scroll to more products"
              className={arrowBase}
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Edge fades, shown only on the side that has more to reveal. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 transition-opacity duration-300 ${
              atStart ? "opacity-0" : "opacity-100"
            }`}
            style={{
              background: `linear-gradient(90deg, ${SECTION_BG}, transparent)`,
            }}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 transition-opacity duration-300 ${
              atEnd ? "opacity-0" : "opacity-100"
            }`}
            style={{
              background: `linear-gradient(270deg, ${SECTION_BG}, transparent)`,
            }}
          />

          <div
            ref={scroller}
            /* scroll-pl must mirror the px. Without it, snap-mandatory aligns
               the first card to the container's border box and ignores the
               padding, parking the row at scrollLeft:32 on load and pulling the
               first card 32px left of the page frame. scroll-padding tells snap
               where "start" actually is. */
            className="
              flex gap-6 overflow-x-auto snap-x snap-mandatory
              -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8
              scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8
              pb-4
              scrollbar-none [&::-webkit-scrollbar]:hidden
            "
          >
            {cards.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.08 }}
                className="shrink-0 snap-start w-62 sm:w-67 lg:w-72 flex"
              >
                <div className="group flex flex-col w-full text-center">
                  {/* Height-bounded box, not a fixed aspect: these five images
                      run from illustrated book covers to real classroom
                      photos at different ratios, and containing them inside a
                      shared height keeps every card's text on the same
                      baseline without cropping any of them. */}
                  <Link
                    href={c.href}
                    className="flex items-center justify-center h-44 sm:h-52 mb-3"
                  >
                    {c.key === "virtual-science-lab-tablet" ? (
                      /* This one photo is a true square (1024x1024), unlike
                         the wider/taller art on every other card, so
                         `object-contain` in the shared height box letterboxes
                         it and rounding the <img> itself only rounds the
                         blank margins either side, not the artwork. A square
                         frame matching the photo's own ratio puts the rounded
                         edge on the actual pixels instead. */
                      <div className="h-full aspect-square overflow-hidden rounded-xl">
                        <Image
                          src={c.src}
                          alt={c.alt}
                          width={c.w}
                          height={c.h}
                          sizes="(min-width: 1024px) 286px, (min-width: 640px) 268px, 248px"
                          className="w-full h-full object-cover drop-shadow-[0_18px_30px_rgba(2,52,90,0.18)] group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <Image
                        src={c.src}
                        alt={c.alt}
                        width={c.w}
                        height={c.h}
                        sizes="(min-width: 1024px) 286px, (min-width: 640px) 268px, 248px"
                        className="w-full h-full object-contain rounded-2xl drop-shadow-[0_18px_30px_rgba(2,52,90,0.18)] group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </Link>

                  <h3 className="font-display font-bold text-secondary text-lg leading-tight">
                    {c.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mt-1">
                    {c.eyebrow}
                  </p>
                  <p className="text-gray-500 text-sm font-semibold mt-2 mb-4 min-h-11 leading-snug">
                    {c.blurb}
                  </p>

                  <div className="mb-5 mt-auto">
                    <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">
                      {c.priceLabel}
                    </p>
                    <p
                      className="font-display font-bold text-2xl"
                      style={{ color: c.color }}
                    >
                      {c.price}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Link
                      href={c.href}
                      className="rounded-xl bg-white px-4 py-2.5 text-sm font-display font-bold text-secondary border-2 border-secondary/10 shadow-[0_4px_0_rgba(2,52,90,0.12)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(2,52,90,0.12)] transition-all"
                    >
                      Details
                    </Link>
                    <a
                      href={c.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-display font-bold text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(0,0,0,0.18)] transition-all"
                      style={{ background: c.color }}
                    >
                      {c.ctaLabel}
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
