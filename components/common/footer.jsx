import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/cloudinary";
import { legalLinks } from "@/lib/legal";

// Brand glyphs as inline SVGs — lucide-react dropped its brand icon set.
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 2.76a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 1.62a3.68 3.68 0 1 0 0 7.36 3.68 3.68 0 0 0 0-7.36Zm5.5-2.9a1.24 1.24 0 1 1 0 2.48 1.24 1.24 0 0 1 0-2.48Z" />
  </svg>
);
const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
const Twitter = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z" />
  </svg>
);

// The legal pack, ordered by lib/legal.js, plus Contact.
const quickLinks = [...legalLinks, { name: "Contact", href: "/contact" }];

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/bluesandstemlabs",
    Icon: Instagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/bluesandstemlabs",
    Icon: Linkedin,
  },
  { name: "X", href: "https://x.com/bluesandstem", Icon: Twitter },
];

export default function Footer() {
  return (
    // `id` is the hook WhatsAppFab observes so it can retract instead of
    // covering the footer's links and social icons.
    <footer id="site-footer" className="relative bg-secondary text-white overflow-hidden">
      {/* Playful wave top edge */}
      <div className="absolute top-0 left-0 right-0 leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 40 }}
        >
          <path
            fill="#FFFBF0"
            d="M0,0 C240,50 480,50 720,25 C960,0 1200,0 1440,30 L1440,0 Z"
          />
        </svg>
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Logo + copyright */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Link href="/" className="inline-flex shrink-0">
            <Image
              src={img("/logo-white.png")}
              width={160}
              height={56}
              alt="Blue Sands STEM Labs"
              className="h-10 w-auto"
            />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs text-white/50 font-semibold text-center sm:text-left">
            © {new Date().getFullYear()} Blue Sands STEM Labs · Revolutionizing
            STEM learning with AR across Nigeria
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-full bg-white/10 text-sm font-bold text-white/80 hover:bg-white/20 hover:text-white transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-2.5">
          {socials.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-sunshine hover:text-secondary transition-colors"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
