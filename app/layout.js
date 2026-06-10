import "./globals.css";
import { Fredoka, Nunito } from "next/font/google";

// Display: chunky, rounded, playful — used for headings & big friendly text.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

// Body: rounded, warm, highly legible — used for paragraphs & UI text.
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://k12.bluesandstemlabs.com";
const SITE_NAME = "Blue Sands K12 AR Pedia";
const SITE_DESCRIPTION =
  "Interactive AR-powered science learning devices for K12 schools and families across Nigeria. Preorder the Smart Family STEM Pack or Smart Classroom Starter today.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "K12 AR Pedia", "augmented reality education", "STEM learning Nigeria",
    "AR science experiments", "Blue Sands STEM Labs", "smart classroom",
    "interactive science", "K12 devices Nigeria",
  ],
  authors: [{ name: "Blue Sands STEM Labs", url: SITE_URL }],
  creator: "Blue Sands STEM Labs",
  publisher: "Blue Sands STEM Labs",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@bluesandsstem",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
