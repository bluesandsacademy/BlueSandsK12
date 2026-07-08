"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { products, buyUrl } from "@/lib/products";
import Price from "@/components/common/price";
import SectionKicker from "./section-kicker";

const DEMO_URL = "https://calendly.com/bluesandstemlabs/30min";

export default function K12PricingSection() {
  return (
    <section
      id="pricing"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-14 space-y-3 max-w-2xl mx-auto"
        >
          <SectionKicker>Simple Pricing</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Pick Your{" "}
            <span className="text-primary doodle-underline">AR Books</span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl font-semibold">
            One complete kit per title. Prices in USD.
          </p>
        </motion.div>

        {/* Product pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {products.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col h-full text-center"
            >
              {/* Image — fixed-height box so every card's image aligns */}
              <Link
                href={`/products/${p.slug}`}
                className="flex items-center justify-center h-52 sm:h-56 mb-2"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={p.imageW}
                  height={p.imageH}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 30vw, 80vw"
                  className="w-full h-full object-contain drop-shadow-[0_20px_34px_rgba(2,52,90,0.20)] group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Name + age */}
              <h3 className="font-display font-bold text-secondary text-xl leading-tight">{p.name}</h3>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mt-1">{p.ageRange}</p>
              <p className="text-gray-500 text-sm font-semibold mt-2 mb-4 px-2 min-h-11">{p.blurb}</p>

              {/* From price */}
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">From</p>
                <p className="font-display font-bold text-2xl" style={{ color: p.color }}><Price usd={p.priceUSD} /></p>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 justify-center mt-auto">
                <Link
                  href={`/products/${p.slug}`}
                  className="rounded-xl bg-white px-5 py-3 font-display font-bold text-secondary border-2 border-secondary/10 shadow-[0_5px_0_rgba(2,52,90,0.12)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(2,52,90,0.12)] transition-all"
                >
                  Details
                </Link>
                <a
                  href={buyUrl(p) || DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 font-display font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.18)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(0,0,0,0.18)] transition-all"
                  style={{ background: p.color }}
                >
                  Get it
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
