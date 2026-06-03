"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Left label */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                <p className="text-red-600 text-xs font-bold uppercase tracking-wider truncate">
                  Limited Slots Left
                </p>
              </div>
              <p
                className="text-secondary text-xs font-medium truncate"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Early access closes in August
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://calendly.com/bluesandstemlabs/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-primary text-primary text-xs font-bold rounded-xl hover:bg-primary/5 transition-colors whitespace-nowrap"
              >
                Request Demo
              </a>
              <Link
                href="/products/k12-ar-pedia/preorder"
                className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap"
              >
                Preorder Now
              </Link>
            </div>
          </div>

          {/* Safe-area spacer for devices with home indicator */}
          <div className="h-safe-area-inset-bottom bg-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
