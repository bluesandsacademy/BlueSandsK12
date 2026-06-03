const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://k12.bluesandstemlabs.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/dev/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
