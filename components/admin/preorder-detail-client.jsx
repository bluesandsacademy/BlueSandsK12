"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronLeft, CheckCircle2, Package, MapPin, CreditCard,
  Mail, Truck, StickyNote, XCircle, RefreshCw, PackageCheck,
} from "lucide-react";

const STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed:  "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  ready:      "bg-purple-100 text-purple-700 border-purple-200",
  shipped:    "bg-cyan-100 text-cyan-700 border-cyan-200",
  delivered:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled:  "bg-red-100 text-red-700 border-red-200",
};

const PAYMENT_COLORS = {
  unpaid:       "bg-gray-100 text-gray-600 border-gray-200",
  deposit_paid: "bg-amber-100 text-amber-700 border-amber-200",
  fully_paid:   "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const PLAN_LABELS = { family: "Smart Family STEM Pack", school: "Smart Classroom Starter" };
const PLAN_RATES  = { family: 210000, school: 84000 };

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        <Icon className="w-4.5 h-4.5 text-primary" strokeWidth={2} />
        <h2 className="font-bold text-secondary text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-secondary font-medium">{value}</p>
    </div>
  );
}

export default function PreorderDetailClient({ preorder, payments, tracking, emails }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  const [notes, setNotes]     = useState(preorder.admin_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const [trackingForm, setTrackingForm] = useState({
    mode: "manual",
    tracking_number: tracking?.tracking_number || "",
    logistics_provider: tracking?.logistics_provider || "",
    tracking_url: tracking?.tracking_url || "",
    estimated_delivery: tracking?.estimated_delivery || "",
  });
  const [savingTracking, setSavingTracking] = useState(false);

  const orderId = `BSL-${preorder.id.slice(0, 8).toUpperCase()}`;
  const ratePerDevice = PLAN_RATES[preorder.selected_plan] ?? PLAN_RATES.school;
  const fullAmount    = ratePerDevice * preorder.device_count;

  const updateStatus = async (order_status) => {
    setLoading(order_status);
    try {
      const res = await fetch(`/api/admin/preorders/${preorder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(`Status updated to "${order_status}"`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(null);
    }
  };

  const sendEmail = async (email_type) => {
    setLoading(email_type);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preorder_id: preorder.id, email_type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email failed");
      toast.success("Email sent successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to send email");
    } finally {
      setLoading(null);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch(`/api/admin/preorders/${preorder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: notes }),
      });
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const saveTracking = async () => {
    setSavingTracking(true);
    try {
      const res = await fetch(`/api/admin/tracking/${preorder.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingForm),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Tracking saved — customer notified by email");
      router.refresh();
    } catch {
      toast.error("Failed to save tracking info");
    } finally {
      setSavingTracking(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Toaster position="top-right" />

      {/* Back + header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/preorders" className="mt-1 p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
              {orderId}
            </h1>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[preorder.order_status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {preorder.order_status}
            </span>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${PAYMENT_COLORS[preorder.payment_status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {preorder.payment_status?.replace("_", " ")}
            </span>
          </div>
          <p className="text-gray-400 text-xs">
            Placed {new Date(preorder.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
            {preorder.reviewed_by && ` · Reviewed by ${preorder.reviewed_by}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer info */}
          <Section title="Customer" icon={CreditCard}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name"        value={preorder.full_name} />
              <Field label="Email"            value={preorder.email} />
              <Field label="Phone"            value={preorder.phone} />
              <Field label="WhatsApp"         value={preorder.whatsapp} />
              <Field label="User Type"        value={preorder.user_type} />
              <Field label="School / Org"     value={preorder.school_org_name} />
            </div>
          </Section>

          {/* Location */}
          <Section title="Delivery Address" icon={MapPin}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address"          value={preorder.address_line1} />
              <Field label="Apt / Floor"      value={preorder.address_line2} />
              <Field label="Landmark"         value={preorder.landmark} />
              <Field label="City"             value={preorder.city} />
              <Field label="LGA"              value={preorder.lga} />
              <Field label="State"            value={preorder.state} />
              <Field label="Postal Code"      value={preorder.postal_code} />
            </div>
          </Section>

          {/* Order details */}
          <Section title="Order Details" icon={Package}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Plan"             value={PLAN_LABELS[preorder.selected_plan] || preorder.selected_plan} />
              <Field label="Devices"          value={String(preorder.device_count)} />
              <Field label="Payment"          value="Full Payment" />
              <Field label="Students"         value={preorder.student_count ? String(preorder.student_count) : undefined} />
              <Field label="Teachers"         value={preorder.teacher_count ? String(preorder.teacher_count) : undefined} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Order Total</span><span className="font-bold text-secondary">₦{fullAmount.toLocaleString("en-NG")}</span></div>
            </div>
          </Section>

          {/* Payment history */}
          <Section title="Payment History" icon={CreditCard}>
            {payments.length === 0 ? (
              <p className="text-sm text-gray-400">No payments recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-secondary capitalize">{p.payment_type}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${p.paystack_status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {p.paystack_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono truncate">{p.paystack_ref?.slice(0, 20)}…</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-secondary text-sm">₦{Number(p.amount_ngn).toLocaleString("en-NG")}</p>
                      <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Tracking */}
          <Section title="Logistics & Tracking" icon={Truck}>
            <div className="space-y-4">
              {tracking && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm mb-4">
                  <Field label="Tracking #"   value={tracking.tracking_number} />
                  <Field label="Provider"     value={tracking.logistics_provider} />
                  <Field label="Status"       value={tracking.status} />
                  <Field label="Est. Delivery" value={tracking.estimated_delivery} />
                  {tracking.tracking_url && (
                    <div className="col-span-2">
                      <a href={tracking.tracking_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-semibold underline">
                        Track externally →
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tracking Number</label>
                  <input value={trackingForm.tracking_number} onChange={(e) => setTrackingForm((f) => ({ ...f, tracking_number: e.target.value }))}
                    placeholder="e.g. SB123456789NG"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Provider</label>
                  <input value={trackingForm.logistics_provider} onChange={(e) => setTrackingForm((f) => ({ ...f, logistics_provider: e.target.value }))}
                    placeholder="e.g. Sendbox"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Est. Delivery Date</label>
                  <input type="date" value={trackingForm.estimated_delivery} onChange={(e) => setTrackingForm((f) => ({ ...f, estimated_delivery: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tracking URL (optional)</label>
                  <input value={trackingForm.tracking_url} onChange={(e) => setTrackingForm((f) => ({ ...f, tracking_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm" />
                </div>
              </div>
              <button onClick={saveTracking} disabled={savingTracking || !trackingForm.tracking_number}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-bold hover:bg-cyan-700 transition-colors disabled:opacity-50">
                <Truck className="w-4 h-4" />
                {savingTracking ? "Saving…" : "Save & Mark Shipped"}
              </button>
            </div>
          </Section>

          {/* Admin notes */}
          <Section title="Admin Notes" icon={StickyNote}>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes about this order…"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm resize-none"
            />
            <button onClick={saveNotes} disabled={savingNotes}
              className="mt-3 px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-primary transition-colors disabled:opacity-50">
              {savingNotes ? "Saving…" : "Save Notes"}
            </button>
          </Section>

          {/* Email log */}
          {emails.length > 0 && (
            <Section title="Email History" icon={Mail}>
              <div className="space-y-2">
                {emails.map((e) => (
                  <div key={e.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-secondary">{e.subject}</p>
                      <p className="text-xs text-gray-400">{new Date(e.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
                    </div>
                    <span className="text-xs text-gray-400">{e.email_type}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right column — actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-secondary text-sm">Actions</h2>
            </div>
            <div className="p-5 space-y-2.5">
              {preorder.order_status === "pending" && (
                <button onClick={() => updateStatus("confirmed")} disabled={loading === "confirmed"}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4" />
                  {loading === "confirmed" ? "Updating…" : "Confirm Order"}
                </button>
              )}
              {preorder.order_status === "confirmed" && (
                <button onClick={() => updateStatus("processing")} disabled={loading === "processing"}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  <Package className="w-4 h-4" />
                  {loading === "processing" ? "Updating…" : "Mark Processing"}
                </button>
              )}
              {["confirmed","processing"].includes(preorder.order_status) && (
                <button onClick={() => updateStatus("ready")} disabled={loading === "ready"}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4" />
                  {loading === "ready" ? "Updating…" : "Mark Ready"}
                </button>
              )}

              {/* Mark Delivered */}
              {preorder.order_status === "shipped" && (
                <button
                  onClick={() => updateStatus("delivered")}
                  disabled={loading === "delivered"}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <PackageCheck className="w-4 h-4" />
                  {loading === "delivered" ? "Updating…" : "Mark Delivered"}
                </button>
              )}

              {/* Resend tracking email */}
              {tracking?.tracking_number && preorder.order_status !== "delivered" && (
                <button onClick={() => sendEmail("tracking_update")} disabled={loading === "tracking_update"}
                  className="flex items-center gap-2 w-full px-4 py-3 border-2 border-cyan-200 text-cyan-700 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors disabled:opacity-50">
                  <RefreshCw className="w-4 h-4" />
                  {loading === "tracking_update" ? "Sending…" : "Resend Tracking Email"}
                </button>
              )}

              {preorder.order_status !== "cancelled" && preorder.order_status !== "delivered" && (
                <button onClick={() => { if (confirm("Cancel this order?")) updateStatus("cancelled"); }}
                  disabled={loading === "cancelled"}
                  className="flex items-center gap-2 w-full px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50">
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Quick info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 text-sm">
            <h2 className="font-bold text-secondary text-sm">Quick Info</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-400">Order Ref</span><span className="font-mono font-bold text-secondary text-xs">{orderId}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Plan</span><span className="font-semibold text-secondary">{PLAN_LABELS[preorder.selected_plan] || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Devices</span><span className="font-semibold">{preorder.device_count}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-2"><span className="text-gray-400">Order Total</span><span className="font-bold text-secondary">₦{fullAmount.toLocaleString("en-NG")}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
