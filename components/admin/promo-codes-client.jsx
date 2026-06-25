"use client";

import { useState } from "react";
import {
  Plus, Ticket, Pencil, Trash2, Copy, Check, X, Loader2,
  ShoppingBag, BadgePercent, Power,
} from "lucide-react";
import { fmtNGN } from "@/lib/products";

const EMPTY = {
  member_name: "", member_email: "", member_phone: "",
  code: "", discount_type: "percent", discount_value: "",
  max_redemptions: "", expires_at: "", active: true, notes: "",
};

function discountLabel(c) {
  return c.discount_type === "percent"
    ? `${Number(c.discount_value)}% off`
    : `${fmtNGN(Number(c.discount_value))} off`;
}

export default function PromoCodesClient({ initial }) {
  const [codes, setCodes]   = useState(initial);
  const [modal, setModal]   = useState(null);   // null | { mode: "create" | "edit", form }
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");
  const [copied, setCopied] = useState("");
  const [orders, setOrders] = useState(null);   // { code, rows } | null

  const refresh = async () => {
    const res = await fetch("/api/admin/promo-codes");
    const data = await res.json();
    if (res.ok) setCodes(data.data);
  };

  const openCreate = () => { setErr(""); setModal({ mode: "create", form: { ...EMPTY } }); };
  const openEdit = (c) => {
    setErr("");
    setModal({
      mode: "edit",
      id: c.id,
      form: {
        member_name: c.member_name || "", member_email: c.member_email || "",
        member_phone: c.member_phone || "", code: c.code || "",
        discount_type: c.discount_type, discount_value: String(c.discount_value),
        max_redemptions: c.max_redemptions ?? "", expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "",
        active: c.active, notes: c.notes || "",
      },
    });
  };

  const setField = (k, v) => setModal((m) => ({ ...m, form: { ...m.form, [k]: v } }));

  const save = async () => {
    setSaving(true); setErr("");
    const isEdit = modal.mode === "edit";
    const url  = isEdit ? `/api/admin/promo-codes/${modal.id}` : "/api/admin/promo-codes";
    const verb = isEdit ? "PATCH" : "POST";
    try {
      const res = await fetch(url, {
        method: verb,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modal.form),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Could not save."); return; }
      setModal(null);
      await refresh();
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c) => {
    setCodes((list) => list.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
    await fetch(`/api/admin/promo-codes/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
  };

  const remove = async (c) => {
    if (!confirm(`Delete code ${c.code}? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/promo-codes/${c.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error || "Could not delete."); return; }
    setCodes((list) => list.filter((x) => x.id !== c.id));
  };

  const viewOrders = async (c) => {
    setOrders({ code: c.code, rows: null });
    const res = await fetch(`/api/admin/promo-codes/${c.id}`);
    const data = await res.json();
    setOrders({ code: c.code, rows: res.ok ? data.data.orders : [] });
  };

  const copy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 1500);
  };

  const totals = {
    active:   codes.filter((c) => c.active).length,
    orders:   codes.reduce((s, c) => s + Number(c.paid_orders), 0),
    revenue:  codes.reduce((s, c) => s + Number(c.gross_revenue_ngn), 0),
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
            Promo Codes
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {codes.length} team member code{codes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> New Code
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard Icon={Ticket}      label="Total codes"        value={codes.length} />
        <StatCard Icon={Power}       label="Active"             value={totals.active} />
        <StatCard Icon={ShoppingBag} label="Attributed orders"  value={totals.orders} />
        <StatCard Icon={BadgePercent} label="Revenue via codes" value={fmtNGN(totals.revenue)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {codes.length === 0 ? (
          <div className="p-10 text-center">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No promo codes yet</p>
            <p className="text-gray-400 text-sm mt-1">Create a code to give a team member a personal discount link.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-bold">Code</th>
                  <th className="px-4 py-3 font-bold">Member</th>
                  <th className="px-4 py-3 font-bold">Discount</th>
                  <th className="px-4 py-3 font-bold text-center">Orders</th>
                  <th className="px-4 py-3 font-bold text-right">Revenue</th>
                  <th className="px-4 py-3 font-bold text-center">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copy(c.code)}
                        className="inline-flex items-center gap-1.5 font-mono font-bold text-secondary hover:text-primary"
                        title="Copy code"
                      >
                        {c.code}
                        {copied === c.code
                          ? <Check className="w-3.5 h-3.5 text-grass" />
                          : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-secondary">{c.member_name}</p>
                      {c.member_email && <p className="text-xs text-gray-400">{c.member_email}</p>}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{discountLabel(c)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => viewOrders(c)}
                        className="font-bold text-primary hover:underline"
                        title="View orders"
                      >
                        {Number(c.paid_orders)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">
                      {fmtNGN(Number(c.gross_revenue_ngn))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          c.active ? "bg-grass/10 text-grass" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.active ? "bg-grass" : "bg-gray-300"}`} />
                        {c.active ? "Active" : "Off"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn Icon={Pencil} title="Edit" onClick={() => openEdit(c)} />
                        <IconBtn Icon={Trash2} title="Delete" onClick={() => remove(c)} danger />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modal && (
        <Modal onClose={() => setModal(null)} title={modal.mode === "edit" ? "Edit Promo Code" : "New Promo Code"}>
          <div className="space-y-4">
            <Field label="Team member name" required>
              <Input value={modal.form.member_name} onChange={(v) => setField("member_name", v)} placeholder="e.g. Aisha Bello" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Email"><Input type="email" value={modal.form.member_email} onChange={(v) => setField("member_email", v)} placeholder="optional" /></Field>
              <Field label="Phone"><Input value={modal.form.member_phone} onChange={(v) => setField("member_phone", v)} placeholder="optional" /></Field>
            </div>
            <Field label="Code" hint={modal.mode === "create" ? "Leave blank to auto-generate from the name" : undefined}>
              <Input value={modal.form.code} onChange={(v) => setField("code", v.toUpperCase())} placeholder="AISHA10" className="font-mono uppercase" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Discount type" required>
                <select
                  value={modal.form.discount_type}
                  onChange={(e) => setField("discount_type", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed amount (₦)</option>
                </select>
              </Field>
              <Field label={modal.form.discount_type === "percent" ? "Percent off" : "Amount off (₦)"} required>
                <Input type="number" value={modal.form.discount_value} onChange={(v) => setField("discount_value", v)} placeholder={modal.form.discount_type === "percent" ? "10" : "20000"} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Max redemptions" hint="Blank = unlimited">
                <Input type="number" value={modal.form.max_redemptions} onChange={(v) => setField("max_redemptions", v)} placeholder="∞" />
              </Field>
              <Field label="Expires" hint="Optional">
                <Input type="date" value={modal.form.expires_at} onChange={(v) => setField("expires_at", v)} />
              </Field>
            </div>
            <Field label="Notes"><Input value={modal.form.notes} onChange={(v) => setField("notes", v)} placeholder="optional" /></Field>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={modal.form.active} onChange={(e) => setField("active", e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-semibold text-secondary">Active (code can be used right away)</span>
            </label>

            {err && <p className="text-sm text-rose-500 font-medium bg-rose-50 rounded-xl px-4 py-3">{err}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300">Cancel</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Code"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Orders drawer */}
      {orders && (
        <Modal onClose={() => setOrders(null)} title={`Orders via ${orders.code}`}>
          {orders.rows === null ? (
            <div className="py-10 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : orders.rows.length === 0 ? (
            <p className="py-8 text-center text-gray-400 text-sm">No orders attributed to this code yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-2 py-2 font-bold">Customer</th>
                    <th className="px-2 py-2 font-bold">State</th>
                    <th className="px-2 py-2 font-bold text-right">Discount</th>
                    <th className="px-2 py-2 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.rows.map((o) => (
                    <tr key={o.id} className="border-b border-gray-50">
                      <td className="px-2 py-2">
                        <p className="font-semibold text-secondary">{o.full_name}</p>
                        <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-GB")}</p>
                      </td>
                      <td className="px-2 py-2 text-gray-600">{o.state}</td>
                      <td className="px-2 py-2 text-right text-gray-600">{fmtNGN(Number(o.discount_ngn || 0))}</td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          o.payment_status === "fully_paid" ? "bg-grass/10 text-grass" : "bg-amber-50 text-amber-600"
                        }`}>
                          {o.payment_status === "fully_paid" ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}
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

function IconBtn({ Icon, title, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${danger ? "text-gray-400 hover:text-rose-500 hover:bg-rose-50" : "text-gray-400 hover:text-primary hover:bg-primary/5"}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-secondary mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
        {hint && <span className="text-gray-400 font-normal"> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm ${className}`}
    />
  );
}
