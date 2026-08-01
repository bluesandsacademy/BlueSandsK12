"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarCheck, FileText } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import { FloatPlanet } from "@/components/shared/k12-ar-pedia/science-floats";

const DEMO_URL = "https://calendly.com/bluesandstemlabs/30min";

// Covers both ranges now: the AR book kits and the classroom technology. This
// is the page's only closing call to action, so it cannot be book-only.
const bullets = [
  "Bulk orders for classrooms",
  "Teacher onboarding & training",
  "Set-up and rollout support",
  "Interactive boards and student tablets",
];

/* Final bottom CTA for the products page: schools, STEM centres & bulk. */
export default function SchoolsCta() {
  return (
    <section
      className="relative section-y overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      <div className="relative page-frame">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2.2rem] bg-secondary text-white p-8 sm:p-12 relative overflow-hidden"
        >
          <FloatPlanet className="absolute -top-4 -right-2 opacity-60" size={110} />
          <div className="relative max-w-2xl space-y-6">
            <SectionKicker className="text-sunshine">
              For Schools &amp; Centres
            </SectionKicker>
            <h2 className="font-display font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl">
              Fitting out a whole{" "}
              <span className="text-sunshine">school</span>
            </h2>
            <p className="text-white/80 text-lg font-semibold">
              Kitting out a school, STEM centre or learning club? We help you
              roll it out across classrooms, from AR book kits to interactive
              boards and student tablets, with training and support for your
              teachers.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="w-5 h-5 text-grass shrink-0"
                    strokeWidth={2.5}
                  />
                  <span className="font-semibold text-white/90">{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/preorder"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
              >
                <FileText className="w-5 h-5" strokeWidth={2.5} />
                Request a Quote
              </Link>
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
        </motion.div>
      </div>
    </section>
  );
}
