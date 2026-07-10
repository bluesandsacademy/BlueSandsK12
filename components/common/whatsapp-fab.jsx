"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348139622583";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi, I'm interested in the Blue Sands K12 AR Pedia",
)}`;

const WhatsAppGlyph = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.847L.057 23.57a.5.5 0 00.603.632l5.913-1.547A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.87 9.87 0 01-5.032-1.375l-.36-.214-3.735.978.995-3.634-.235-.376A9.862 9.862 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z" />
  </svg>
);

export default function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  // On mobile the sticky CTA bar slides up after ~520px of scroll (see
  // StickyCta). Lift the button above it only while that bar is showing,
  // so it never gaps before the bar appears nor overlaps once it does.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The footer carries its own contact links and social icons, and a fixed
  // button parked on top of them hides content the user scrolled down to reach.
  // Retract the button while any part of the footer is on screen.
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setAtFooter(entry.isIntersecting);
        // Collapse the chat card as the button retracts, else it hangs detached.
        if (entry.isIntersecting) setOpen(false);
      },
      { rootMargin: "0px 0px -8px 0px" }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed right-4 lg:right-6 lg:bottom-6 z-40 print:hidden transition-[bottom,opacity,transform] duration-300 ${
        lifted ? "bottom-24" : "bottom-6"
      } ${
        atFooter
          ? "opacity-0 translate-y-24 pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
      // `inert` (not aria-hidden) so the retracted button also drops out of the
      // tab order, rather than being invisible but still focusable. The
      // pointer-events guard covers Safari below 15.5, which ignores `inert`.
      inert={atFooter}
    >
      {/* Popup card */}
      {open && (
        <div className="absolute bottom-16 right-0 w-72 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <WhatsAppGlyph className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">
                Blue Sands Team
              </p>
              <p className="text-green-300 text-xs">
                Typically replies in minutes
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <div className="p-4 space-y-3" style={{ background: "#E5DDD5" }}>
            <div className="bg-white rounded-xl rounded-tl-sm px-3.5 py-2.5 text-sm text-gray-800 shadow-sm">
              👋 Hi there! Have a question about K12 AR Pedia? Join Community
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1fb558] transition-colors"
            >
              <WhatsAppGlyph className="w-5 h-5" />
              Start Chat
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close WhatsApp chat" : "Join our WhatsApp community"}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full bg-[#25D366] text-white pl-3.5 pr-4 py-3 shadow-xl hover:bg-[#1fb558] hover:shadow-2xl transition-all"
      >
        <WhatsAppGlyph className="w-6 h-6 shrink-0" />
        <span className="font-bold text-sm hidden sm:inline whitespace-nowrap">
          {open ? "Close" : "Join Community"}
        </span>
      </button>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
