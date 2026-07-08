"use client";

import { useCurrency } from "./currency-provider";

const OPTIONS = [
  { code: "NGN", label: "₦" },
  { code: "USD", label: "$" },
];

/* Compact NGN / USD toggle. */
export default function CurrencySwitcher({ className = "" }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <div
      className={`inline-flex items-center rounded-full border-2 border-secondary/10 bg-white p-0.5 ${className}`}
      role="group"
      aria-label="Display currency"
    >
      {OPTIONS.map(({ code, label }) => {
        const active = currency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
              active
                ? "bg-primary text-white shadow-sm"
                : "text-secondary/60 hover:text-secondary"
            }`}
          >
            <span className="text-sm leading-none">{label}</span>
            {code}
          </button>
        );
      })}
    </div>
  );
}
