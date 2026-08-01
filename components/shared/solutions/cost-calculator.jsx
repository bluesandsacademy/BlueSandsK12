"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

/* The decision moment on the tablet page.
   A per-student subscription is bought on one calculation: enrolment x price.
   A head teacher with 400 students is looking at $60,000 a year, and until the
   page does that multiplication it is asking them to do arithmetic before they
   can judge the offer. Every figure here is exact, not modelled: the only input
   is the school's own enrolment and the only operation is multiplication.

   It is deliberately the one dark panel on an otherwise cream page, because it
   is the one section a buyer must not scroll past. */
export default function CostCalculator({ config, usdPerStudent, color, storeHref }) {
  const [students, setStudents] = useState(config.defaultStudents);

  const safe = Number.isFinite(students) && students > 0 ? students : 0;
  const annual = safe * usdPerStudent;
  const perStudentMonth = usdPerStudent / 12;
  const perClass = usdPerStudent * config.classSize;

  const money = (n, dp = 0) =>
    `$${n.toLocaleString("en-US", {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    })}`;

  return (
    <section
      className="relative section-y overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #FFFBF0 100%)" }}
    >
      <div className="relative page-frame">
        {/* Left-aligned like every other section heading on the page. Centring
            this one alone put its heading at a different x to the nine above
            and below it. */}
        <div className="max-w-2xl mb-10 space-y-3">
          <SectionKicker className="text-primary">{config.kicker}</SectionKicker>
          <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl leading-tight">
            {config.title}
          </h2>
          <p className="text-gray-600 text-lg font-semibold leading-relaxed">
            {config.body}
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
                htmlFor="student-count"
                className="block font-display font-bold text-lg mb-1"
              >
                How many students?
              </label>
              <p className="text-white/60 text-sm font-semibold mb-5">
                Every student who would use a tablet.
              </p>

              <div className="flex items-center gap-3 mb-5">
                <input
                  id="student-count"
                  type="number"
                  min={1}
                  max={20000}
                  value={students}
                  onChange={(e) => setStudents(parseInt(e.target.value, 10) || 0)}
                  className="w-36 rounded-2xl bg-white/10 border-2 border-white/20 px-4 py-3 font-display font-bold text-2xl text-white focus:outline-none focus:border-white/60 transition-colors"
                />
                <span className="font-semibold text-white/70">students</span>
              </div>

              <input
                type="range"
                min={20}
                max={2000}
                step={10}
                value={Math.min(Math.max(safe, 20), 2000)}
                onChange={(e) => setStudents(parseInt(e.target.value, 10))}
                aria-label="Number of students"
                className="w-full accent-white cursor-pointer"
              />

              <div className="flex flex-wrap gap-2 mt-6">
                {config.presets.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStudents(n)}
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
                Your school, per year
              </p>
              <p
                className="font-display font-black leading-none mt-2 text-5xl sm:text-6xl break-words"
                style={{ color }}
              >
                {money(annual)}
              </p>
              <p className="text-white/70 font-semibold text-sm mt-3">
                {safe.toLocaleString("en-US")} students x {money(usdPerStudent)} per
                student, per year
              </p>

              <dl className="mt-7 pt-6 border-t border-white/15 space-y-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/70 font-semibold text-sm">
                    Per student, per month
                  </dt>
                  <dd className="font-display font-bold text-xl">
                    {money(perStudentMonth, 2)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/70 font-semibold text-sm">
                    A class of {config.classSize}, per year
                  </dt>
                  <dd className="font-display font-bold text-xl">
                    {money(perClass)}
                  </dd>
                </div>
              </dl>

              <a
                href={storeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-6 py-4 text-white font-display font-bold text-lg shadow-[0_6px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_3px_0_#d63a3f] transition-all"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
                Subscribe in Store
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
