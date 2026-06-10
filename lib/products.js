// Shared product catalogue for the Blue Sands AR Media shop.
// Prices come from the marketing copy (USD); NGN is derived at the same
// ₦1,400 / $1 rate used across the rest of the site (₦210,000 ÷ $150).
import {
  Glasses,
  Monitor,
  FlaskConical,
  Tablet,
  ShoppingCart,
  CreditCard,
  Truck,
  Sparkles,
} from "lucide-react";

const NGN_RATE = 1400;

function withNGN(p) {
  return {
    ...p,
    priceNGN: p.priceUSD * NGN_RATE,
    depositNGN: p.depositUSD * NGN_RATE,
  };
}

export const products = [
  {
    slug: "ar-vision-headset",
    name: "Blue Sands AR Vision Headset",
    Icon: Glasses,
    tagline: "Step inside science with immersive AR.",
    blurb:
      "An immersive augmented reality headset that brings science, engineering, and digital simulations to life right in the classroom.",
    description:
      "The AR Vision Headset turns any lesson into a hands-on adventure. Students slip it on and suddenly the solar system, the human heart, or a working engine is floating right in front of them — spinnable, explorable, and unforgettable. Built light enough for little heads and tough enough for busy classrooms, it supports every STEM subject out of the box.",
    features: [
      "Interactive 3D STEM simulations",
      "Real-time visual learning experiences",
      "Lightweight classroom-ready design",
      "Multi-subject educational support",
    ],
    priceUSD: 1500,
    depositUSD: 450,
    color: "#9B5DE5",
    gradient: "linear-gradient(160deg,#9B5DE5,#6d28d9)",
  },
  {
    slug: "smart-interactive-board",
    name: "Blue Sands Smart Interactive Board",
    Icon: Monitor,
    tagline: "Lessons everyone can touch, draw, and share.",
    blurb:
      "A collaborative smart classroom display that transforms ordinary lessons into engaging, visual experiences for the whole class.",
    description:
      "The Smart Interactive Board is the heart of a modern classroom. Teachers and students draw, drag, and explore together on a giant multi-touch screen, with live annotations everyone can see. It plugs straight into your AR lessons and works beautifully for both in-room and hybrid teaching.",
    features: [
      "Multi-touch interactive display",
      "Live annotations and collaboration",
      "AR-compatible classroom integration",
      "Optimized for hybrid and physical classrooms",
    ],
    priceUSD: 3200,
    depositUSD: 960,
    color: "#0483e2",
    gradient: "linear-gradient(160deg,#0483e2,#02345a)",
  },
  {
    slug: "stem-lab-kit",
    name: "Blue Sands STEM Lab Kit",
    Icon: FlaskConical,
    tagline: "Real experiments, supercharged with AR.",
    blurb:
      "A hands-on immersive STEM toolkit that combines physical experiments with digital augmented learning.",
    description:
      "The STEM Lab Kit blends real, tactile experiments with AR overlays that explain exactly what's happening as it happens. Mix, build, and observe — then point a device to see the science behind it. Curriculum-aligned modules make it a perfect fit for school laboratories and after-school STEM clubs.",
    features: [
      "Experiment-based STEM learning",
      "AR-enhanced practical activities",
      "Curriculum-focused learning modules",
      "Ideal for school laboratories and STEM clubs",
    ],
    priceUSD: 850,
    depositUSD: 255,
    color: "#3DD68C",
    gradient: "linear-gradient(160deg,#3DD68C,#0f766e)",
  },
  {
    slug: "immersive-learning-tablet",
    name: "Blue Sands Immersive Learning Tablet",
    Icon: Tablet,
    tagline: "The whole AR Pedia world in little hands.",
    blurb:
      "A powerful learning tablet built for interactive STEM education, AR experiences, and digital classroom engagement.",
    description:
      "The Immersive Learning Tablet is the friendly device children reach for first. It comes preloaded with AR Pedia's immersive apps, survives drops and spills, and keeps working whether or not there's internet. It syncs seamlessly with your school's LMS so progress follows every learner.",
    features: [
      "Preloaded immersive learning apps",
      "Student-friendly durable design",
      "Offline and online learning support",
      "Seamless LMS integration",
    ],
    priceUSD: 600,
    depositUSD: 180,
    color: "#FFC83D",
    gradient: "linear-gradient(160deg,#FFC83D,#f59e0b)",
  },
].map(withNGN);

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

export const fmtUSD = (n) => `$${n.toLocaleString("en-US")}`;
export const fmtNGN = (n) => `₦${n.toLocaleString("en-NG")}`;

// Shared "How Pre-Order Works" steps.
export const preorderSteps = [
  { Icon: ShoppingCart, title: "Choose Your Device", sub: "Pick the perfect kit for your home or school." },
  { Icon: CreditCard, title: "Pay 30% Deposit", sub: "Reserve your slot with a small deposit today." },
  { Icon: Truck, title: "Delivery in August", sub: "We deliver and set everything up for you." },
  { Icon: Sparkles, title: "Transform Learning", sub: "Watch curiosity and STEM scores take off." },
];
