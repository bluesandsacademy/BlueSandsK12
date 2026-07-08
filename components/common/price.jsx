"use client";

import { useCurrency } from "./currency-provider";

// USD authored price → string in the visitor's selected currency.
export function formatPrice(usd, currency, rate) {
  const n = Number(usd) || 0;
  if (currency === "NGN") {
    const ngn = Math.round((n * rate) / 100) * 100; // round to nearest ₦100
    return `₦${ngn.toLocaleString("en-NG")}`;
  }
  return `$${n.toLocaleString("en-US")}`;
}

/* Renders a USD-authored price in the active currency (NGN or USD). */
export default function Price({ usd, className }) {
  const { currency, rate } = useCurrency();
  return (
    <span className={className} suppressHydrationWarning>
      {formatPrice(usd, currency, rate)}
    </span>
  );
}
