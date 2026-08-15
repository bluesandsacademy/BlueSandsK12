// Guards the catalogue invariants that have actually drifted before: prices
// authored in two places, and slugs shared between products and solutions.
import { describe, it, expect } from "vitest";
import {
  products,
  getProduct,
  PACKAGE_PRICES_NGN,
  PACKAGE_PRICES_USD,
  PAYSTACK_MODE,
  STORE_URL,
  buyUrl,
  fmtNGN,
  fmtUSD,
  TABLET,
  TABLET_NGN,
  TABLET_USD,
} from "@/lib/products";
import { solutions, getSolution, isSolution } from "@/lib/solutions";

describe("products", () => {
  it("has unique slugs", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("prices every product in both currencies from the price maps", () => {
    for (const p of products) {
      expect(PACKAGE_PRICES_NGN).toHaveProperty(p.slug);
      expect(PACKAGE_PRICES_USD).toHaveProperty(p.slug);
      expect(p.priceNGN).toBe(PACKAGE_PRICES_NGN[p.slug]);
      expect(p.priceUSD).toBe(PACKAGE_PRICES_USD[p.slug]);
    }
  });

  it("carries no zero or missing price", () => {
    for (const p of products) {
      expect(typeof p.priceNGN).toBe("number");
      expect(p.priceNGN).toBeGreaterThan(0);
      expect(typeof p.priceUSD).toBe("number");
      expect(p.priceUSD).toBeGreaterThan(0);
    }
  });

  it("leaves no price-map entry pointing at a product that no longer exists", () => {
    const slugs = new Set(products.map((p) => p.slug));
    for (const slug of Object.keys(PACKAGE_PRICES_NGN)) {
      expect(slugs.has(slug)).toBe(true);
    }
    expect(Object.keys(PACKAGE_PRICES_USD).sort()).toEqual(
      Object.keys(PACKAGE_PRICES_NGN).sort(),
    );
  });

  it("resolves every slug and returns null for an unknown one", () => {
    for (const p of products) {
      expect(getProduct(p.slug)).toBe(p);
    }
    expect(getProduct("no-such-product")).toBeNull();
  });

  it("prices the tablet consistently with its own constants", () => {
    expect(TABLET.priceNGN).toBe(TABLET_NGN);
    expect(TABLET.priceUSD).toBe(TABLET_USD);
  });
});

describe("Paystack routing", () => {
  // A missing or forgotten env must never send a real customer to a live charge.
  it("defaults to the test store", () => {
    expect(PAYSTACK_MODE).toBe("test");
  });

  it("routes every buy button to the storefront", () => {
    expect(buyUrl()).toBe(STORE_URL);
    expect(STORE_URL).toMatch(/^https:\/\//);
  });
});

describe("currency formatting", () => {
  it("renders naira and dollars with grouping separators", () => {
    expect(fmtNGN(620_000)).toBe("₦620,000");
    expect(fmtUSD(450)).toBe("$450");
  });
});

describe("solutions", () => {
  it("has unique slugs", () => {
    const slugs = solutions.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  // Products and solutions are both served from /products/[slug]; a shared slug
  // would silently shadow one of the two pages.
  it("never collides with a product slug", () => {
    const productSlugs = new Set(products.map((p) => p.slug));
    for (const s of solutions) {
      expect(productSlugs.has(s.slug)).toBe(false);
      expect(isSolution(s.slug)).toBe(true);
    }
    for (const p of products) {
      expect(isSolution(p.slug)).toBe(false);
    }
  });

  it("uses a known price mode, and quotes tiers only when subscribing", () => {
    for (const s of solutions) {
      expect(["coming-soon", "subscription"]).toContain(s.price.mode);
      if (s.price.mode === "subscription") {
        expect(Array.isArray(s.price.tiers)).toBe(true);
        expect(s.price.tiers.length).toBeGreaterThan(0);
        for (const t of s.price.tiers) {
          expect(typeof t.usd).toBe("number");
          expect(t.usd).toBeGreaterThan(0);
        }
        expect(typeof s.price.renewalUsd).toBe("number");
        expect(s.price.renewalUsd).toBeGreaterThan(0);
      } else {
        expect(s.price.tiers).toBeUndefined();
      }
    }
  });

  it("resolves every slug and returns null for an unknown one", () => {
    for (const s of solutions) {
      expect(getSolution(s.slug)).toBe(s);
    }
    expect(getSolution("no-such-solution")).toBeNull();
  });
});
