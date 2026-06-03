"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package, CheckCircle2, Truck, MapPin, Home,
  Loader2, AlertCircle, RefreshCw, MessageCircle,
} from "lucide-react";

const STEPS = [
  { key: "pending",    label: "Order Placed",   Icon: Package },
  { key: "confirmed",  label: "Confirmed",       Icon: CheckCircle2 },
  { key: "processing", label: "Processing",      Icon: Package },
  { key: "ready",      label: "Ready to Ship",   Icon: Package },
  { key: "shipped",    label: "Dispatched",      Icon: Truck },
  { key: "delivered",  label: "Delivered",       Icon: Home },
];

const STEP_ORDER = STEPS.map((s) => s.key);

const PLAN_LABELS = { family: "Smart Family STEM Pack", school: "Smart Classroom Starter" };

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
  : "https://wa.me/2348000000000";

function TrackContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [data,    setData]    = useState(null);
  const [status,  setStatus]  = useState("idle"); // idle | loading | success | not_found | error
  const [query,   setQuery]   = useState(ref || "");

  const load = useCallback(async (refVal) => {
    if (!refVal?.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/track?ref=${encodeURIComponent(refVal.trim())}`);
      if (res.status === 404) { setStatus("not_found"); return; }
      if (!res.ok) throw new Error("Error");
      const json = await res.json();
      setData(json);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (ref) load(ref);
  }, [ref, load]);

  // Auto-refresh when in transit
  useEffect(() => {
    if (data?.courier_status === "dispatched" || data?.courier_status === "in_transit") {
      const t = setTimeout(() => load(ref || query), 60_000);
      return () => clearTimeout(t);
    }
  }, [data, ref, query, load]);

  const currentStepIdx = data
    ? Math.max(STEP_ORDER.indexOf(data.order_status), 0)
    : -1;

  return (
    <div className="min-h-screen py-16 px-4" style={{ background: "#FFFBF0" }}>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 mb-4">
            <Truck className="w-4 h-4" />
            Track Your Order
          </div>
          <h1 className="text-3xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
            Where&apos;s My Order?
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your order reference to see live tracking status.</p>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-bold text-secondary mb-2">Order Reference</label>
          <div className="flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load(query)}
              placeholder="e.g. BSL-A1B2C3D4"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm font-mono"
            />
            <button
              onClick={() => load(query)}
              disabled={status === "loading" || !query.trim()}
              className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-colors disabled:opacity-50 shrink-0"
            >
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Your reference was included in your confirmation email (format: BSL-XXXXXXXX).</p>
        </div>

        {/* Not found */}
        {status === "not_found" && (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 flex gap-4 items-start">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-secondary">Order not found</p>
              <p className="text-gray-500 text-sm mt-1">Double-check your reference and try again, or contact us on WhatsApp.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-gray-500 text-sm">Something went wrong. <button onClick={() => load(query)} className="text-primary font-semibold">Try again</button></p>
          </div>
        )}

        {/* Results */}
        {status === "success" && data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Order summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Order Reference</p>
                  <p className="font-mono font-bold text-secondary text-lg">{data.ref}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Customer</p>
                  <p className="font-bold text-secondary text-sm">{data.customer_name}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Plan</p>
                  <p className="font-semibold text-secondary">{PLAN_LABELS[data.plan] || data.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Devices</p>
                  <p className="font-semibold text-secondary">{data.device_count}</p>
                </div>
                {data.estimated_delivery && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Est. Delivery</p>
                    <p className="font-semibold text-secondary">{new Date(data.estimated_delivery).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                )}
                {data.tracking_number && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tracking #</p>
                    <p className="font-mono font-semibold text-secondary">{data.tracking_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-secondary text-sm mb-6">Order Progress</h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />

                <div className="space-y-0">
                  {STEPS.map(({ key, label, Icon }, i) => {
                    const done    = i < currentStepIdx;
                    const current = i === currentStepIdx;
                    const future  = i > currentStepIdx;
                    return (
                      <div key={key} className="flex items-start gap-4 relative pb-6 last:pb-0">
                        {/* Circle */}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                          ${done ? "bg-emerald-500" : current ? "bg-primary" : "bg-gray-100"}`}
                        >
                          {current && (
                            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                          )}
                          <Icon className={`w-4.5 h-4.5 ${done || current ? "text-white" : "text-gray-400"}`} strokeWidth={2} />
                        </div>
                        {/* Label */}
                        <div className="pt-2">
                          <p className={`font-bold text-sm ${future ? "text-gray-300" : current ? "text-primary" : "text-secondary"}`}>
                            {label}
                          </p>
                          {current && data.courier_status && (
                            <p className="text-xs text-gray-400 mt-0.5">{data.courier_status.replace("_", " ")}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live events */}
            {data.events?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-secondary text-sm mb-4">Tracking Events</h2>
                <div className="space-y-3">
                  {data.events.map((ev, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="font-medium text-secondary">{ev.description}</p>
                        <p className="text-xs text-gray-400">{ev.location} · {new Date(ev.timestamp).toLocaleString("en-GB")}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {data.tracking_url && (
                  <a href={data.tracking_url} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold underline">
                    Track with {data.logistics_provider || "courier"} →
                  </a>
                )}
              </div>
            )}

            {/* Refresh + help */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => load(ref || query)}
                className="flex items-center justify-center gap-2 flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl text-secondary font-bold text-sm hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh Status
              </button>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 px-5 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}

        <p className="text-center text-xs text-gray-400">
          <Link href="/products/k12-ar-pedia" className="hover:underline">← Back to K12 AR Pedia</Link>
        </p>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFBF0" }}>
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
