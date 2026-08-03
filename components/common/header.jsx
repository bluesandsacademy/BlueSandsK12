"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Package,
  House,
  Handshake,
  HeartHandshake,
  Mail,
  Download,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", Icon: House },
  { name: "Shop", href: "/products", Icon: ShoppingBag },
  { name: "Partnership", href: "/partnership", Icon: Handshake },
  { name: "Social Impact", href: "/social-impact", Icon: HeartHandshake },
  { name: "Track Order", href: "/track", Icon: Package },
  { name: "Contact", href: "/contact", Icon: Mail },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Ignore tiny jitters; always show near the top
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 80);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* The header used to sit under a 4px `border-sunshine/50` rule. Against a
       cream bar and the sky-tinted top of most heroes that put three hues
       (warm cream, saturated yellow, cool blue) into four pixels, and the rule
       was the most saturated thing in the header while meaning nothing. It is
       gone. The boundary is now drawn only once there is content to separate
       from: at rest the bar merges into the page, and on scroll it earns a
       hairline and a soft lift. The background stays opaque rather than
       transparent because /social-impact opens on a navy hero, where navy nav
       text would disappear. */
    <header
      className={`sticky top-0 z-50 bg-cream/95 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 border-b ${
        scrolled
          ? "border-secondary/10 shadow-[0_6px_20px_-12px_rgba(2,52,90,0.35)]"
          : "border-transparent"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="page-frame h-20 sm:h-24 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          onClick={closeMenu}
        >
          <Image
            src="/brand/k12-logo-blue.png"
            width={967}
            height={1048}
            alt="Blue Sands K12"
            className="h-14 w-auto sm:h-24"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-secondary hover:text-primary hover:bg-white rounded-full transition-colors whitespace-nowrap"
              >
                <link.Icon className="w-4 h-4" strokeWidth={2.5} />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/brochure.pdf"
            download
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-coral text-white text-sm font-display font-bold rounded-full shadow-[0_5px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_2px_0_#d63a3f] transition-all"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            Download Brochure
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen((p) => !p)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="md:hidden w-10 h-10 rounded-full bg-white border-2 border-secondary/12 flex items-center justify-center text-secondary hover:text-primary transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" strokeWidth={2.5} />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={2.5} />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-secondary/10 bg-cream">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center gap-2.5 px-3 py-3 text-base font-bold text-secondary hover:bg-white hover:text-primary rounded-xl transition-colors"
              >
                <link.Icon className="w-5 h-5" strokeWidth={2.5} />
                {link.name}
              </Link>
            ))}
            <Link
              href="/brochure.pdf"
              download
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 mt-2 px-5 py-3 bg-coral text-white text-center font-display font-bold rounded-xl shadow-[0_5px_0_#d63a3f]"
            >
              <Download className="w-5 h-5" strokeWidth={2.5} />
              Download Brochure
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
