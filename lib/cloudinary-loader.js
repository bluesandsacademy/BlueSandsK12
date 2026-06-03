/**
 * Custom Next.js image loader for Cloudinary.
 *
 * How it works
 * ────────────
 * When Next.js renders an <Image>, it calls this function for every breakpoint
 * in its srcset (e.g. 480w, 640w, 1080w, …). We return a Cloudinary
 * transformation URL that already contains the right width — so the browser
 * fetches directly from the Cloudinary CDN with no /_next/image proxy in between.
 *
 * This eliminates the timeout issue: previously Next.js was fetching each image
 * from Cloudinary, re-compressing it, then serving it — two network hops on the
 * server side. Now the browser hits Cloudinary directly, one hop, edge-cached.
 *
 * URL anatomy
 * ───────────
 * img() in lib/cloudinary.js already produces:
 *   https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/bls/<path>
 *
 * This loader injects w_<width> into that transformation chain, giving:
 *   https://res.cloudinary.com/<cloud>/image/upload/w_640,f_auto,q_auto/bls/<path>
 *
 * Cloudinary then serves the image at the exact requested width in the best
 * format the browser supports (AVIF → WebP → original), edge-cached globally.
 */

export default function cloudinaryLoader({ src, width }) {
  // Local dev: NEXT_PUBLIC_CLOUDINARY_BASE_URL is not set, so img() returns
  // a bare path like "/hero/1.jpg". Pass it through unchanged.
  if (!src.startsWith("http")) {
    return src;
  }

  // src already contains our f_auto,q_auto transform — inject the width.
  // c_limit: only downscale — never upscale beyond the image's natural dimensions.
  // Without this, requesting w_1920 on a 600px image would produce a blurry
  // upscaled file larger than the original. c_limit tells Cloudinary to cap at
  // the natural width silently.
  if (src.includes("f_auto,q_auto")) {
    return src.replace("f_auto,q_auto", `w_${width},c_limit,f_auto,q_auto`);
  }

  // Fallback for any bare Cloudinary URL that slipped through without transforms.
  if (src.includes("/upload/")) {
    return src.replace("/upload/", `/upload/w_${width},c_limit,f_auto,q_auto/`);
  }

  // Not a URL we recognise — return unchanged.
  return src;
}
