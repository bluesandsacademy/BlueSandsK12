// Real ARpedia catalogue (content sourced from arpediabook.com). Selling is
// handled on the Paystack storefront; these pages are the showcase. Prices are
// authored in NGN — the currency Paystack charges in — so the number shown on
// the site always matches the number at checkout. The USD figure the currency
// switcher displays is a live-converted estimate, never a price we charge.
import {
  Smartphone,
  BookOpen,
  ScanLine,
  ScanEye,
  Boxes,
  Hand,
  Trophy,
} from "lucide-react";

// ── Paystack environment switch ───────────────────────────────────────────
// One env var flips EVERY buy button (and the preorder redirect) between the
// test and live Paystack store, so switching is a one-line change.
//
//   NEXT_PUBLIC_PAYSTACK_MODE = "live"  → real store, real charges
//                             = "test"  → test store, test cards only
//
// Defaults to "test" on purpose: a missing or forgotten env can never send a
// real customer to a live charge by accident. Set it to "live" in production.
export const PAYSTACK_MODE =
  process.env.NEXT_PUBLIC_PAYSTACK_MODE === "live" ? "live" : "test";

// The hosted storefront page, per environment. Every buy button points here so
// a customer can put a kit AND the optional tablet in ONE cart and check out
// once — Paystack buy links are single-product and can't do that. The store
// lists all products on one page, so landing on its home is a fine entry.
const STORE_URLS = {
  live: "https://paystack.shop/bluesandsk12",
  test: "https://paystack.shop/bluesandsk13",
};
export const STORE_URL =
  process.env.NEXT_PUBLIC_STORE_URL || STORE_URLS[PAYSTACK_MODE];

// Every product's buy button routes to the storefront (see above). The arg is
// kept for call-site symmetry and in case we later deep-link per product.
export function buyUrl() {
  return STORE_URL;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING — the single place to edit prices. Authored in NGN so these match the
// Paystack storefront exactly; every page + the preorder flow reads from here.
// These do NOT need touching when the naira moves: only the informational "$"
// estimate shifts with the live rate. Change a number here only when you decide
// to reprice, and mirror it in the Paystack product.
// The tablet is NOT part of any kit; it is an optional add-on.
// NOTE: to make these editable from the admin dashboard, move them to a
// Supabase `pricing` table and read it here (see PENDING: admin pricing).
// ─────────────────────────────────────────────────────────────────────────────
export const TABLET_NGN = 70_000; // optional add-on — a tablet is not included in any kit
export const PACKAGE_PRICES_NGN = {
  "into-the-community": 345_000,
  "into-the-curiosity-q": 480_000,
  "ar-science-lab-full-kit": 620_000,
};

// The tablet is its own Paystack product, added to the cart on the storefront
// alongside a kit (a kit never includes one). It lives in the same store as the
// kits, so the buy buttons that route to STORE_URL already reach it — no
// separate link is wired. Direct buy links kept here for reference only.
export const TABLET = {
  name: "Smart Tablet",
  priceNGN: TABLET_NGN,
  // Reference only (not wired): direct single-product checkout links.
  buyLinks: {
    live: "", // the LIVE smart-tablet buy link, if ever needed
    test: "https://paystack.com/buy/smart-tablet-sqkaas",
  },
};

// Every kit ships with the same holder, markers + app; only the books differ.
// The book line is prepended per product in `package`. A tablet is NOT
// included — Spotty holds the reader's own tablet.
const baseKit = [
  { name: "Spotty Camera", detail: "Smart holder for your own tablet" },
  {
    name: "Marker Set",
    detail: "Tools to facilitate the interactive activities in the book",
  },
  {
    name: "AR Pedia App",
    detail: "Downloadable on Google Play or the App Store",
  },
];

// NOTE: `buyLinks` (per-product, per-env direct checkout links) are kept for
// reference and are NOT currently wired — buy buttons route to the storefront
// (STORE_URL) so a kit + tablet can share one cart. See `buyUrl()` above.
export const products = [
  {
    slug: "into-the-community",
    name: "Into the Community",
    image: "/products/into-the-community.png",
    buyLinks: {
      live: "https://paystack.com/buy/into-the-community-tmbuhd",
      test: "https://paystack.com/buy/into-the-community-arubdb",
    },
    imageW: 605,
    imageH: 561,
    ageRange: "Ages 4–7",
    tagline: "Your community comes alive in an AR book.",
    blurb: "Five vivid AR stories about the places we live in.",
    description:
      "Discover the world around you! Simply point a smartphone or tablet at the page and watch your community come to life in Augmented Reality. Interactive 3D animations, sounds, and engaging experiences help young learners explore the people, places, and everyday environments that shape their lives, making learning more immersive, memorable, and fun.",
    features: [
      "5 Interactive Books with AR Content",
      "Designed for ages 4–7",
      "Vivid, read-along experiences",
      "Works with any tablet (not included)",
    ],
    package: [
      { name: "AR Books", detail: "5 Interactive Paper Books with AR Content" },
      ...baseKit,
    ],
    priceNGN: PACKAGE_PRICES_NGN["into-the-community"],
    color: "#FF5A5F",
  },
  {
    slug: "into-the-curiosity-q",
    name: "Into the Curiosity Q",
    image: "/products/into-the-curiosity-q.png",
    buyLinks: {
      live: "https://paystack.com/buy/into-the-curiosity-q-fvsnti",
      test: "https://paystack.com/buy/into-the-curiosity-q-dnflkd",
    },
    imageW: 629,
    imageH: 605,
    ageRange: "Ages 5–9",
    tagline: "A realistic exploration of universal knowledge.",
    blurb: "Vivid virtual experiences that make big ideas click.",
    description:
      "For curious 5–9 year-olds. Through vivid virtual experiences, readers explore a wide variety of universal knowledge, turning the everyday questions children ask into discoveries they can see, touch and interact with in augmented reality.",
    features: [
      "10 interactive AR books",
      "Explore universal knowledge",
      "Designed for ages 5–9",
      "Works with any tablet (not included)",
    ],
    package: [
      {
        name: "AR Books",
        detail: "10 Interactive Paper Books with AR Content",
      },
      ...baseKit,
    ],
    priceNGN: PACKAGE_PRICES_NGN["into-the-curiosity-q"],
    color: "#9B5DE5",
  },
  {
    slug: "ar-science-lab-full-kit",
    name: "STEM Tutoring Educational Toys for 8–13 year olds",
    image: "/products/ar-science-lab-full-kit.png",
    buyLinks: {
      live: "https://paystack.com/buy/stem-tutoring-educational-toys-for-813-year-olds-curvud",
      test: "https://paystack.com/buy/stem-tutoring-educational-toys-for-813-year-olds-ywkyce",
    },
    imageW: 628,
    imageH: 536,
    ageRange: "Ages 8–13",
    tagline: "130 hands-on STEM experiments, powered by AR.",
    blurb: "An 8-book AR science series across four subjects.",
    description:
      "The full AR Science Lab, eight books and 130 experiments spanning biology, chemistry, physics and Earth science. Children scan paper markers to run experiments, build molecules, and even meet famous scientists like Einstein. Blank markers can be copied for unlimited use at home or in the classroom.",
    features: [
      "8-book AR Science series",
      "130 hands-on STEM experiments",
      "Biology, chemistry, physics & Earth science",
      "Works with any tablet (not included)",
    ],
    package: [
      {
        name: "Science AR Books",
        detail: "8 Interactive Paper Books with AR Content",
      },
      ...baseKit,
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
    priceNGN: PACKAGE_PRICES_NGN["ar-science-lab-full-kit"],
    color: "#0483e2",
  },
];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug) || null;
}

// How ARpedia actually works, from opening the app to earning badges.
export const howItWorks = [
  {
    Icon: Smartphone,
    title: "Open the app",
    sub: "Launch ARpedia on your smartphone or tablet.",
  },
  {
    Icon: BookOpen,
    title: "Choose a topic",
    sub: "Pick a subject, like the Solar System, animals, the human body or dinosaurs.",
  },
  {
    Icon: ScanLine,
    title: "Scan the page",
    sub: "Point your camera at a compatible ARpedia page or marker.",
  },
  {
    Icon: ScanEye,
    title: "Recognize the content",
    sub: "The app detects the page and loads the matching 3D content.",
  },
  {
    Icon: Boxes,
    title: "View & interact in AR",
    sub: "A 3D model appears with animations, labels and narration.",
  },
  {
    Icon: Hand,
    title: "Learn by exploring",
    sub: "Rotate, zoom, tap objects or watch animations to understand the topic.",
  },
  {
    Icon: Trophy,
    title: "Test your knowledge",
    sub: "Take a short quiz, earn points and badges, then move to the next lesson.",
  },
];

export const fmtUSD = (n) => `$${Number(n).toLocaleString("en-US")}`;
export const fmtNGN = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
