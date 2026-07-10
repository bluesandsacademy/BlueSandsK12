import { SITE_URL } from "@/lib/seo";
import { products } from "@/lib/products";
import { legalDocs } from "@/lib/legal";

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/preorder`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/webinar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/partnership`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/apply`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/social-impact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/track`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const legalRoutes = legalDocs.map((d) => ({
    url: `${SITE_URL}/legal/${d.slug}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...productRoutes, ...legalRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}
