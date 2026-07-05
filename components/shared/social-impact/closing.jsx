"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, Mail } from "lucide-react";

export default function ImpactClosing() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-cream">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-secondary px-6 py-12 sm:px-12 sm:py-16 text-center shadow-[0_16px_0_rgba(2,52,90,0.15)]"
        >
          {/* warm + cool glows: North and South */}
          <div className="absolute -top-20 -left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl pointer-events-none" />

          <h2 className="relative mx-auto max-w-3xl font-display font-bold text-white leading-tight text-2xl sm:text-3xl lg:text-4xl">
            Where a child is born should never decide what they can{" "}
            <span className="text-sunshine">learn.</span>
          </h2>
          <p className="relative mx-auto max-w-xl mt-5 text-white/85 font-semibold text-base sm:text-lg">
            Help us bring immersive learning to every region of Nigeria, North
            and South.
          </p>

          <div className="relative mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/partnership"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
            >
              <Handshake className="w-6 h-6" strokeWidth={2.5} />
              Partner with us
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-8 py-4 text-white font-display font-bold text-lg backdrop-blur-sm hover:bg-white/15 transition-colors"
            >
              <Mail className="w-5 h-5" strokeWidth={2.5} />
              Contact the team
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
