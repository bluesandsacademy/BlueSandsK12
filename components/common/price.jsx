"use client";

import { useCurrency } from "./currency-provider";
import { FALLBACK_USD_NGN } from "@/lib/exchange-rate";

// NGN authored price → string in the visitor's selected currency.
// Naira is exact (it is what Paystack charges); dollars are a live estimate.
export function formatPrice(ngn, currency, rate) {
  const n = Number(ngn) || 0;
  if (currency === "USD") {
    const usd = Math.round(n / (Number(rate) || FALLBACK_USD_NGN));
    return `≈$${usd.toLocaleString("en-US")}`;
  }
  return `₦${n.toLocaleString("en-NG")}`;
}

/* Renders an NGN-authored price in the active currency (NGN or USD). */
export default function Price({ ngn, className }) {
  const { currency, rate } = useCurrency();
  return (
    <span className={className} suppressHydrationWarning>
      {formatPrice(ngn, currency, rate)}
    </span>
  );
}
