"use client";

import { useCurrency } from "./currency-provider";
import { FALLBACK_USD_NGN } from "@/lib/exchange-rate";

// Both prices are authored and fixed (see lib/products.js): USD is the clean
// headline number, NGN is exactly what Paystack charges. When a USD figure is
// provided we show it as-is; when it is missing (a computed/legacy value) we
// fall back to a live-rate estimate so nothing renders blank.
export function formatPrice(ngn, currency, rate, usd) {
  if (currency === "USD") {
    if (usd != null) return `$${Number(usd).toLocaleString("en-US")}`;
    const est = Math.round((Number(ngn) || 0) / (Number(rate) || FALLBACK_USD_NGN));
    return `≈$${est.toLocaleString("en-US")}`;
  }
  return `₦${(Number(ngn) || 0).toLocaleString("en-NG")}`;
}

/* Renders a price in the active currency. Pass the authored `usd` for a fixed
   dollar figure; omit it and USD falls back to a live estimate. */
export default function Price({ ngn, usd, className }) {
  const { currency, rate } = useCurrency();
  return (
    <span className={className} suppressHydrationWarning>
      {formatPrice(ngn, currency, rate, usd)}
    </span>
  );
}
