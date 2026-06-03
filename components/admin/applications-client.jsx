"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowRight, School } from "lucide-react";

const STATUS_STYLES = {
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  rejected: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
};

export default function ApplicationsClient({ initialApplications, total, page, limit, filters }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [search,     setSearch]     = useState(filters.search);
  const [status,     setStatus]     = useState(filters.status);
  const [state,      setState]      = useState(filters.state);
  const [occupation, setOccupation] = useState(filters.occupation);

  const totalPages = Math.ceil(total / limit);

  const buildUrl = (overrides = {}) => {
    const params = new URLSearchParams();
    const merged = { q: search, status, state, occupation, page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    if (overrides.page === 1) params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  const applyFilters = () => startTransition(() => router.push(buildUrl({ page: 1 })));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>Applications</h1>
        <p className="text-gray-400 text-sm mt-0.5">{total} distribution officer application{total !== 1 ? "s" : ""}</p>
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
                placeholder="Search name, email…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white">
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={occupation} onChange={(e) => setOccupation(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white">
              <option value="">All occupations</option>
              {["educator","ict_professional","sales_professional","school_consultant","entrepreneur","other"].map((o) => (
                <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
              ))}
            </select>
            <button onClick={applyFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary transition-colors shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile card list ── */}
      <div className="md:hidden space-y-3">
        {initialApplications.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No applications found.
          </div>
        )}
        {initialApplications.map((app) => {
          const s = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
          return (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-bold text-secondary truncate">{app.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{app.email}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${s.bg} ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {app.status || "pending"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">State</p>
                  <p className="font-semibold text-secondary">{app.state || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Occupation</p>
                  <p className="font-semibold text-secondary capitalize">{app.occupation?.replace(/_/g, " ") || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">School Network</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${app.has_school_connections ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {app.has_school_connections ? <><School className="w-3 h-3" /> Yes</> : "No"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Applied</p>
                  <p className="text-gray-500">{new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 text-left border-b border-gray-100">
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Applicant</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">State</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Occupation</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">School Network</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Applied</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialApplications.map((app) => {
              const s = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
              return (
                <tr key={app.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-secondary">{app.full_name}</p>
                    <p className="text-xs text-gray-400">{app.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{app.state}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs capitalize">{app.occupation?.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${app.has_school_connections ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {app.has_school_connections ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {app.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/applications/${app.id}`}
                      className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!initialApplications.length && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
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
