"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import Price from "@/components/common/price";

/* The decision moment for a bulk buyer, a school or a parent group ordering
   more than one kit. Each kit is a flat one-off price, so the only question is
   how many children need their own copy. Every figure here is exact, not
   modelled: the only input is the headcount and the only operation is
   multiplication. */
export default function KitCalculator({ product, buyHref }) {
  const [kids, setKids] = useState(5);

  const safe = Number.isFinite(kids) && kids > 0 ? kids : 0;
  const totalNGN = safe * product.priceNGN;
  const totalUSD = safe * product.priceUSD;
  const presets = [5, 10, 20, 30];

  return (
    <section
      className="relative section-y overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}
    >
      <div className="relative page-frame">
        <div className="max-w-2xl mb-10 space-y-3">
          <SectionKicker className="text-primary">
            Buying for a group?
          </SectionKicker>
          <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
            Work out the total for your order
          </h2>
          <p className="text-gray-600 text-lg font-semibold leading-relaxed">
            Each child needs their own kit. Set how many you&apos;re buying and
            the page does the multiplication for you.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[2.2rem] bg-secondary text-white overflow-hidden shadow-[0_16px_40px_-12px_rgba(2,52,90,0.45)]"
        >
          <div className="grid lg:grid-cols-2">
            {/* Input side */}
            <div className="p-7 sm:p-9 lg:border-r border-white/10">
              <label
                htmlFor="kid-count"
                className="block font-display font-bold text-lg mb-1"
              >
                How many children?
              </label>
              <p className="text-white/60 text-sm font-semibold mb-5">
                Every child who&apos;ll have their own kit.
              </p>

              <div className="flex items-center gap-3 mb-5">
                <input
                  id="kid-count"
                  type="number"
                  min={5}
                  max={5000}
                  value={kids}
                  onChange={(e) =>
                    setKids(parseInt(e.target.value, 10) || 0)
                  }
                  className="w-36 rounded-2xl bg-white/10 border-2 border-white/20 px-4 py-3 font-display font-bold text-2xl text-white focus:outline-none focus:border-white/60 transition-colors"
                />
                <span className="font-semibold text-white/70">children</span>
              </div>

              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={Math.min(Math.max(safe, 5), 100)}
                onChange={(e) => setKids(parseInt(e.target.value, 10))}
                aria-label="Number of children"
                className="w-full accent-white cursor-pointer"
              />

              <div className="flex flex-wrap gap-2 mt-6">
                {presets.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setKids(n)}
                    className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-colors ${
                      safe === n
                        ? "bg-white text-secondary border-white"
                        : "border-white/25 text-white/80 hover:border-white/60"
                    }`}
                  >
                    {n.toLocaleString("en-US")}
                  </button>
                ))}
              </div>
            </div>

            {/* Result side */}
            <div className="p-7 sm:p-9 bg-white/[0.06]">
              <p className="text-[11px] uppercase tracking-wide font-bold text-white/50">
                Your total
              </p>
              <p
                className="font-display font-black leading-none mt-2 text-5xl sm:text-6xl break-words"
                style={{ color: product.color }}
              >
                <Price ngn={totalNGN} usd={totalUSD} />
              </p>
              <p className="text-white/70 font-semibold text-sm mt-3">
                {safe.toLocaleString("en-US")} kits x{" "}
                <Price ngn={product.priceNGN} usd={product.priceUSD} /> each
              </p>

              <dl className="mt-7 pt-6 border-t border-white/15 space-y-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/70 font-semibold text-sm">
                    Price per kit
                  </dt>
                  <dd className="font-display font-bold text-xl">
                    <Price ngn={product.priceNGN} usd={product.priceUSD} />
                  </dd>
                </div>
              </dl>

              <a
                href={buyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-6 py-4 text-white font-display font-bold text-lg shadow-[0_6px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_3px_0_#d63a3f] transition-all"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
                Buy in Store
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
