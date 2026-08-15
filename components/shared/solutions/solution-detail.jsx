"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  RefreshCw,
  ShoppingBag,
  Tablet,
  X,
} from "lucide-react";
import { solutions, getSolution } from "@/lib/solutions";
import { products, buyUrl } from "@/lib/products";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import LessonHotspots from "@/components/shared/solutions/lesson-hotspots";
import FeatureExplorer from "@/components/shared/solutions/feature-explorer";
import ResponsivePanels from "@/components/shared/solutions/responsive-panels";
import MobileDisclosure, {
  ExpandableList,
} from "@/components/shared/solutions/mobile-disclosure";
import SolutionFaqs from "@/components/shared/solutions/solution-faqs";
import SolutionStickyCta from "@/components/shared/solutions/solution-sticky-cta";

const DEMO_URL = "https://calendly.com/bluesandstemlabs/30min";
const CREAM = "#FFFBF0";

/* Section forms are derived from what each section contains, rather than one
   card recipe repeated down the page. The hero states the offer, one signature
   section per product carries the decision (hotspots on the board's own
   photo), the long capability lists collapse into an explorer, and everything
   after that is deliberately quiet so the signature section is the thing a
   visitor remembers. */
export default function SolutionDetail({ slug }) {
  const s = getSolution(slug);
  if (!s) return null;

  const color = s.color;
  const otherSolutions = solutions.filter((x) => x.slug !== s.slug);
  const storeHref = buyUrl(s);
  const isSubscription = s.price.mode === "subscription";

  // The hero layout follows the photo. A wide panorama in a half-width column
  // renders as a short strip beside a much taller text block, so anything
  // that wide becomes a full-width banner instead. Squarer photos keep the
  // side-by-side split. Neither is ever cropped.
  const wideHero = s.hero.w / s.hero.h >= 1.9;

  // The headline price is the cheapest tier ("from $X"); the full with/without
  // breakdown and the renewal rate live in the note under the CTAs and in the
  // checklist comparison further down the page.
  const cheapestTier = isSubscription
    ? s.price.tiers.reduce((a, b) => (b.usd < a.usd ? b : a))
    : null;
  const priceValue = isSubscription
    ? `From $${cheapestTier.usd}`
    : "Coming soon";
  const priceLabel = isSubscription
    ? "Per student, per year"
    : "Quoted per classroom";

  const ctaHref = storeHref;
  const ctaLabel = "Get It for Your School";

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky/20 via-cream to-cream">
        <div className="relative page-frame pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-secondary/70 font-bold text-sm mb-8 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Shop
          </Link>

          {/* Reading order is fixed: name the product, show the product, then
              price it. Asking a head teacher what they will pay before they
              have seen what they are buying is the wrong order on a page whose
              whole job is a considered purchase. On the wide layout the photo
              is a banner between the headline and the actions; on the split
              layout the photo is the first thing in the DOM, so it still leads
              when the columns stack on a phone. */}
          {(() => {
            const headline = (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={wideHero ? "max-w-2xl" : ""}
              >
                <SectionKicker className="text-primary">{s.kicker}</SectionKicker>
                <h1 className="mt-3 font-display font-bold text-secondary leading-[1.04] text-4xl sm:text-5xl lg:text-[3.5rem]">
                  {s.name}
                </h1>
                <p className="mt-4 text-gray-600 text-lg sm:text-2xl font-semibold leading-snug">
                  {s.tagline}
                </p>
              </motion.div>
            );

            const photo = (
              /* Natural aspect from the real file dimensions, never cropped. */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                /* Capped on the split layout: the frame is 1440 wide, so an
                   uncapped square photo renders ~650px and pushes the price and
                   buttons below the fold. The wide banner variant is meant to
                   run the full width. */
                className={`relative rounded-4xl border-4 overflow-hidden bg-white shadow-[0_14px_0_rgba(0,0,0,0.08)] ${
                  wideHero ? "" : "lg:max-w-xl"
                }`}
                style={{ borderColor: color }}
              >
                <Image
                  src={s.hero.src}
                  alt={s.hero.alt}
                  width={s.hero.w}
                  height={s.hero.h}
                  preload
                  sizes={
                    wideHero
                      ? "(min-width: 1152px) 1120px, 92vw"
                      : "(min-width: 1024px) 560px, 92vw"
                  }
                  className="w-full h-auto"
                />
              </motion.div>
            );

            /* A real figure is the hook and gets display size. "Coming soon" is
               the absence of one, so it stays a quiet chip. */
            const actions = (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
                  {isSubscription ? (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">
                        {priceLabel}
                      </p>
                      <p
                        className="font-display font-black text-4xl sm:text-5xl leading-none mt-1.5"
                        style={{ color }}
                      >
                        {priceValue}
                      </p>
                    </div>
                  ) : (
                    <p className="inline-flex items-center gap-2 rounded-full border-2 border-secondary/12 px-4 py-2 text-sm font-bold text-secondary/70">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: color }}
                      />
                      Pricing coming soon
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-7 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
                    >
                      <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
                      {ctaLabel}
                    </a>
                    <a
                      href={DEMO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-secondary font-display font-bold text-lg border-2 border-secondary/10 shadow-[0_8px_0_rgba(2,52,90,0.12)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.12)] transition-all"
                    >
                      <CalendarCheck className="w-5 h-5" strokeWidth={2.5} />
                      Book a Demo
                    </a>
                  </div>
                </div>
                {s.price.note && (
                  <p className="mt-4 text-sm font-semibold text-gray-500 max-w-md leading-snug">
                    {s.price.note}
                  </p>
                )}
              </motion.div>
            );

            /* Both layouts read name, then product, then price. On the split
               layout that ordering has to survive the columns collapsing, so
               the DOM order is headline / photo / actions and the desktop
               arrangement is done with explicit grid placement rather than by
               putting the photo first in the markup. Source order first,
               visual order second. */
            return wideHero ? (
              <div className="flex flex-col gap-9">
                {headline}
                {photo}
                {actions}
              </div>
            ) : (
              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-x-14 lg:gap-y-7">
                <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
                  {headline}
                </div>
                <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-center">
                  {photo}
                </div>
                <div className="lg:col-start-2 lg:row-start-2 lg:self-start">
                  {actions}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Fact strip: rules, not cards. Three facts do not need three boxes. */}
        <div className="relative page-frame pb-14">
          {/* Three across even on a phone. Stacked, three facts cost 280px of
              a 844px screen for information a visitor only glances at. */}
          <dl className="grid grid-cols-3 border-t-2 border-secondary/10">
            {s.heroHighlights.map((h, i) => (
              <div
                key={h.label}
                className={`py-4 px-2.5 first:pl-0 last:pr-0 sm:py-6 sm:px-6 ${
                  i > 0 ? "border-l-2 border-secondary/10" : ""
                }`}
              >
                <dt
                  className="font-display font-bold text-lg sm:text-3xl leading-tight sm:leading-none"
                  style={{ color }}
                >
                  {h.value}
                </dt>
                <dd className="mt-1.5 sm:mt-2 text-gray-500 font-semibold text-[11px] sm:text-sm leading-snug">
                  {h.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: 44 }}
          >
            <path
              fill={CREAM}
              d="M0,50 C240,90 480,10 720,40 C960,70 1200,10 1440,40 L1440,90 L0,90 Z"
            />
          </svg>
        </div>
      </section>

      {/* ── What it does + what it changes. Prose and photo on one side, a
             ruled checklist on the other. No card grid. ── */}
      <section
        className="relative section-y overflow-hidden"
        style={{ background: CREAM }}
      >
        {/* The intro is deliberately narrow so the margin beside it is real
            whitespace doing a job, isolating one idea. The old layout stacked
            the prose and the photo in one column against a shorter checklist in
            the other, which left a large void at the bottom right that read as
            unfinished rather than focused. Photo and checklist now sit as a
            balanced pair, both anchored to the same baseline. */}
        <div className="relative page-frame">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
              What it{" "}
              <span className="doodle-underline" style={{ color }}>
                does
              </span>
            </h2>
            <p className="mt-5 text-gray-600 text-lg font-semibold leading-relaxed">
              {s.description}
            </p>
            {s.description2 && (
              <p className="mt-4 text-gray-600 text-lg font-semibold leading-relaxed">
                {s.description2}
              </p>
            )}
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {s.gallery?.[0] && (
              <div
                /* Portrait shots are capped at every breakpoint, not just on
                   mobile. Left to fill a 480px column a 2:3 poster runs 720px
                   tall and outweighs the checklist beside it, which is the same
                   imbalance in the other direction. Square and landscape shots
                   take the full column. */
                className={`rounded-3xl border-4 overflow-hidden bg-white shadow-[0_10px_0_rgba(0,0,0,0.06)] mx-auto lg:mx-0 ${
                  s.gallery[0].w / s.gallery[0].h < 0.9
                    ? "max-w-[19rem]"
                    : "max-w-sm lg:max-w-md"
                }`}
                style={{ borderColor: `${color}33` }}
              >
                <Image
                  src={s.gallery[0].src}
                  alt={s.gallery[0].alt}
                  width={s.gallery[0].w}
                  height={s.gallery[0].h}
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="w-full h-auto"
                />
              </div>
            )}

            <div>
              <SectionKicker className="text-primary">
                {s.outcomes.kicker}
              </SectionKicker>
              <h3 className="mt-3 font-display font-bold text-secondary text-2xl sm:text-3xl leading-tight">
                {s.outcomes.title}
              </h3>
              <p className="mt-4 text-gray-600 font-semibold leading-relaxed">
                {s.outcomes.body}
              </p>
              <div className="mt-6">
                <ExpandableList
                  items={s.outcomes.items}
                  label="Show the full list"
                  renderItem={(item) => (
                    <>
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${color}1f` }}
                      >
                        <Check
                          className="w-3 h-3"
                          style={{ color }}
                          strokeWidth={3.5}
                        />
                      </span>
                      <span className="font-semibold text-secondary/85 leading-snug">
                        {item}
                      </span>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Signature section: one per product, and only one. ── */}
      {s.lessonView && (
        <LessonHotspots lessonView={s.lessonView} image={s.hero} color={color} />
      )}

      {/* ── The science labs: four disciplines, four accents. Parallel content
             rendered in parallel, but never four identical cards. ── */}
      {s.labs && (
        <section
          className="relative section-y overflow-hidden"
          style={{ background: CREAM }}
        >
          <div className="relative page-frame">
            <div className="max-w-2xl mb-10 space-y-3">
              <SectionKicker className="text-primary">
                {s.labs.kicker}
              </SectionKicker>
              <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
                {s.labs.title}
              </h2>
              <p className="text-gray-600 text-lg font-semibold leading-relaxed">
                {s.labs.body}
              </p>
            </div>
            <ResponsivePanels
              items={s.labs.disciplines}
              color={color}
              getKey={(d) => d.name}
              getTabLabel={(d) => d.name.replace(" & Environmental Science", "")}
              gridClassName="sm:grid-cols-2 lg:grid-cols-4"
              renderPanel={(d) => (
                <div className="h-full rounded-3xl bg-white overflow-hidden shadow-[0_8px_0_rgba(0,0,0,0.05)] border-2 border-secondary/[0.07]">
                  <div
                    className="px-5 py-4 flex items-center gap-3"
                    style={{ background: d.accent }}
                  >
                    <d.Icon
                      className="w-6 h-6 text-white shrink-0"
                      strokeWidth={2.2}
                    />
                    <h3 className="font-display font-bold text-white text-base leading-tight">
                      {d.name}
                    </h3>
                  </div>
                  <ul className="p-5 space-y-2.5">
                    {d.topics.map((t) => (
                      <li
                        key={t}
                        className="text-gray-600 text-sm font-semibold leading-snug flex items-start gap-2"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                          style={{ background: d.accent }}
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            />
          </div>
        </section>
      )}

      {/* ── Capabilities, one tap deep instead of 131 bullets ── */}
      <FeatureExplorer
        groups={s.featureGroups}
        color={color}
        kicker="Everything it can do"
        title={
          isSubscription
            ? "What the platform gives a school"
            : "What the board gives a teacher"
        }
      />

      {/* ── STEM spotlight (blackboard only) ── */}
      {s.spotlight && (
        <section
          className="relative section-y overflow-hidden bg-secondary text-white"
        >
          <div className="relative page-frame grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <SectionKicker className="text-sunshine">
                {s.spotlight.kicker}
              </SectionKicker>
              <h2 className="mt-3 font-display font-bold text-2xl sm:text-4xl leading-tight">
                {s.spotlight.title}
              </h2>
              <p className="mt-4 text-white/70 font-semibold leading-relaxed">
                {s.spotlight.body}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-2.5">
              {s.spotlight.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3"
                >
                  <s.spotlight.Icon
                    className="w-4 h-4 text-sunshine shrink-0"
                    strokeWidth={2.4}
                  />
                  <span className="font-semibold text-white/90 text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Benefits by audience ── */}
      <section
        className="relative section-y overflow-hidden"
        style={{ background: "linear-gradient(180deg, #FFFBF0 0%, #EAF6FF 100%)" }}
      >
        <div className="relative page-frame">
          <div className="max-w-2xl mb-10 space-y-3">
            <SectionKicker className="text-primary">
              {s.audienceBenefits.kicker}
            </SectionKicker>
            <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
              {s.audienceBenefits.title}
            </h2>
          </div>
          <ResponsivePanels
            items={s.audienceBenefits.groups}
            color={color}
            getKey={(g) => g.title}
            getTabLabel={(g) => g.title.replace(/^For /, "")}
            gridClassName={
              s.audienceBenefits.groups.length === 2
                ? "lg:grid-cols-2 lg:gap-x-10"
                : "lg:grid-cols-3 lg:gap-x-10"
            }
            renderPanel={(g) => (
              <div>
                <div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-secondary/10">
                  <g.Icon
                    className="w-6 h-6 shrink-0"
                    style={{ color }}
                    strokeWidth={2.2}
                  />
                  <h3 className="font-display font-bold text-secondary text-xl leading-tight">
                    {g.title}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-gray-600 font-semibold text-sm leading-snug"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                        style={{ background: color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          />
        </div>
      </section>

      {/* ── What the money buys, as a with/without-tablet comparison rather
             than a card grid. The content is which line items differ between
             the two tiers, so it is drawn as one table instead of two lists
             that would otherwise repeat 12 of their 13 rows. Centred and
             widened past the page's usual max-w-2xl measure: this is the
             page's one decision moment, so it gets the room to read like a
             pricing table instead of another paragraph-width block. ── */}
      {s.checklist && (
        <section
          className="relative section-y overflow-hidden"
          style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}
        >
          <div className="relative page-frame">
            <div className="max-w-xl mx-auto text-center mb-10 space-y-3">
              <SectionKicker className="text-primary">
                {s.checklist.kicker}
              </SectionKicker>
              <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
                {s.checklist.title}
              </h2>
              <p className="text-gray-600 font-semibold">
                One subscription, two ways to start. Everything below runs the
                same either way, except the tablet itself.
              </p>
            </div>

            <MobileDisclosure
              label="See everything included"
              count={s.checklist.items.length}
            >
            <div
              className="max-w-3xl mx-auto rounded-[2rem] bg-white border-4 overflow-hidden shadow-[0_14px_0_rgba(0,0,0,0.06)]"
              style={{ borderColor: `${color}33` }}
            >
              {/* Column headers: the with-tablet tier is filled solid in the
                  product colour so a scanning eye lands there first, the
                  fuller of the two plans. */}
              <div className="grid grid-cols-[1fr_5rem_5rem] sm:grid-cols-[1fr_9rem_9rem]">
                <div className="flex items-end pb-3 pl-5 sm:pl-7">
                  <span className="text-gray-400 text-[11px] sm:text-xs font-bold uppercase tracking-wide">
                    What you get
                  </span>
                </div>
                {s.price.tiers.map((t) => {
                  const isWithTablet = t.key === "with-tablet";
                  return (
                    <div
                      key={t.key}
                      className="flex flex-col items-center justify-center gap-1 py-5 px-1.5"
                      style={
                        isWithTablet
                          ? { background: color }
                          : { background: `${color}0a` }
                      }
                    >
                      {isWithTablet && (
                        <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-0.5">
                          <Tablet className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                        </span>
                      )}
                      <p
                        className="font-display font-black text-2xl sm:text-3xl leading-none"
                        style={{ color: isWithTablet ? "#fff" : color }}
                      >
                        ${t.usd}
                      </p>
                      <p
                        className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide text-center leading-tight ${
                          isWithTablet ? "text-white/75" : "text-gray-400"
                        }`}
                      >
                        {t.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <ul>
                {s.checklist.items.map((item, i) => (
                  <li
                    key={item.label}
                    className={`grid grid-cols-[1fr_5rem_5rem] sm:grid-cols-[1fr_9rem_9rem] items-center gap-2 pl-5 sm:pl-7 pr-1.5 py-3 ${
                      i % 2 === 1 ? "bg-secondary/[0.025]" : ""
                    }`}
                  >
                    <span className="font-semibold text-secondary/85 text-sm sm:text-base leading-snug">
                      {item.label}
                    </span>
                    {s.price.tiers.map((t) => {
                      const has = !item.tabletOnly || t.key === "with-tablet";
                      return (
                        <span key={t.key} className="flex justify-center">
                          {has ? (
                            <span className="w-7 h-7 rounded-full bg-grass/15 flex items-center justify-center">
                              <Check className="w-4 h-4 text-grass" strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-secondary/[0.06] flex items-center justify-center">
                              <X className="w-4 h-4 text-secondary/25" strokeWidth={3} />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center gap-2.5 px-5 py-5 border-t-2 border-secondary/10 bg-secondary/[0.02]">
                <RefreshCw className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2.5} />
                <p className="text-gray-500 text-xs sm:text-sm font-semibold text-center">
                  Both tiers renew at{" "}
                  <span className="font-bold text-secondary">
                    ${s.price.renewalUsd} per student, per year
                  </span>{" "}
                  from year two.
                </p>
              </div>
            </div>
            </MobileDisclosure>
          </div>
        </section>
      )}

      {/* ── Fit and ecosystem, merged and deliberately quiet ── */}
      <section
        className="relative section-y overflow-hidden"
        style={{ background: CREAM }}
      >
        <div className="relative page-frame">
        {/* Two full-width bands, not two columns. A wrap-flow tag cloud and a
            seven-item list have no reason to be the same height, and pairing
            them 50/50 left the shorter one trailing ~400px of dead space. Each
            block now spans the width and takes the shape its own content wants:
            the tags flow across one line of thought, the ecosystem reads as a
            ruled grid of entries. */}
        <MobileDisclosure label="Where it fits, and what it connects to">
          <div>
            <SectionKicker className="text-primary">
              {s.environments.kicker}
            </SectionKicker>
            <h2 className="mt-3 font-display font-bold text-secondary text-2xl sm:text-3xl leading-tight">
              {s.environments.title}
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {s.environments.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border-2 border-secondary/12 px-4 py-2 font-bold text-secondary/75 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-12 border-t-2 border-secondary/10">
            <div className="max-w-2xl">
              <SectionKicker className="text-primary">
                {s.ecosystem.kicker}
              </SectionKicker>
              <h2 className="mt-3 font-display font-bold text-secondary text-2xl sm:text-3xl leading-tight">
                {s.ecosystem.title}
              </h2>
              <p className="mt-4 text-gray-600 font-semibold leading-relaxed">
                {s.ecosystem.body}
              </p>
            </div>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
              {s.ecosystem.items.map((item) => {
                const row = (
                  <>
                    <item.Icon
                      className="w-5 h-5 shrink-0"
                      style={{ color }}
                      strokeWidth={2.2}
                    />
                    <span className="font-bold text-secondary/85 text-sm leading-snug">
                      {item.label}
                    </span>
                    {item.href && (
                      <ArrowRight
                        className="w-4 h-4 ml-auto shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        strokeWidth={2.5}
                      />
                    )}
                  </>
                );
                return (
                  <li
                    key={item.label}
                    className="border-t-2 border-secondary/10"
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 py-3.5 hover:text-primary transition-colors"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 py-3.5">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </MobileDisclosure>
        </div>
      </section>

      {/* ── Objections ── */}
      {s.faqs?.length > 0 && <SolutionFaqs faqs={s.faqs} color={color} />}

      {/* ── One close ── */}
      <section className="relative section-y overflow-hidden bg-secondary text-white">
        <div className="relative page-frame">
          <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
            {s.cta.title}
          </h2>
          <p className="mt-5 text-white/70 text-lg font-semibold leading-relaxed">
            {s.cta.body}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={storeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
              Get It for Your School
            </a>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-8 py-4 text-white font-display font-bold text-lg border-2 border-white/20 hover:bg-white/20 transition-all"
            >
              <CalendarCheck className="w-5 h-5" strokeWidth={2.5} />
              Book a Demo
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* ── Keep browsing ── */}
      <section
        className="relative section-y-tight overflow-hidden"
        style={{ background: CREAM }}
      >
        <div className="relative page-frame">
          <h2 className="font-display font-bold text-secondary text-2xl sm:text-3xl mb-8">
            More from Blue Sands
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...otherSolutions, ...products.slice(0, 3)].map((o) => {
              const img = o.hero || { src: o.image, w: o.imageW, h: o.imageH };
              return (
                <Link
                  key={o.slug}
                  href={`/products/${o.slug}`}
                  className="group flex flex-col rounded-3xl bg-white border-2 border-secondary/10 overflow-hidden shadow-[0_6px_0_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform"
                >
                  {/* `fill` rather than width/height: with an in-flow image the
                      box's aspect-ratio loses to min-height:auto content sizing
                      and every card ends a different height. A filled child is
                      absolutely positioned, so the 4:3 box governs and the
                      titles line up. object-contain keeps the 2.17:1 panorama
                      and the book cutouts both uncropped. */}
                  <div className="relative aspect-4/3 bg-white">
                    <Image
                      src={img.src}
                      alt={o.name}
                      fill
                      sizes="(min-width: 768px) 300px, 45vw"
                      className="object-contain p-3 rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <h3 className="font-display font-bold text-secondary text-sm sm:text-base leading-tight">
                      {o.name}
                    </h3>
                    <p className="inline-flex items-center gap-1 text-primary text-sm font-bold mt-1 group-hover:translate-x-0.5 transition-transform">
                      View <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SolutionStickyCta
        label={priceLabel}
        value={priceValue}
        href={storeHref}
        color={color}
      />
    </>
  );
}
