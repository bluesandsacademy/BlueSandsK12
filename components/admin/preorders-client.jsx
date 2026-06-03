"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const STATUS_STYLES = {
  pending:    { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  confirmed:  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  processing: { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-400" },
  ready:      { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400" },
  shipped:    { bg: "bg-cyan-50",    text: "text-cyan-700",    dot: "bg-cyan-400" },
  delivered:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  cancelled:  { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
};

const PAYMENT_STYLES = {
  unpaid:       { bg: "bg-gray-100",   text: "text-gray-500" },
  deposit_paid: { bg: "bg-amber-50",   text: "text-amber-700" },
  fully_paid:   { bg: "bg-emerald-50", text: "text-emerald-700" },
};

const PLAN_LABELS = { family: "Family Pack", school: "School Pack" };

function StatusPill({ value, map }) {
  const s = map[value] || { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-300" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {value?.replace(/_/g, " ")}
    </span>
  );
}

export default function PreordersClient({ initialOrders, total, page, limit, filters }) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [, startTransition] = useTransition();

  const [search,        setSearch]        = useState(filters.search);
  const [orderStatus,   setOrderStatus]   = useState(filters.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(filters.paymentStatus);

  const totalPages = Math.ceil(total / limit);

  const buildUrl = (overrides = {}) => {
    const params = new URLSearchParams();
    const merged = { q: search, order_status: orderStatus, payment_status: paymentStatus, page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "1" || k === "page") params.set(k, v);
    }
    if (overrides.page === 1) params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  const applyFilters = () => startTransition(() => router.push(buildUrl({ page: 1 })));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>Preorders</h1>
        <p className="text-gray-400 text-sm mt-0.5">{total} total order{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search — full width on mobile */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Search name, email, phone…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>
          {/* Selects + button row on mobile */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
            >
              <option value="">All statuses</option>
              {["pending","confirmed","processing","ready","shipped","delivered","cancelled"].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
            >
              <option value="">All payments</option>
              <option value="unpaid">Unpaid</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="fully_paid">Fully Paid</option>
            </select>
            <button
              onClick={applyFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile card list (hidden on md+) ── */}
      <div className="md:hidden space-y-3">
        {initialOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No orders found.
          </div>
        )}
        {initialOrders.map((order) => {
          const s = STATUS_STYLES[order.order_status]  || STATUS_STYLES.pending;
          const p = PAYMENT_STYLES[order.payment_status] || PAYMENT_STYLES.unpaid;
          return (
            <Link
              key={order.id}
              href={`/admin/preorders/${order.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-bold text-secondary truncate">{order.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{order.email}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {order.order_status}
                </span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${p.bg} ${p.text}`}>
                  {order.payment_status?.replace(/_/g, " ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Plan</p>
                  <p className="font-semibold text-secondary">{PLAN_LABELS[order.selected_plan] || order.selected_plan || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Devices</p>
                  <p className="font-bold text-secondary">{order.device_count}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Date</p>
                  <p className="text-gray-500">{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Desktop table (hidden on mobile) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 text-left border-b border-gray-100">
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Plan</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Qty</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Payment Opt.</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order Status</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/60 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-semibold text-secondary">{order.full_name}</p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{PLAN_LABELS[order.selected_plan] || order.selected_plan || "—"}</td>
                <td className="px-6 py-4 font-bold text-secondary">{order.device_count}</td>
                <td className="px-6 py-4 text-gray-500 text-xs capitalize">{order.payment_option}</td>
                <td className="px-6 py-4"><StatusPill value={order.order_status}  map={STATUS_STYLES}  /></td>
                <td className="px-6 py-4"><StatusPill value={order.payment_status} map={PAYMENT_STYLES} /></td>
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap text-xs">
                  {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/preorders/${order.id}`}
                    className="inline-flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {!initialOrders.length && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">Page {page} of {totalPages} — {total} results</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={buildUrl({ page: page - 1 })} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Link>
              )}
              {page < totalPages && (
                <Link href={buildUrl({ page: page + 1 })} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile pagination */}
      {totalPages > 1 && (
        <div className="md:hidden flex items-center justify-between">
          <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={buildUrl({ page: page - 1 })} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 bg-white">
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </Link>
            )}
            {page < totalPages && (
              <Link href={buildUrl({ page: page + 1 })} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 bg-white">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
