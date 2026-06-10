import { SITE_URL } from "@/lib/seo";
import { products } from "@/lib/products";

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/preorder`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/apply`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/track`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/pay-balance`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}
