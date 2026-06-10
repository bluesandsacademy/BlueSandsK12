"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function K12Error({ error, reset }) {
  useEffect(() => {
    console.error("[K12 AR Pedia page error]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center"
      style={{ background: "#FFFBF0" }}
    >
      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-500" strokeWidth={2} />
      </div>
      <div className="space-y-2 max-w-sm">
        <h1
          className="text-xl font-black text-secondary"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm">
          We hit an unexpected error loading this page.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border-2 border-gray-200 text-secondary rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
