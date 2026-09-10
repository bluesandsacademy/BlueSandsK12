"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { PREORDER_PACKAGES, labelFor } from "@/lib/k12-preorder";

export const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed", "declined"];

const STATUS_STYLES = {
  new:       { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  contacted: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  qualified: { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-400" },
  closed:    { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  declined:  { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-300" },
};

function StatusPill({ value }) {
  const s = STATUS_STYLES[value] || STATUS_STYLES.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {value}
    </span>
  );
}

export default function K12PreordersClient({ initialRows, total, page, limit, filters }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(filters.search);
  const [status, setStatus] = useState(filters.status);

  const totalPages = Math.ceil(total / limit);

  const buildUrl = (overrides = {}) => {
    const params = new URLSearchParams();
    const merged = { q: search, status, page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if ((v && v !== "1") || k === "page") params.set(k, v);
    }
    if (overrides.page === 1) params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  const applyFilters = () => startTransition(() => router.push(buildUrl({ page: 1 })));

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>K12 Pre-Orders</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Platform pre-order requests. {total} total request{total !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Search school, contact, email, phone…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {initialRows.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No requests found.
          </div>
        )}
        {initialRows.map((row) => (
          <Link
            key={row.id}
            href={`/admin/k12-preorders/${row.id}`}
            className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="font-bold text-secondary truncate">{row.school_org_name}</p>
                <p className="text-xs text-gray-400 truncate">{row.contact_person} · {row.email}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
            </div>
            <div className="flex flex-wrap gap-2 mb-3"><StatusPill value={row.status} /></div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Package</p>
                <p className="font-semibold text-secondary truncate">{labelFor(PREORDER_PACKAGES, row.package)}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Licenses</p>
                <p className="font-bold text-secondary">{row.student_licenses ?? "Not set"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Date</p>
                <p className="text-gray-500">{fmtDate(row.created_at)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 text-left border-b border-gray-100">
              {["School", "Contact", "Package", "Licenses", "Status", "Date", ""].map((h, i) => (
                <th key={i} className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors group">
                <td className="px-6 py-4 font-semibold text-secondary">{row.school_org_name}</td>
                <td className="px-6 py-4">
                  <p className="text-secondary">{row.contact_person}</p>
                  <p className="text-xs text-gray-400">{row.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{labelFor(PREORDER_PACKAGES, row.package)}</td>
                <td className="px-6 py-4 font-bold text-secondary">{row.student_licenses ?? "Not set"}</td>
                <td className="px-6 py-4"><StatusPill value={row.status} /></td>
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap text-xs">{fmtDate(row.created_at)}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/k12-preorders/${row.id}`}
                    className="inline-flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {!initialRows.length && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No requests found.</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">Page {page} of {totalPages}. {total} results.</p>
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
