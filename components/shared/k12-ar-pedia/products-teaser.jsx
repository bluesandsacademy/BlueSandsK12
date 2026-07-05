"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { products, fmtUSD } from "@/lib/products";
import SectionKicker from "./section-kicker";
import { FloatSparkle } from "./science-floats";

export default function ProductsTeaserSection() {
  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFFBF0 0%, #EAF6FF 100%)" }}
    >
      {/* Playful shapes */}
      <div className="absolute top-12 right-10 w-10 h-10 bg-coral/30 blob-1 kid-float pointer-events-none" />
      <div className="absolute bottom-20 left-8 w-8 h-8 bg-grape/30 rounded-full kid-float pointer-events-none" style={{ animationDelay: "0.7s" }} />
      <FloatSparkle className="absolute top-20 left-1/4 opacity-60" size={32} color="#FFC83D" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <SectionKicker>Meet the Books</SectionKicker>
          <h2 className="font-display font-bold text-secondary leading-tight text-4xl sm:text-5xl lg:text-6xl">
            AR Books That Make Learning{" "}
            <span className="text-coral doodle-underline">Pop</span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-2xl font-semibold">
            Three augmented-reality book sets for curious kids ages 4–13.
          </p>
        </motion.div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {products.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <Link
                href={`/products/${p.slug}`}
                className="group flex flex-col h-full rounded-[1.8rem] bg-white border-4 overflow-hidden shadow-[0_8px_0_rgba(0,0,0,0.06)]"
                style={{ borderColor: p.color }}
              >
                {/* Image placeholder */}
                <div className="relative aspect-square flex items-center justify-center p-3 bg-white">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={p.imageW}
                    height={p.imageH}
                    sizes="(min-width: 640px) 30vw, 90vw"
                    className="w-full h-full object-contain kid-float"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  <span
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-extrabold text-white shadow-sm"
                    style={{ background: p.color }}
                  >
                    {p.ageRange}
                  </span>
                </div>
                {/* Body */}
                <div className="flex flex-col flex-1 p-4 gap-1">
                  <h3 className="font-display font-bold text-secondary text-base sm:text-lg leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 text-sm font-semibold leading-snug flex-1">
                    {p.tagline}
                  </p>
                  <div className="flex items-center justify-between pt-2 mt-1 border-t-2 border-gray-100">
                    <span className="font-display font-bold text-lg" style={{ color: p.color }}>
                      from {fmtUSD(p.priceUSD)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-bold group-hover:translate-x-0.5 transition-transform">
                      View <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA to full shop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-10 py-5 text-white font-display font-bold text-lg shadow-[0_8px_0_#0266b0] hover:translate-y-0.5 hover:shadow-[0_5px_0_#0266b0] transition-all"
          >
            <ShoppingBag className="w-6 h-6" strokeWidth={2.5} />
            Explore the Full Shop
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
