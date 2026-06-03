"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/cloudinary";

const builtFor = [
  "Schools",
  "STEM Academies",
  "Learning Centers",
  "Parents",
  "Smart Classrooms",
];

function TabletScreen() {
  return (
    <div className="relative aspect-video" style={{ background: "#060f1f" }}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(4,131,226,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(4,131,226,0.4) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/40">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse block" />
          <span className="text-white/70 text-[8px] font-bold tracking-widest uppercase">
            AR Pedia
          </span>
        </div>
        <div className="inline-flex items-center gap-1 bg-primary/25 border border-primary/40 rounded-full px-2 py-0.5">
          <span className="text-[7px] text-primary font-bold uppercase tracking-wide">
            Human Biology · AR Active
          </span>
        </div>
        <div className="w-5 h-2.5 rounded-sm border border-white/40 flex items-center px-0.5">
          <div className="w-3 h-1.5 bg-green-400 rounded-sm" />
        </div>
      </div>

      {/* Content: AR scan + data panel */}
      <div className="absolute inset-0 top-8 bottom-8 flex">
        {/* Left – AR scan */}
        <div className="relative flex-1 flex items-center justify-center border-r border-white/6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 bg-primary/15 rounded-full blur-2xl" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-28 h-28 rounded-full border border-primary/50 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.06, 0.3] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7,
            }}
            className="absolute w-44 h-44 rounded-full border border-primary/20 pointer-events-none"
          />
          {/* Atom */}
          <div className="relative z-10 w-16 h-16 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              className="absolute w-16 h-16 rounded-full"
              style={{
                borderTop: "1px dashed rgba(4,131,226,0.7)",
                borderBottom: "1px dashed rgba(4,131,226,0.2)",
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
              className="absolute w-10 h-10 rounded-full"
              style={{
                borderLeft: "1px solid rgba(96,165,250,0.6)",
                borderRight: "1px solid rgba(96,165,250,0.2)",
              }}
            />
            <div
              className="relative z-10 w-5 h-5 bg-primary rounded-full"
              style={{ boxShadow: "0 0 12px rgba(4,131,226,0.9)" }}
            >
              <div className="absolute inset-1 bg-white/20 rounded-full" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute w-16 h-16"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
              className="absolute w-10 h-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Right – data readouts */}
        <div className="w-40 flex flex-col justify-center gap-2 px-3 py-2">
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white/7 border border-white/10 rounded-lg px-2.5 py-2"
          >
            <p className="text-white/40 text-[7px] mb-0.5">Heart Rate</p>
            <p className="text-white text-sm font-bold leading-none">72 BPM</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white/7 border border-white/10 rounded-lg px-2.5 py-2"
          >
            <p className="text-white/40 text-[7px] mb-0.5">Oxygen Level</p>
            <p className="text-green-400 text-sm font-bold leading-none">
              98.5%
            </p>
          </motion.div>
          <motion.div
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-primary/18 border border-primary/35 rounded-lg px-2.5 py-2"
          >
            <p className="text-white/40 text-[7px] mb-0.5">Active System</p>
            <p className="text-primary text-[9px] font-semibold">
              ● Circulatory
            </p>
          </motion.div>
        </div>
      </div>

      {/* Subject tabs */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-950/80 border-t border-white/8">
        <div className="flex items-center justify-around px-4 py-1.5">
          {[
            { icon: "🫀", label: "Biology", active: true },
            { icon: "🌍", label: "Space", active: false },
            { icon: "🔬", label: "Lab", active: false },
            { icon: "⚙️", label: "Eng.", active: false },
          ].map((tab) => (
            <div
              key={tab.label}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${tab.active ? "bg-primary/20" : ""}`}
            >
              <span className="text-xs leading-none">{tab.icon}</span>
              <span
                className={`text-[7px] font-semibold ${tab.active ? "text-primary" : "text-white/35"}`}
              >
                {tab.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function K12HeroSection() {
  return (
    <section className="relative min-h-[600px] bg-primary overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-80">
        <Image
          src={img("/grid.png")}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white space-y-7"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-tight"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Transform How Nigerian Children Learn Science &amp; STEM
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-white/90 text-lg sm:text-xl leading-relaxed max-w-xl"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Introducing Blue Sands K12 AR Pedia — an immersive augmented
              reality learning system designed for children ages 5–11 to
              experience science, technology, and discovery like never before.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {builtFor.map((item) => (
                <span
                  key={item}
                  className="px-3.5 py-1.5 bg-white/10 border border-white/25 rounded-full text-sm text-white font-medium"
                >
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4 }}
              className="flex flex-col gap-3 pt-1"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://calendly.com/bluesandstemlabs/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm sm:text-base"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  Request School Demo
                </a>
                <Link
                  href="/products/k12-ar-pedia/preorder"
                  className="px-6 py-3.5 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10 text-center text-sm sm:text-base"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  Preorder Now
                </Link>
              </div>
              <Link
                href="/products/k12-ar-pedia/apply"
                className="px-6 py-3 bg-transparent text-white/90 font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/30 text-center text-sm sm:text-base sm:self-start"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Become a State Distribution Officer
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content – Tablet Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[400px] lg:h-[600px]"
          >
            {/* Landscape tablet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10"
            >
              <div className="relative bg-gray-900 rounded-4xl shadow-2xl overflow-hidden border-[7px] border-gray-800">
                {/* Camera dot */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-10" />
                <TabletScreen />
                {/* Home bar */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gray-700 rounded-full" />
              </div>

              {/* Shadow */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-black/25 blur-xl rounded-full" />
            </motion.div>

            {/* Decorative blurs */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="absolute bottom-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="0.1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
