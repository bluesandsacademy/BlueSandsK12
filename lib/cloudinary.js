const BASE = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || "";

// Dissect the base URL so we can inject transformation parameters.
// BASE = "https://res.cloudinary.com/<cloud>/image/upload/bls"
//        ─────────────────────────────────────────── ┬ ──── ───
//                           prefix (ends with /upload/) │   folder
let _prefix = ""; // "https://…/upload/"
let _folder = ""; // "bls"

if (BASE) {
  const idx = BASE.indexOf("/upload/");
  _prefix = BASE.slice(0, idx + "/upload/".length);
  _folder = BASE.slice(_prefix.length);
}

/**
 * Returns an optimised Cloudinary URL for the given asset path.
 *
 * Transformations applied automatically:
 *   f_auto  – serves WebP/AVIF to browsers that support it; JPEG/PNG otherwise
 *   q_auto  – Cloudinary picks the best quality/size tradeoff per image
 *
 * Falls back to the bare local path when the env var is not set (dev without Cloudinary).
 *
 * @param {string} path  e.g. "/hero/1.jpg"
 * @returns {string}
 */
export const img = (path) =>
  BASE ? `${_prefix}f_auto,q_auto/${_folder}${path}` : path;

/**
 * Tiny neutral-gray SVG encoded as a data URI.
 * Use as `blurDataURL` on next/image for a smooth fade-in instead of a
 * jarring pop when images are lazy-loaded over slow connections.
 *
 * Usage:
 *   import { BLUR_DATA_URL } from "@/lib/cloudinary";
 *   <Image … placeholder="blur" blurDataURL={BLUR_DATA_URL} />
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEwIDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjgiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=";
