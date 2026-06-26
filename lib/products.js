// Real ARpedia catalogue (content sourced from arpediabook.com). Selling is
// handled on the Paystack storefront; these pages are the showcase. Prices are
// in USD. priceUSD on each product is the "from" price (cheapest Spotty option).
import { Tablet, BookOpen, ScanLine, Wand2 } from "lucide-react";

const NGN_RATE = 1400;

// Set this to your Paystack storefront URL (or NEXT_PUBLIC_STORE_URL) once live.
export const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || "";

function withNGN(p) {
  return { ...p, priceNGN: p.priceUSD * NGN_RATE };
}

// Every AR book is read through "Spotty" — the giraffe-shaped holder that props
// your tablet over the page so the augmented reality comes to life. Each title
// comes in two editions: Mirror and Camera.
export const products = [
  {
    slug: "into-the-community",
    name: "Into the Community",
    image: "/products/into-the-community.png",
    imageW: 605,
    imageH: 561,
    ageRange: "Ages 4–7",
    optionLabel: "Spotty",
    tagline: "Your community comes alive in an AR book.",
    blurb: "Five vivid AR stories about the places we live in.",
    description:
      "Learn about your community! Point a tablet at the page and the people and places of the neighbourhood come to life. Five vivid reading experiences help the youngest readers explore the world around them — the shops, the helpers, and the streets they know.",
    features: [
      "5 AR stories about the community",
      "Designed for ages 4–7",
      "Vivid, read-along experiences",
      "Read with the Spotty tablet holder",
    ],
    variants: [
      { label: "Mirror", priceUSD: 78 },
      { label: "Camera", priceUSD: 154 },
    ],
    priceUSD: 78,
    color: "#FF5A5F",
  },
  {
    slug: "into-the-curiosity-q",
    name: "Into the Curiosity Q",
    image: "/products/into-the-curiosity-q.png",
    imageW: 629,
    imageH: 605,
    ageRange: "Ages 5–9",
    optionLabel: "Spotty",
    tagline: "A realistic exploration of universal knowledge.",
    blurb: "Vivid virtual experiences that make big ideas click.",
    description:
      "For curious 5–9 year-olds. Through vivid virtual experiences, readers explore a wide variety of universal knowledge — turning the everyday questions children ask into discoveries they can see, touch and interact with in augmented reality.",
    features: [
      "Explore universal knowledge in AR",
      "Designed for ages 5–9",
      "Interactive virtual experiences",
      "Read with the Spotty tablet holder",
    ],
    variants: [
      { label: "Mirror", priceUSD: 109 },
      { label: "Camera", priceUSD: 198 },
    ],
    priceUSD: 109,
    color: "#9B5DE5",
  },
  {
    slug: "ar-science-lab-full-kit",
    name: "AR Science Lab Kit",
    image: "/products/ar-science-lab-full-kit.png",
    imageW: 628,
    imageH: 536,
    ageRange: "Ages 8–13",
    optionLabel: "Spotty",
    tagline: "130 hands-on STEM experiments, powered by AR.",
    blurb: "An 8-book AR science series across four subjects.",
    description:
      "The full AR Science Lab — eight books and 130 experiments spanning biology, chemistry, physics and Earth science. Children scan paper markers to run experiments, build molecules, and even meet famous scientists like Einstein. Blank markers can be copied for unlimited use at home or in the classroom.",
    features: [
      "8-book AR Science Lab series",
      "130 hands-on STEM experiments",
      "Biology, chemistry, physics & Earth science",
      "Reusable, printable markers",
    ],
    included: [
      "Biology 1 — Animals & Plants",
      "Biology 2 — Humans & the Environment",
      "Chemistry 1 — Properties of Matter",
      "Chemistry 2 — Changes in Matter",
      "Physics 1 — Forces & Energy",
      "Physics 2 — Light & Waves",
      "Earth Science 1 — The Earth",
      "Earth Science 2 — The Universe",
    ],
    variants: [
      { label: "Mirror", priceUSD: 109 },
      { label: "Camera", priceUSD: 198 },
    ],
    priceUSD: 109,
    color: "#0483e2",
  },
].map(withNGN);

export function getProduct(slug) {
  return products.find((p) => p.slug === slug) || null;
}

// How an AR book actually works — replaces the old "how pre-order works".
export const howItWorks = [
  { Icon: Tablet,   title: "Pop in your tablet", sub: "Slot your tablet into Spotty, the giraffe-shaped holder." },
  { Icon: BookOpen, title: "Open any AR book",  sub: "Turn to any page in the book or science series." },
  { Icon: ScanLine, title: "Scan the page",     sub: "Spotty lines the camera up over the markers for you." },
  { Icon: Wand2,    title: "Watch it come alive", sub: "Animals, planets and experiments leap off the page in 3D." },
];

export const fmtUSD = (n) => `$${Number(n).toLocaleString("en-US")}`;
export const fmtNGN = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
