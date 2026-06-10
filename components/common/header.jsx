"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  Package,
  House,
  CreditCard,
  Rocket,
} from "lucide-react";
import { img } from "@/lib/cloudinary";

const navLinks = [
  { name: "Home", href: "/", Icon: House },
  { name: "Shop", href: "/products", Icon: ShoppingBag },
  { name: "Track Order", href: "/track", Icon: Package },
  { name: "Pay Balance", href: "/pay-balance", Icon: CreditCard },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

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
      // Ignore tiny jitters; always show near the top
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 80);
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b-4 border-sunshine/50 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          onClick={closeMenu}
        >
          <Image
            src={img("/logo.png")}
            width={140}
            height={50}
            alt="Blue Sands STEM Labs"
            className="h-7 sm:h-9 w-auto"
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
        <div className="hidden md:flex items-center">
          <Link
            href="/preorder"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-coral text-white text-sm font-display font-bold rounded-full shadow-[0_5px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_2px_0_#d63a3f] transition-all"
          >
            <Rocket className="w-4 h-4" strokeWidth={2.5} />
            Preorder Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen((p) => !p)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="md:hidden w-10 h-10 rounded-full bg-white border-2 border-sunshine/50 flex items-center justify-center text-secondary hover:text-primary transition-colors"
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
        <div className="md:hidden border-t-2 border-sunshine/40 bg-cream">
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
              href="/preorder"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 mt-2 px-5 py-3 bg-coral text-white text-center font-display font-bold rounded-xl shadow-[0_5px_0_#d63a3f]"
            >
              <Rocket className="w-5 h-5" strokeWidth={2.5} />
              Preorder Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
