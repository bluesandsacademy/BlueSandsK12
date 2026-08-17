// Structured data is what Google and the AI crawlers read. A wrong price or a
// fabricated one is a rich-result violation, so the offer shapes are pinned.
import { describe, it, expect } from "vitest";
import {
  SITE_URL,
  SITE_NAME,
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  productSchema,
  solutionSchema,
  productListSchema,
  productMetaTitle,
  solutionMetaTitle,
} from "@/lib/seo";
import { products } from "@/lib/products";
import { solutions } from "@/lib/solutions";

describe("organization and website schema", () => {
  it("cross-references the organization from the website publisher", () => {
    expect(websiteSchema().publisher["@id"]).toBe(organizationSchema()["@id"]);
  });

  it("names the organization consistently", () => {
    expect(organizationSchema().name).toBe(SITE_NAME);
  });
});

describe("breadcrumbSchema", () => {
  it("numbers positions from 1 and absolutises paths", () => {
    const crumbs = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
    ]);
    expect(crumbs.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(crumbs.itemListElement[1].item).toBe(`${SITE_URL}/products`);
  });
});

describe("productSchema", () => {
  it("returns null for an unknown slug", () => {
    expect(productSchema("no-such-product")).toBeNull();
  });

  it("quotes the product's own naira price", () => {
    for (const p of products) {
      const schema = productSchema(p.slug);
      expect(schema.offers.priceCurrency).toBe("NGN");
      expect(schema.offers.price).toBe(p.priceNGN);
      expect(schema.offers.availability).toBe("https://schema.org/InStock");
    }
  });
});

describe("solutionSchema", () => {
  it("returns null for an unknown slug", () => {
    expect(solutionSchema("no-such-solution")).toBeNull();
  });

  it("publishes no price for a solution that has none", () => {
    const unpriced = solutions.filter((s) => s.price.mode === "coming-soon");
    expect(unpriced.length).toBeGreaterThan(0);
    for (const s of unpriced) {
      const offer = solutionSchema(s.slug).offers;
      expect(offer.availability).toBe("https://schema.org/PreOrder");
      expect(offer.price).toBeUndefined();
      expect(offer.priceCurrency).toBeUndefined();
    }
  });

  it("quotes subscription tiers in USD as a price range", () => {
    const subs = solutions.filter((s) => s.price.mode === "subscription");
    expect(subs.length).toBeGreaterThan(0);
    for (const s of subs) {
      const offer = solutionSchema(s.slug).offers;
      expect(offer["@type"]).toBe("AggregateOffer");
      expect(offer.priceCurrency).toBe("USD");
      expect(offer.lowPrice).toBe(Math.min(...s.price.tiers.map((t) => t.usd)));
      expect(offer.highPrice).toBe(Math.max(...s.price.tiers.map((t) => t.usd)));
      expect(offer.offerCount).toBe(s.price.tiers.length);
    }
  });
});

describe("productListSchema", () => {
  it("lists every product and solution exactly once, in order", () => {
    const list = productListSchema().itemListElement;
    expect(list).toHaveLength(products.length + solutions.length);
    expect(list.map((i) => i.position)).toEqual(
      list.map((_, i) => i + 1),
    );
    const urls = list.map((i) => i.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const p of [...products, ...solutions]) {
      expect(urls).toContain(`${SITE_URL}/products/${p.slug}`);
    }
  });
});

describe("meta titles", () => {
  it("prices product titles in naira", () => {
    const p = products[0];
    expect(productMetaTitle(p)).toContain("₦");
    expect(productMetaTitle(p)).toContain(p.name);
  });

  it("states positioning instead of a price when there is no figure", () => {
    for (const s of solutions) {
      const title = solutionMetaTitle(s);
      expect(title).toContain(s.name);
      if (s.price.mode === "subscription") {
        const mainTier =
          s.price.tiers.find((t) => t.key === "with-tablet") ??
          s.price.tiers[0];
        expect(title).toContain(`$${mainTier.usd}`);
      } else {
        expect(title).not.toContain("$");
      }
    }
  });
});
