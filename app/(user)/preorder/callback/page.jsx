"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight, MessageCircle } from "lucide-react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
  : "https://wa.me/2348000000000";

function CallbackContent() {
  const searchParams = useSearchParams();
  const preorderId = searchParams.get("preorder_id");
  const trxref     = searchParams.get("trxref") || searchParams.get("reference");

  const [status,   setStatus]   = useState("verifying");
  const [orderRef, setOrderRef] = useState("");

  useEffect(() => {
    if (!trxref) { setStatus("failed"); return; }

    fetch(`/api/k12-ar-pedia/verify-payment?ref=${trxref}&preorder_id=${preorderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrderRef(`BSL-${preorderId?.slice(0, 8).toUpperCase()}`);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [trxref, preorderId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#FFFBF0" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
            <p className="text-secondary font-bold text-xl" style={{ fontFamily: "var(--font-jarkata)" }}>
              Confirming your payment…
            </p>
            <p className="text-gray-500 text-sm">Please wait, this takes just a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto bg-emerald-100">
              <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-secondary mb-2" style={{ fontFamily: "var(--font-jarkata)" }}>
                Payment Complete!
              </h1>
              {orderRef && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  Order Ref: {orderRef}
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Your order is fully paid. We&apos;ll be in touch within 1–2 business days with next steps.
            </p>

            <p className="text-gray-500 text-sm">A confirmation email has been sent to you.</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors"
              >
                Back to Product Page
              </Link>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-14 h-14 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-secondary mb-2" style={{ fontFamily: "var(--font-jarkata)" }}>
                Payment Not Confirmed
              </h1>
              <p className="text-gray-600">
                We couldn&apos;t verify your payment. If you were charged, please contact us immediately.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/preorder"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-secondary transition-colors"
              >
                Try Again
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Get Help
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function PreorderCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFBF0" }}>
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
