// Live USD → NGN rate, fetched from free no-key sources with redundancy.
// Prices across the site are authored in NGN (what Paystack charges); this rate
// only powers the informational "≈$" figure the currency switcher shows, so a
// stale rate can never misprice an order. Refreshed hourly via the fetch cache.

export const FALLBACK_USD_NGN = 1400;

const SOURCES = [
  {
    url: "https://open.er-api.com/v6/latest/USD",
    pick: (d) => d?.rates?.NGN,
  },
  {
    url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    pick: (d) => d?.usd?.ngn,
  },
  {
    url: "https://latest.currency-api.pages.dev/v1/currencies/usd.json",
    pick: (d) => d?.usd?.ngn,
  },
];

export async function getUsdToNgn() {
  for (const src of SOURCES) {
    try {
      const res = await fetch(src.url, {
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 }, // cache 1h; refreshed in the background
      });
      if (!res.ok) continue;
      const data = await res.json();
      const rate = src.pick(data);
      if (typeof rate === "number" && rate > 0 && rate < 100000) {
        return { rate, source: src.url };
      }
    } catch {
      // try the next source
    }
  }
  return { rate: FALLBACK_USD_NGN, source: "fallback" };
}
