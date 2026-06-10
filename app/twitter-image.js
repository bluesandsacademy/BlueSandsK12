import { renderOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const alt = "Blue Sands STEM Labs — Immersive AR-powered STEM learning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
