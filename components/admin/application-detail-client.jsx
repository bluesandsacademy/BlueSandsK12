"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, CheckCircle2, XCircle, Users2, MapPin, Briefcase } from "lucide-react";

const STATUS_COLORS = {
  pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        <Icon className="w-4.5 h-4.5 text-primary" />
        <h2 className="font-bold text-secondary text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value && value !== false) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-secondary font-medium">{String(value)}</p>
    </div>
  );
}

export default function ApplicationDetailClient({ application: app }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [notes, setNotes]     = useState(app.review_notes || "");

  async function updateStatus(status) {
    setLoading(status);
    try {
      const res = await fetch(`/api/admin/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, review_notes: notes }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(`Application ${status}`);
      router.refresh();
    } catch {
      toast.error("Failed to update application");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />

      <div className="flex items-start gap-4">
        <Link href="/admin/applications" className="mt-1 p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
              {app.full_name}
            </h1>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {app.status || "pending"}
            </span>
          </div>
          <p className="text-gray-400 text-xs">
            Applied {new Date(app.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Section title="Personal Info" icon={Users2}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name"  value={app.full_name} />
              <Field label="Email"      value={app.email} />
              <Field label="Phone"      value={app.phone} />
              <Field label="WhatsApp"   value={app.whatsapp} />
            </div>
          </Section>

          <Section title="Location" icon={MapPin}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State"    value={app.state} />
              <Field label="City/LGA" value={app.city_lga} />
            </div>
          </Section>

          <Section title="Background" icon={Briefcase}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Occupation"         value={app.occupation?.replace("_", " ")} />
              <Field label="School Connections" value={app.has_school_connections ? "Yes" : "No"} />
              <Field label="Network Size"       value={app.school_network_size} />
            </div>
            {app.why_apply && (
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Why They Applied</p>
                <p className="text-sm text-secondary leading-relaxed bg-gray-50 rounded-xl p-4">{app.why_apply}</p>
              </div>
            )}
            {app.cv_url && (
              <div className="mt-4">
                <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-semibold underline">View CV / Portfolio →</a>
              </div>
            )}
          </Section>
        </div>

        {/* Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-secondary text-sm">Review Decision</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Review Notes (optional)</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes to include with the decision…"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm resize-none" />
              </div>
              <div className="space-y-2">
                <button onClick={() => updateStatus("approved")} disabled={loading === "approved" || app.status === "approved"}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4" />
                  {loading === "approved" ? "Approving…" : "Approve Application"}
                </button>
                <button onClick={() => updateStatus("rejected")} disabled={loading === "rejected" || app.status === "rejected"}
                  className="flex items-center gap-2 w-full px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50">
                  <XCircle className="w-4 h-4" />
                  {loading === "rejected" ? "Rejecting…" : "Reject Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
