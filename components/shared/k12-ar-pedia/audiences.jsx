"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarCheck, ShoppingBag, Users } from "lucide-react";
import SectionKicker from "./section-kicker";
// Static imports so Next generates a blur-up placeholder + intrinsic size.
import householdsImg from "@/public/audiences/households.png";
import schoolsImg from "@/public/audiences/schools.png";
import governmentImg from "@/public/audiences/government.png";
import ngosImg from "@/public/audiences/ngos.jpg";
import csrImg from "@/public/audiences/csr-projects.png";

const CALENDLY_URL = "https://calendly.com/bluesandstemlabs/30min";
const WA_NUMBER = "2348139622583";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi, I'd like to join the Blue Sands AR Pedia community",
)}`;

const audiences = [
  {
    name: "Households",
    tagline: "Better learning at home",
    desc: "Learn at home with interactive 3D experiences that make studying fun and easier to understand. ",
    image: householdsImg,
  },
  {
    name: "Schools",
    tagline: "Interactive, immersive classrooms",
    desc: "Turn lessons into immersive, engaging classrooms that boost participation and support the Nigerian curriculum. ",
    image: schoolsImg,
  },
  {
    name: "Government",
    tagline: "Scale quality education nationwide",
    desc: "Scale digital education nationwide, improve STEM access, and build future-ready digital skills. ",
    image: governmentImg,
  },
  {
    name: "NGOs",
    tagline: "Measurable educational impact",
    desc: "Deliver scalable, measurable education impact in underserved communities aligned with SDGs 4, 9, 10 & 17. ).",
    image: ngosImg,
  },
  {
    name: "CSR Projects",
    tagline: "Sustainable community investment",
    desc: "Invest in sustainable education initiatives that create real community impact and long-term value.",
    image: csrImg,
  },
];

const SCRIM =
  "linear-gradient(180deg, rgba(2,17,30,0.66) 0%, rgba(2,17,30,0.10) 26%, rgba(2,17,30,0.34) 54%, rgba(2,17,30,0.93) 100%)";

export default function AudiencesSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-white">
      {/* Soft wash */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto mb-12 lg:mb-14"
        >
          <SectionKicker>Who it&apos;s for</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            One Platform. One Ecosystem. One Device.
            <br /> Endless Educational Impact Across Nigeria and Africa.
            {/* <span className="text-primary doodle-underline">education</span> */}
          </h2>
          {/* <p className="mt-4 text-gray-600 text-lg font-semibold">
            One platform, real value for every part of the learning ecosystem.
          </p> */}
        </motion.div>

        {/* Tall photo cards */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map(({ name, tagline, desc, image }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-[1.6rem] aspect-[9/16] sm:aspect-[10/17] lg:aspect-[8/19] shadow-[0_16px_40px_-12px_rgba(2,52,90,0.4)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-2"
            >
              <Image
                src={image}
                alt={`${name} — ${tagline}`}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Legibility scrim */}
              <div className="absolute inset-0" style={{ background: SCRIM }} />

              {/* Title — top */}
              <h3 className="absolute inset-x-0 top-0 p-6 font-display font-bold text-white text-xl sm:text-2xl leading-tight drop-shadow">
                {name}
              </h3>

              {/* Tagline + description — bottom */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-display font-bold text-white text-lg leading-snug drop-shadow">
                  {tagline}
                </p>
                <p className="mt-2.5 text-white/85 text-sm font-medium leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
          >
            <CalendarCheck className="w-6 h-6" strokeWidth={2.5} />
            Book a Demo
          </a>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg border-2 border-secondary/10 shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all"
          >
            <ShoppingBag className="w-6 h-6 text-coral" strokeWidth={2.5} />
            Shop Kits
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-grass px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_#22a86a] hover:translate-y-0.5 hover:shadow-[0_5px_0_#22a86a] transition-all"
          >
            <Users className="w-6 h-6" strokeWidth={2.5} />
            Join Our Community
          </a>
        </div>
      </div>
    </section>
  );
}
