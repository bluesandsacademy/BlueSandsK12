"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        {/* Deep brand overlay — keeps it on-brand while photo adds emotion */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(4,131,226,0.88) 0%, rgba(2,52,90,0.95) 100%)",
          }}
        />
        {/* Subtle diagonal stripes */}
        <div
          className="absolute inset-0 opacity-8 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,0.04) 60px,
              rgba(255,255,255,0.04) 120px
            )`,
          }}
        />
      </div>

      {/* Dot accents */}
      <div className="absolute top-8 left-8 lg:top-14 lg:left-16 opacity-15 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="3" fill="white" />
            )),
          )}
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 lg:bottom-14 lg:right-16 opacity-15 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="3" fill="white" />
            )),
          )}
        </svg>
      </div>

      {/* Content */}
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-5 max-w-3xl mx-auto mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white/90 text-sm font-bold"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse shrink-0" />
            Early Access · Closing Soon
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight"
            style={{ fontFamily: "var(--font-jarkata)", textShadow: "0 4px 32px rgba(0,0,0,0.3)" }}
          >
            Ready to Transform<br />
            <span className="text-amber-400">Your Classroom?</span>
          </h2>

          <p
            className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Early access slots are filling fast. Don&apos;t let your school miss Nigeria&apos;s most exciting STEM movement.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://calendly.com/bluesandstemlabs/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 text-base sm:text-lg w-full sm:w-auto text-center"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Request a Free Demo
          </a>
          <Link
            href="/products/k12-ar-pedia/preorder"
            className="px-8 py-4 bg-amber-400 text-secondary font-black rounded-2xl hover:bg-amber-300 transition-all duration-300 shadow-2xl shadow-amber-400/30 text-base sm:text-lg w-full sm:w-auto text-center"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Preorder Now
          </Link>
          <Link
            href="/products/k12-ar-pedia/apply"
            className="px-8 py-4 bg-transparent text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 border-2 border-white/35 text-base sm:text-lg w-full sm:w-auto text-center"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Become a Partner
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
