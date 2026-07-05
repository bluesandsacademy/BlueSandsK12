/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF first (smaller than WebP on phones), fall back to WebP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
