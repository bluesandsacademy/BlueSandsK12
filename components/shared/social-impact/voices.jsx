"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
// Official UN Sustainable Development Goal icons (public assets, unaltered).
import sdg4 from "@/public/sdg/sdg-04.jpg";
import sdg9 from "@/public/sdg/sdg-09.jpg";
import sdg10 from "@/public/sdg/sdg-10.jpg";
import sdg17 from "@/public/sdg/sdg-17.jpg";

// Real, consented testimonials from bluesandstemlabs.com.
const testimonials = [
  {
    tag: "Teacher",
    quote:
      "Blue Sands STEM Labs has made teaching Chemistry much easier and more effective. The virtual experiments allow students to see reactions that we normally can't perform due to safety or equipment limitations.",
    name: "Mrs. Fatima Abdulahi",
    role: "Chemistry Teacher",
  },
  {
    tag: "Student",
    quote:
      "Before Blue Sands STEM Labs, science felt overwhelming for me. But using the virtual labs helped me visualize every concept clearly.",
    name: "Ayomide Olanrewaju",
    role: "SS2 Student",
  },
  {
    tag: "School Leader",
    quote:
      "Integrating Blue Sands STEM Labs into our school's learning environment has been one of the best decisions we've made this year.",
    name: "Mr. Henry Ogaga",
    role: "Head of School, Paulson British International School",
  },
];

const sdgs = [
  { n: 4, img: sdg4, name: "Quality Education" },
  { n: 9, img: sdg9, name: "Industry, Innovation and Infrastructure" },
  { n: 10, img: sdg10, name: "Reduced Inequalities" },
  { n: 17, img: sdg17, name: "Partnerships for the Goals" },
];

export default function ImpactVoices() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <SectionKicker>Voices &amp; global goals</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Voices from the{" "}
            <span className="text-primary doodle-underline">classroom</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg font-semibold leading-snug">
            Hear from the teachers, students, and school leaders already learning
            with AR Pedia.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(({ tag, quote, name, role }, i) => (
            <motion.figure
              key={name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-3xl bg-cream p-7 border-2 border-secondary/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-8 h-8 text-primary/30 fill-primary/10" strokeWidth={1.5} />
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                  {tag}
                </span>
              </div>
              <blockquote className="text-secondary/80 text-base font-semibold leading-relaxed flex-1">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-secondary/10">
                <p className="text-secondary font-bold text-sm">{name}</p>
                <p className="text-gray-500 text-xs font-semibold mt-0.5 leading-snug">
                  {role}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* SDG alignment strip */}
        <div className="mt-10 rounded-3xl bg-cream border-2 border-secondary/5 p-6 sm:p-7 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary/60">
            Aligned to global goals
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 sm:gap-5">
            {sdgs.map(({ n, img, name }) => (
              <Image
                key={n}
                src={img}
                alt={`Sustainable Development Goal ${n}: ${name}`}
                width={128}
                height={128}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
