import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import { ShoppingBag, Users2, CreditCard, Clock, TrendingUp, ArrowRight, Package, CheckCircle2 } from "lucide-react";

async function getStats() {
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: depositPaid },
    { count: fullyPaid },
    { count: shippedOrders },
    { count: totalApplications },
    { count: pendingApplications },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }).eq("order_status", "pending"),
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }).eq("payment_status", "deposit_paid"),
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }).eq("payment_status", "fully_paid"),
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }).in("order_status", ["shipped", "delivered"]),
    supabaseAdmin.from("k12_distribution_applications").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("k12_distribution_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("k12_preorders")
      .select("id,full_name,selected_plan,device_count,order_status,payment_status,created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return { totalOrders, pendingOrders, depositPaid, fullyPaid, shippedOrders, totalApplications, pendingApplications, recentOrders };
}

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
  unpaid:       { bg: "bg-gray-100",    text: "text-gray-500" },
  deposit_paid: { bg: "bg-amber-50",    text: "text-amber-700" },
  fully_paid:   { bg: "bg-emerald-50",  text: "text-emerald-700" },
};

const PLAN_LABELS = { family: "Smart Family", school: "Smart Classroom" };

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Preorders",
      value: stats.totalOrders ?? 0,
      Icon: ShoppingBag,
      accent: "#0483e2",
      accentBg: "#e8f4ff",
      sub: "All time",
    },
    {
      label: "Awaiting Action",
      value: stats.pendingOrders ?? 0,
      Icon: Clock,
      accent: "#d97706",
      accentBg: "#fffbeb",
      sub: "Needs review",
    },
    {
      label: "Deposit Paid",
      value: stats.depositPaid ?? 0,
      Icon: CreditCard,
      accent: "#7c3aed",
      accentBg: "#f5f3ff",
      sub: "30% received",
    },
    {
      label: "Fully Paid",
      value: stats.fullyPaid ?? 0,
      Icon: CheckCircle2,
      accent: "#059669",
      accentBg: "#ecfdf5",
      sub: "100% cleared",
    },
    {
      label: "Shipped / Delivered",
      value: stats.shippedOrders ?? 0,
      Icon: Package,
      accent: "#0891b2",
      accentBg: "#ecfeff",
      sub: "In fulfilment",
    },
    {
      label: "Partner Applications",
      value: stats.totalApplications ?? 0,
      Icon: Users2,
      accent: "#db2777",
      accentBg: "#fdf2f8",
      sub: `${stats.pendingApplications ?? 0} pending review`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-black text-secondary tracking-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">K12 AR Pedia operations overview</p>
        </div>
        <Link
          href="/admin/preorders"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-secondary transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          View Orders
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ label, value, Icon, accent, accentBg, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: accentBg }}
            >
              <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={2} />
            </div>
            <p className="text-3xl font-black text-secondary tabular-nums">{value}</p>
            <p className="text-xs font-bold text-gray-700 mt-1 leading-tight">{label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pending review alert */}
      {(stats.pendingApplications ?? 0) > 0 && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">
              {stats.pendingApplications} partner application{stats.pendingApplications !== 1 ? "s" : ""} need review
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Review and respond to keep your pipeline moving.</p>
          </div>
          <Link
            href="/admin/applications"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-900 transition-colors"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-secondary text-base" style={{ fontFamily: "var(--font-jarkata)" }}>Recent Preorders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 6 orders</p>
          </div>
          <Link href="/admin/preorders" className="flex items-center gap-1.5 text-primary text-sm font-bold hover:text-secondary transition-colors">
            All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {(stats.recentOrders || []).map((order) => {
            const s = STATUS_STYLES[order.order_status] || STATUS_STYLES.pending;
            const p = PAYMENT_STYLES[order.payment_status] || PAYMENT_STYLES.unpaid;
            return (
              <Link key={order.id} href={`/admin/preorders/${order.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-secondary text-sm truncate">{order.full_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{PLAN_LABELS[order.selected_plan] || "—"} · {order.device_count} device{order.device_count !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}>
                    <span className={`w-1 h-1 rounded-full ${s.dot}`} />{order.order_status}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${p.bg} ${p.text}`}>
                    {order.payment_status?.replace(/_/g, " ")}
                  </span>
                </div>
              </Link>
            );
          })}
          {!stats.recentOrders?.length && (
            <div className="px-5 py-10 text-center">
              <ShoppingBag className="w-7 h-7 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No preorders yet</p>
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-left">
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats.recentOrders || []).map((order) => {
                const s = STATUS_STYLES[order.order_status] || STATUS_STYLES.pending;
                const p = PAYMENT_STYLES[order.payment_status] || PAYMENT_STYLES.unpaid;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-secondary">{order.full_name}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{PLAN_LABELS[order.selected_plan] || order.selected_plan || "—"}</td>
                    <td className="px-6 py-4 text-gray-600 font-bold">{order.device_count}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${p.bg} ${p.text}`}>
                        {order.payment_status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/preorders/${order.id}`}
                        className="inline-flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {!stats.recentOrders?.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <ShoppingBag className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No preorders yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
