"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { School, Building2, Landmark, HeartHandshake, ArrowRight } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

const ways = [
  {
    audience: "Schools & educators",
    desc: "Bring AR Pedia to your classrooms and give every pupil a working science lab.",
    cta: "Bring AR Pedia to your school",
    href: "/preorder",
    Icon: School,
    color: "#0483e2",
  },
  {
    audience: "Corporates & CSR",
    desc: "Sponsor AR Pedia in underserved communities. Your programme carries your name, reaches named schools and real pupils, aligns with the SDGs, and comes with impact reports your board can see. Start with one classroom or take on an entire LGA.",
    cta: "Sponsor a school",
    href: "/contact",
    Icon: Building2,
    color: "#FF5A5F",
  },
  {
    audience: "Government & development partners",
    desc: "Deploy curriculum-aligned learning at state scale, through SUBEBs and existing structures, with the data to prove what is working.",
    cta: "Explore a partnership",
    href: "/partnership",
    Icon: Landmark,
    color: "#9B5DE5",
  },
  {
    audience: "Supporters & donors",
    desc: "Fund AR Pedia for a child, a classroom, or a whole school, and follow exactly where your support lands.",
    cta: "Support our mission",
    href: "/contact",
    Icon: HeartHandshake,
    color: "#3DD68C",
  },
];

export default function ImpactGetInvolved() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-cream">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <SectionKicker>Get involved</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Be part of the next{" "}
            <span className="text-primary doodle-underline">million</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {ways.map(({ audience, desc, cta, href, Icon, color }, i) => (
            <motion.div
              key={audience}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-3xl bg-white p-7 lg:p-8 border-2 shadow-sm hover:shadow-lg transition-shadow"
              style={{ borderColor: `${color}22` }}
            >
              <span
                className="flex items-center justify-center w-12 h-12 rounded-2xl"
                style={{ background: `${color}1a`, color }}
              >
                <Icon className="w-6 h-6" strokeWidth={2.2} />
              </span>
              <h3 className="mt-5 font-display font-bold text-secondary text-lg leading-tight">
                {audience}
              </h3>
              <p className="mt-2 text-gray-600 text-sm font-semibold leading-snug flex-1">
                {desc}
              </p>
              <Link
                href={href}
                className="mt-5 group inline-flex items-center gap-2 font-display font-bold text-sm"
                style={{ color }}
              >
                {cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
