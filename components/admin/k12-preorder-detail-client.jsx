"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, Building2, GraduationCap, Package, CalendarClock, StickyNote } from "lucide-react";
import {
  SCHOOL_TYPES,
  PREORDER_PACKAGES,
  SUBSCRIPTION_DURATIONS,
  ACADEMIC_YEAR_OPTIONS,
  labelFor,
  getPackage,
} from "@/lib/k12-preorder";
import { fmtUSD, fmtNGN } from "@/lib/products";
import { STATUS_OPTIONS } from "./k12-preorders-client";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
        <h2 className="font-bold text-secondary text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-secondary font-medium break-words">{value || "Not provided"}</p>
    </div>
  );
}

export default function K12PreorderDetailClient({ preorder }) {
  const router = useRouter();

  const [status, setStatus]       = useState(preorder.status || "new");
  const [savingStatus, setSaving] = useState(false);
  const [notes, setNotes]         = useState(preorder.admin_notes || "");
  const [savingNotes, setSavingN] = useState(false);

  const ref = `BSL-${preorder.id.slice(0, 8).toUpperCase()}`;

  const patch = async (payload) => {
    const res = await fetch(`/api/admin/k12-preorders/${preorder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Update failed");
  };

  const saveStatus = async (next) => {
    setStatus(next);
    setSaving(true);
    try {
      await patch({ status: next });
      toast.success(`Status set to "${next}"`);
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSavingN(true);
    try {
      await patch({ admin_notes: notes });
      toast.success("Notes saved");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSavingN(false);
    }
  };

  const pkg = getPackage(preorder.package);
  const durations = (preorder.subscription_durations || []).map((d) => labelFor(SUBSCRIPTION_DURATIONS, d));

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />

      <div className="flex items-start gap-4">
        <Link href="/admin/k12-preorders" className="mt-1 p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
              {preorder.school_org_name}
            </h1>
            <span className="font-mono text-xs font-bold text-gray-400">{ref}</span>
          </div>
          <p className="text-gray-400 text-xs">
            Submitted {new Date(preorder.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
            {preorder.reviewed_by && `. Last updated by ${preorder.reviewed_by}`}
          </p>
        </div>
      </div>

      {/* Status control */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => saveStatus(s)}
              disabled={savingStatus}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold capitalize transition-colors disabled:opacity-50 ${
                status === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Contact" icon={Building2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact person" value={preorder.contact_person} />
            <Field label="Job title" value={preorder.job_title} />
            <Field label="Email" value={preorder.email} />
            <Field label="Phone / WhatsApp" value={preorder.phone} />
            <Field label="Location" value={preorder.location} />
          </div>
        </Section>

        <Section title="School" icon={GraduationCap}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="School type" value={preorder.school_type && labelFor(SCHOOL_TYPES, preorder.school_type)} />
            <Field label="Students (approx.)" value={preorder.student_count} />
            <Field label="Teachers" value={preorder.teacher_count} />
            <Field label="Current LMS" value={preorder.current_lms} />
          </div>
        </Section>

        <Section title="Package" icon={Package}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Package" value={labelFor(PREORDER_PACKAGES, preorder.package)} />
            <Field label="List price" value={pkg && `${fmtUSD(pkg.priceUSD)} / ${fmtNGN(pkg.priceNGN)}`} />
            <Field label="Age bracket" value={pkg?.ageRange} />
            <Field label="Books" value={pkg?.books} />
            <Field label="Student licenses" value={preorder.student_licenses} />
            <Field label="Preferred duration" value={durations.join(", ")} />
          </div>
        </Section>

        <Section title="Launch" icon={CalendarClock}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Implementation date" value={preorder.implementation_date} />
            <Field label="Academic year" value={preorder.academic_year && labelFor(ACADEMIC_YEAR_OPTIONS, preorder.academic_year)} />
            <Field label="Wants a demo" value={preorder.demo_requested ? "Yes" : "No"} />
            <Field label="Pre-order confirmed" value={preorder.agreed_preorder ? "Yes" : "No"} />
          </div>
        </Section>
      </div>

      {pkg && (
        <Section title="Package contents" icon={Package}>
          <div className="flex flex-wrap gap-2">
            {[...pkg.topics, ...pkg.includes].map((label) => (
              <span key={label} className="px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold">{label}</span>
            ))}
          </div>
        </Section>
      )}

      <Section title="Additional requirements" icon={StickyNote}>
        <p className="text-sm text-secondary whitespace-pre-wrap">
          {preorder.additional_requirements || "None provided."}
        </p>
      </Section>

      <Section title="Admin notes" icon={StickyNote}>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes about this request…"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm resize-none"
        />
        <button
          onClick={saveNotes}
          disabled={savingNotes}
          className="mt-3 px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-primary transition-colors disabled:opacity-50"
        >
          {savingNotes ? "Saving…" : "Save notes"}
        </button>
      </Section>
    </div>
  );
}
