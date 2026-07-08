// Centralised SEO constants + JSON-LD structured-data builders.
// Structured data is what lets Google rich results and AI crawlers
// (ChatGPT, Perplexity, Claude, Gemini) reliably understand the site,
// its organisation, and its products.
import { products, getProduct, fmtNGN } from "@/lib/products";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://k12.bluesandstemlabs.com";
export const SITE_NAME = "Blue Sands STEM Labs";
export const SITE_TAGLINE = "AR books that bring STEM learning to life for K–12";
export const SITE_DESCRIPTION =
  "Augmented-reality books that bring STEM learning to life for children across Nigeria — Into the Community, Into the Curiosity Q, and the 8-book AR Science Lab Kit, read with the Spotty tablet holder.";

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/bluesandstemlabs",
  "https://www.linkedin.com/company/bluesandstemlabs",
  "https://x.com/bluesandstem",
];

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/android-chrome-512x512.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/opengraph-image`,
    description: SITE_DESCRIPTION,
    sameAs: SOCIAL_PROFILES,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Greenland Estate, Sangotedo",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-NG",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function productSchema(slug) {
  const p = getProduct(slug);
  if (!p) return null;
  // Preorder window closes at the end of the launch year.
  const priceValidUntil = `${new Date().getFullYear()}-12-31`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/products/${p.slug}#product`,
    name: p.name,
    description: p.description,
    image: `${SITE_URL}/opengraph-image`,
    category: "Educational Technology",
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${p.slug}`,
      priceCurrency: "NGN",
      price: p.priceNGN,
      priceValidUntil,
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
  };
}

// ItemList of every product — helps the shop page surface the full catalogue.
export function productListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blue Sands AR Media Shop",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/products/${p.slug}`,
      name: p.name,
    })),
  };
}

// Convenience for titles, e.g. "AR Science Lab Kit — from ₦620,000".
export const productMetaTitle = (p) => `${p.name} — from ${fmtNGN(p.priceNGN)}`;
