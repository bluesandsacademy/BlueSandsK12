import { Smartphone } from "lucide-react";

// TODO: replace with the exact ARpedia app listing URLs once available.
const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
  "https://play.google.com/store/search?q=ARpedia&c=apps";
const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ||
  "https://apps.apple.com/search?term=ARpedia";

const AppleGlyph = (props) => (
  <svg viewBox="0 0 384 512" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const PlayGlyph = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M4 3.5v17a1 1 0 0 0 1.53.85l13.5-8.5a1 1 0 0 0 0-1.7L5.53 2.65A1 1 0 0 0 4 3.5z" />
  </svg>
);

function StoreBadge({ href, Glyph, top, bottom }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-xl bg-secondary px-4 py-2.5 text-white hover:bg-secondary/90 transition-colors"
    >
      <Glyph className="w-5 h-5 shrink-0" />
      <span className="text-left leading-none">
        <span className="block text-[10px] font-semibold text-white/70">
          {top}
        </span>
        <span className="block text-[0.95rem] font-bold mt-0.5">{bottom}</span>
      </span>
    </a>
  );
}

/* Reusable "app is included, on Android + iOS" callout with store badges. */
export default function AppStores({ className = "", align = "left" }) {
  return (
    <div className={className}>
      <p
        className={`inline-flex items-center gap-2 text-sm font-bold text-secondary ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <Smartphone className="w-4 h-4 text-primary" strokeWidth={2.4} />
        Includes the free ARpedia app
      </p>
      <p className="text-xs text-gray-500 font-semibold mt-1">
        Download on Android and iPhone or iPad to bring every book to life.
      </p>
      <div
        className={`mt-3 flex flex-wrap gap-3 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <StoreBadge
          href={PLAY_STORE_URL}
          Glyph={PlayGlyph}
          top="Get it on"
          bottom="Google Play"
        />
        <StoreBadge
          href={APP_STORE_URL}
          Glyph={AppleGlyph}
          top="Download on the"
          bottom="App Store"
        />
      </div>
    </div>
  );
}
