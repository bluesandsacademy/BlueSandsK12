"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!", { duration: 1500 });
      setTimeout(() => {
        router.push(next);
        router.refresh();
      }, 800);
    } catch (err) {
      setError(err.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #02345a 0%, #01253f 60%, #011828 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
        style={{ background: "#0483e2", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"
        style={{ background: "#0483e2", filter: "blur(60px)" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-5 overflow-hidden">
            <Image
              src="/android-chrome-192x192.png"
              alt="Blue Sands STEM Labs"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Blue Sands STEM Labs
          </h1>
          <p className="text-white/50 text-sm mt-1 font-medium">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/6 backdrop-blur-md border border-white/15 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-white font-bold text-lg">Sign in to your account</h2>
            <p className="text-white/40 text-sm mt-0.5">Restricted to authorised personnel only.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-500/15 border border-red-400/30 rounded-xl text-sm text-red-300">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bluesandsstem.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              style={{ background: isLoading ? "#0483e2aa" : "#0483e2", color: "#fff" }}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/25 mt-6">
          Blue Sands STEM Labs · Admin Portal · Restricted Access
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: { background: "#02345a", color: "#fff", fontWeight: 600, borderRadius: "12px" },
            iconTheme: { primary: "#0483e2", secondary: "#fff" },
          },
        }}
      />
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
