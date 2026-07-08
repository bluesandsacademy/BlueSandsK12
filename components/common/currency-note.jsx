"use client";

import { useCurrency } from "./currency-provider";
import CurrencySwitcher from "./currency-switcher";

/*
 * The currency toggle placed at the point of decision: right above a price
 * grid, rather than only in the header where it scrolls out of view. Shares
 * state with the header switcher through CurrencyProvider.
 *
 * Payments settle in Naira, so the dollar figure is an estimate. Say so here
 * instead of leaving the visitor to discover it at Paystack's checkout.
 */
export default function CurrencyNote({ align = "center", className = "" }) {
  const { currency } = useCurrency();
  const alignment = align === "left" ? "items-start" : "items-center";

  return (
    <div className={`flex flex-col gap-2 ${alignment} ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
          Showing prices in
        </span>
        <CurrencySwitcher />
      </div>
      <p
        className="text-xs font-semibold text-gray-400 h-4"
        suppressHydrationWarning
      >
        {currency === "USD"
          ? "Estimate only. You will be charged in Naira at checkout."
          : " "}
      </p>
    </div>
  );
}
