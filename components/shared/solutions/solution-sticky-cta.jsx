"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

/* Mobile buy bar. These pages run ~800 words, so once a head teacher is deep in
   the science labs the only way to act is to scroll back to the hero. The bar
   carries the price so the offer travels with the button.

   No countdown, no "limited slots": Blue Sands has not started selling, so any
   scarcity claim here would be invented. */
export default function SolutionStickyCta({ label, value, href, color }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t-2 border-secondary/10 shadow-[0_-6px_24px_-8px_rgba(2,52,90,0.25)]"
        >
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400 truncate">
                {label}
              </p>
              <p
                className="font-display font-bold text-xl leading-none mt-0.5 truncate"
                style={{ color }}
              >
                {value}
              </p>
            </div>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-coral px-5 py-3.5 text-white font-display font-bold shadow-[0_5px_0_#d63a3f] active:translate-y-0.5 active:shadow-[0_2px_0_#d63a3f] transition-all shrink-0"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
              Get It
            </a>
          </div>
          <div className="h-[env(safe-area-inset-bottom)] bg-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
