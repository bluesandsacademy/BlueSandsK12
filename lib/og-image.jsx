// Shared Open Graph / Twitter card renderer.
// The route files (app/opengraph-image.js, app/twitter-image.js) declare their
// own static config exports — Next.js parses those at build time and they
// cannot be re-exported — and delegate the actual drawing to this helper.
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT =
  "Blue Sands STEM Labs — Immersive AR-powered STEM learning";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #02345a 0%, #0483e2 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            opacity: 0.95,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#FFC83D",
            }}
          />
          {SITE_NAME}
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 920,
            letterSpacing: "-2px",
          }}
        >
          {SITE_TAGLINE}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            fontWeight: 500,
            color: "#dbeafe",
            maxWidth: 900,
          }}
        >
          AR headsets, smart boards, lab kits & learning tablets for K–12 across
          Nigeria.
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
