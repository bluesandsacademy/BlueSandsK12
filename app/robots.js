import { SITE_URL } from "@/lib/seo";

export default function robots() {
  // A single wildcard rule that allows every well-behaved crawler — including
  // AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) —
  // to index the public site, while keeping admin/API/dev paths private.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/dev/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
