"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CreditCard, ArrowRight, Loader2, CheckCircle2, AlertCircle, Lock, Shield } from "lucide-react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
  : "https://wa.me/2348000000000";

export default function PayBalancePage() {
  const [form, setForm] = useState({ order_ref: "", email: "" });
  const [status,  setStatus]  = useState("idle"); // idle | loading | redirecting | error
  const [errMsg,  setErrMsg]  = useState("");
  const [balance, setBalance] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/k12-ar-pedia/pay-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBalance(data.balance_ngn);
      setStatus("redirecting");
      // Brief pause so user sees the confirmation before redirect
      setTimeout(() => { window.location.href = data.paystack_url; }, 1800);
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center" style={{ background: "#FFFBF0" }}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
            <CreditCard className="w-4 h-4" />
            Complete Your Order
          </div>
          <h1 className="text-3xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
            Pay Remaining Balance
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enter your order reference and the email you used when ordering to securely pay your 70% balance.
          </p>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified by Paystack · SSL encrypted</span>
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/80 overflow-hidden">
          <AnimatePresence mode="wait">
            {status !== "redirecting" ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={submit}
                className="p-8 space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Order Reference <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={form.order_ref}
                    onChange={(e) => set("order_ref", e.target.value.toUpperCase())}
                    placeholder="BSL-A1B2C3D4"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm font-mono placeholder:font-sans placeholder:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">Found in your order confirmation email.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-400">Must match the email used when you placed the preorder.</p>
                </div>

                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-rose-700 font-medium">{errMsg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={status === "loading" || !form.order_ref || !form.email}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-black text-base hover:bg-secondary transition-all duration-200 disabled:opacity-50 shadow-lg shadow-primary/25"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {status === "loading" ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</>
                  ) : (
                    <>Proceed to Payment <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  You will be redirected to Paystack&apos;s secure checkout. We never store your card details.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                </div>
                <div>
                  <p className="font-black text-secondary text-lg" style={{ fontFamily: "var(--font-jarkata)" }}>
                    Order Verified!
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Balance due: <span className="font-bold text-secondary">₦{balance?.toLocaleString("en-NG")}</span>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to Paystack…
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400">
          Need help?{" "}
          <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
            Chat with us on WhatsApp
          </a>
          {" · "}
          <Link href="/" className="hover:underline">Back to product page</Link>
        </p>
      </div>
    </div>
  );
}
