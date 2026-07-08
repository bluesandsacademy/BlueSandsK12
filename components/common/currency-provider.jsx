"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { FALLBACK_USD_NGN } from "@/lib/exchange-rate";

const CurrencyContext = createContext(null);
const STORAGE_KEY = "bls-currency";
const DEFAULT_CURRENCY = "NGN"; // payments settle in Naira

export function CurrencyProvider({ initialRate = FALLBACK_USD_NGN, children }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const rate = initialRate; // USD → NGN, fetched server-side

  // Restore the visitor's saved choice after mount. Reading localStorage must
  // happen client-side, so a one-time sync here is intentional (and avoids the
  // hydration mismatch a lazy initializer would cause).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "USD" || saved === "NGN") setCurrencyState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrency = (c) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  };

  const toggle = () => setCurrency(currency === "NGN" ? "USD" : "NGN");

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggle, rate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Falls back to USD if used outside a provider (e.g. admin pages).
export function useCurrency() {
  return (
    useContext(CurrencyContext) ?? {
      currency: "USD",
      rate: FALLBACK_USD_NGN,
      setCurrency() {},
      toggle() {},
    }
  );
}
