"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingBag, BadgeDollarSign, Users2, Store } from "lucide-react";

const FULFILLMENT = ["new", "processing", "packed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  new:        "bg-sky-50 text-sky-700",
  processing: "bg-indigo-50 text-indigo-700",
  packed:     "bg-violet-50 text-violet-700",
  shipped:    "bg-amber-50 text-amber-700",
  delivered:  "bg-emerald-50 text-emerald-700",
  cancelled:  "bg-rose-50 text-rose-600",
};

function money(amount, currency) {
  if (amount == null) return "—";
  const n = Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency || ""} ${n}`.trim();
}

export default function StoreOrdersClient({ initial }) {
  const [orders, setOrders] = useState(initial);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const updateStatus = async (id, fulfillment_status) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, fulfillment_status } : o)));
    await fetch(`/api/admin/store-orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fulfillment_status }),
    });
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter && o.fulfillment_status !== filter) return false;
      if (!q) return true;
      return [o.customer_name, o.customer_email, o.paystack_reference]
        .some((v) => String(v || "").toLowerCase().includes(q));
    });
  }, [orders, filter, search]);

  const stats = useMemo(() => ({
    total:      orders.length,
    attributed: orders.filter((o) => o.promo_code_id).length,
    revenue:    orders.reduce((s, o) => s + Number(o.amount || 0), 0),
    currency:   orders.find((o) => o.currency)?.currency || "",
  }), [orders]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
          Store Orders
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Paid orders from your Paystack storefront — {orders.length} total
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard Icon={ShoppingBag}     label="Orders"            value={stats.total} />
        <StatCard Icon={Users2}          label="Member-attributed" value={stats.attributed} />
        <StatCard Icon={BadgeDollarSign} label="Revenue"           value={money(stats.revenue, stats.currency)} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, email, reference…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
        >
          <option value="">All statuses</option>
          {FULFILLMENT.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-10 text-center">
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No store orders yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Orders appear here automatically once Paystack sends a paid storefront order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-bold">Order</th>
                  <th className="px-4 py-3 font-bold">Customer</th>
                  <th className="px-4 py-3 font-bold">Products</th>
                  <th className="px-4 py-3 font-bold text-right">Amount</th>
                  <th className="px-4 py-3 font-bold">Member</th>
                  <th className="px-4 py-3 font-bold">Fulfilment</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-secondary">{o.paystack_reference}</p>
                      <p className="text-xs text-gray-400">
                        {o.paid_at ? new Date(o.paid_at).toLocaleDateString("en-GB") : new Date(o.created_at).toLocaleDateString("en-GB")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-secondary">{o.customer_name || "—"}</p>
                      {o.customer_email && <p className="text-xs text-gray-400">{o.customer_email}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[16rem]">
                      {o.product_summary || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">
                      {money(o.amount, o.currency)}
                    </td>
                    <td className="px-4 py-3">
                      {o.promo_codes?.member_name ? (
                        <span className="text-secondary font-semibold">{o.promo_codes.member_name}</span>
                      ) : o.discount_code ? (
                        <span className="text-gray-500">{o.discount_code} <span className="text-gray-300">(unmatched)</span></span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.fulfillment_status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer ${STATUS_STYLES[o.fulfillment_status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {FULFILLMENT.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>{value}</p>
    </div>
  );
}
