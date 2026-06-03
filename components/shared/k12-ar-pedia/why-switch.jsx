"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, GraduationCap, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";

// Swap to Cloudinary paths when ready:
// import { img } from "@/lib/cloudinary";
// const BEFORE = img("k12-ar-pedia/child-traditional");
// const AFTER  = img("k12-ar-pedia/child-ar-pedia");
const BEFORE = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=85";
const AFTER  = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85";

const beforePoints = [
  "Passive memorisation",
  "Low student engagement",
  "Abstract, hard-to-visualise",
  "Static, outdated textbooks",
  "One-size-fits-all",
];
const afterPoints = [
  "Hands-on AR exploration",
  "High curiosity & participation",
  "Concepts alive in 3D",
  "Dynamic, visual content",
  "Immersive, adaptive learning",
];

export default function WhySwitchSection() {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const isDragging = useRef(false);
  const [interacted, setInteracted] = useState(false);

  const move = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
    if (!interacted) setInteracted(true);
  }, [interacted]);

  const onMouseDown = (e) => { isDragging.current = true; move(e.clientX); };
  const onMouseMove = (e) => { if (isDragging.current) move(e.clientX); };

  const onTouchStart = (e) => { isDragging.current = true; move(e.touches[0].clientX); };
  const onTouchMove  = (e) => { if (isDragging.current) move(e.touches[0].clientX); };

  // Auto-hide hint after 3.5s
  useEffect(() => {
    const t = setTimeout(() => setInteracted(true), 3500);
    return () => clearTimeout(t);
  }, []);

  // Global mouseup / touchend stop
  useEffect(() => {
    const stop = () => { isDragging.current = false; };
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  // Prevent scroll while dragging on touch
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e) => { if (isDragging.current) e.preventDefault(); };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  return (
    <section className="relative bg-slate-50 py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-500/40">
            <RefreshCcw className="w-4 h-4" />
            Why Make the Switch?
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Traditional Learning Is{" "}
            <span className="text-red-500">No Longer Enough</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg" style={{ fontFamily: "var(--font-jarkata)" }}>
            Drag the divider to feel the difference.
          </p>
        </motion.div>

        {/* ── Drag-to-compare ── */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          ref={containerRef}
          className="relative rounded-3xl overflow-hidden max-w-5xl mx-auto select-none"
          style={{
            aspectRatio: "16/9",
            minHeight: 280,
            cursor: "ew-resize",
            touchAction: "none",
            boxShadow: "0 40px 90px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.08)",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          {/* ── AFTER (base layer, always visible) ── */}
          <div className="absolute inset-0">
            <img
              src={AFTER}
              alt="Children thriving with K12 AR Pedia"
              className="w-full h-full object-cover object-center"
              loading="lazy"
              draggable="false"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(160deg, rgba(4,131,226,0.22) 0%, rgba(2,52,90,0.72) 100%)" }}
            />
          </div>

          {/* AFTER label (top-right, always visible) */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 pointer-events-none">
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-bold"
              style={{
                background: "rgba(16,185,129,0.92)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 20px rgba(16,185,129,0.45)",
                fontFamily: "var(--font-jarkata)",
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
              With K12 AR Pedia
            </div>
          </div>

          {/* AFTER points (bottom-right) */}
          <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20 space-y-1.5 pointer-events-none">
            {afterPoints.map((pt) => (
              <div
                key={pt}
                className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl"
                style={{
                  background: "rgba(0,0,0,0.54)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" strokeWidth={2} />
                <span className="text-white/90 text-[10px] sm:text-xs font-semibold" style={{ fontFamily: "var(--font-jarkata)" }}>
                  {pt}
                </span>
              </div>
            ))}
          </div>

          {/* ── BEFORE (clipped layer — everything in here gets cut) ── */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <img
              src={BEFORE}
              alt="Child struggling with traditional classroom learning"
              className="w-full h-full object-cover object-center"
              loading="lazy"
              draggable="false"
            />
            {/* Red desaturating overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(160deg, rgba(160,0,0,0.28) 0%, rgba(40,0,0,0.72) 100%)" }}
            />
            {/* Desaturation filter layer */}
            <div className="absolute inset-0" style={{ backdropFilter: "grayscale(0.4)" }} />

            {/* BEFORE label (top-left, clipped with image) */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
              <div
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-bold whitespace-nowrap"
                style={{
                  background: "rgba(220,38,38,0.92)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 4px 20px rgba(220,38,38,0.45)",
                  fontFamily: "var(--font-jarkata)",
                }}
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                Without AR Pedia
              </div>
            </div>

            {/* BEFORE points (bottom-left, clipped with image) */}
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 space-y-1.5">
              {beforePoints.map((pt) => (
                <div
                  key={pt}
                  className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl whitespace-nowrap"
                  style={{
                    background: "rgba(0,0,0,0.54)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <XCircle className="w-3 h-3 text-red-400 shrink-0" strokeWidth={2} />
                  <span className="text-white/90 text-[10px] sm:text-xs font-semibold" style={{ fontFamily: "var(--font-jarkata)" }}>
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider line + handle ── */}
          <div
            className="absolute top-0 bottom-0 z-30 pointer-events-none"
            style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
          >
            {/* Glow line */}
            <div
              className="absolute top-0 bottom-0 w-0.5"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 0 14px rgba(255,255,255,0.7), 0 0 28px rgba(255,255,255,0.3)",
              }}
            />
            {/* Handle */}
            <div
              className="absolute top-1/2 left-1/2 flex items-center justify-center gap-0.5 rounded-full bg-white"
              style={{
                width: 52,
                height: 52,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.35), 0 0 0 3px rgba(255,255,255,0.5)",
                cursor: "ew-resize",
              }}
            >
              <ChevronLeft className="w-4 h-4 text-secondary shrink-0" strokeWidth={2.5} />
              <ChevronRight className="w-4 h-4 text-secondary shrink-0" strokeWidth={2.5} />
            </div>
          </div>

          {/* ── Hint tooltip ── */}
          <AnimatePresence>
            {!interacted && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -4 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 pointer-events-none"
              >
                <div
                  className="px-5 py-2.5 rounded-full text-white text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap"
                  style={{
                    background: "rgba(0,0,0,0.72)",
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    fontFamily: "var(--font-jarkata)",
                  }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Drag to compare
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div
            className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 shadow-xl shadow-secondary/30"
            style={{ background: "linear-gradient(135deg, #02345a, #0483e2)" }}
          >
            <GraduationCap className="w-6 h-6 text-white shrink-0" />
            <p
              className="text-white font-bold text-base sm:text-lg"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Blue Sands K12 AR Pedia transforms classrooms into immersive learning environments.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
