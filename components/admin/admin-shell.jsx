"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard, ShoppingBag, Store, Users2, Newspaper,
  Ticket, Send, LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin",              label: "Dashboard",         Icon: LayoutDashboard },
  { href: "/admin/store-orders", label: "Store Orders",      Icon: Store },
  { href: "/admin/preorders",    label: "Quote Requests",    Icon: ShoppingBag },
  { href: "/admin/applications", label: "Applications",      Icon: Users2 },
  { href: "/admin/promo-codes",  label: "Promo Codes",       Icon: Ticket },
  { href: "/admin/campaign",     label: "Email Campaign",    Icon: Send },
  { href: "/admin/news",         label: "News & Insights",   Icon: Newspaper },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen]         = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    sb.auth.getUser().then(({ data }) => {
      if (data?.user) setUserEmail(data.user.email);
    });
  }, [isLogin]);

  const signOut = async () => {
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await sb.auth.signOut();
    router.push("/admin/login");
  };

  if (isLogin) return <>{children}</>;

  const initial = userEmail?.[0]?.toUpperCase() || "A";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 flex flex-col z-40 transition-transform duration-300 shrink-0
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
        style={{ background: "linear-gradient(180deg, #02345a 0%, #011e40 100%)" }}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Image
                src="/android-chrome-192x192.png"
                alt="Blue Sands STEM Labs"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm leading-tight truncate">Blue Sands</p>
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">STEM Labs Admin</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white lg:hidden transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                  ${active
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-white/55 hover:text-white hover:bg-white/8"}`}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Divider + user footer */}
        <div className="px-4 pb-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/80 text-xs font-semibold truncate">{userEmail || "Admin"}</p>
              <p className="text-white/30 text-[10px]">Administrator</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-secondary hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-secondary/10 flex items-center justify-center">
              <Image src="/android-chrome-192x192.png" alt="" width={18} height={18} className="object-contain" />
            </div>
            <p className="font-bold text-secondary text-sm">Blue Sands Admin</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
