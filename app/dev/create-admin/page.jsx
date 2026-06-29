"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  CheckCircle2, Loader2, Shield, Users, Plus, KeyRound,
  RefreshCw, Eye, EyeOff, AlertCircle,
} from "lucide-react";

// ── Shared helpers ──────────────────────────────────────────────────────────

function Field({ label, type = "text", value, onChange, placeholder, showToggle, onToggle, required = true }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm pr-11 transition-colors"
        />
        {showToggle !== undefined && (
          <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, message }) {
  if (!message) return null;
  if (status === "error")
    return (
      <div className="flex items-center gap-2 text-rose-700 text-sm font-medium bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">
        <AlertCircle className="w-4 h-4 shrink-0" /> {message}
      </div>
    );
  return (
    <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
      <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
    </div>
  );
}

// ── Create Admin tab ─────────────────────────────────────────────────────────

function CreateAdminTab({ secret }) {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPw, setShowPw]   = useState(false);
  const [status, setStatus]   = useState("idle");
  const [message, setMessage] = useState("");
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setStatus("error"); setMessage("Passwords do not match."); return;
    }
    setStatus("loading"); setMessage("");
    try {
      const res = await fetch("/api/dev/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-secret": secret },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("success");
      setMessage(`Admin created: ${data.user.email}`);
      setForm({ email: "", password: "", confirm: "" });
    } catch (err) {
      setStatus("error"); setMessage(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email address" type="email" value={form.email} onChange={set("email")} placeholder="admin@bluesandsstem.com" />
      <Field label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} showToggle={showPw} onToggle={() => setShowPw((v) => !v)} />
      <Field label="Confirm Password" type={showPw ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" />

      <StatusBadge status={status} message={message} />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Plus className="w-4 h-4" /> Create Admin Account</>}
      </button>
    </form>
  );
}

// ── Manage Admins tab ────────────────────────────────────────────────────────

function ManageAdminsTab({ secret }) {
  const [admins, setAdmins]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [changing, setChanging] = useState(null); // user_id being edited
  const [newPw, setNewPw]       = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [pwStatus, setPwStatus] = useState({ id: null, ok: null, msg: "" });

  const loadAdmins = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/dev/list-admins", {
        headers: { "x-dev-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load admins");
      setAdmins(data.admins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [secret]);

  const changePassword = async (userId) => {
    if (!newPw || newPw.length < 8) {
      setPwStatus({ id: userId, ok: false, msg: "Password must be at least 8 characters." });
      return;
    }
    setPwStatus({ id: userId, ok: null, msg: "" });
    try {
      const res = await fetch("/api/dev/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-secret": secret },
        body: JSON.stringify({ user_id: userId, new_password: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPwStatus({ id: userId, ok: true, msg: `Password updated for ${data.email}` });
      setChanging(null); setNewPw("");
    } catch (err) {
      setPwStatus({ id: userId, ok: false, msg: err.message });
    }
  };

  return (
    <div className="space-y-4">
      {admins === null ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Admins not loaded yet.</p>
          <button
            onClick={loadAdmins}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {loading ? "Loading…" : "Load Admins"}
          </button>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-600">{admins.length} admin{admins.length !== 1 ? "s" : ""}</p>
            <button
              onClick={loadAdmins}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-2">
            {admins.map((admin) => (
              <div key={admin.id} className="border-2 border-gray-100 rounded-xl overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black shrink-0">
                    {admin.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-secondary truncate">{admin.email}</p>
                    <p className="text-[11px] text-gray-400">
                      Created {new Date(admin.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {admin.last_sign_in_at
                        ? ` · Last login ${new Date(admin.last_sign_in_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                        : " · Never signed in"}
                    </p>
                  </div>
                  <button
                    onClick={() => { setChanging(changing === admin.id ? null : admin.id); setNewPw(""); setPwStatus({ id: null, ok: null, msg: "" }); }}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary border border-gray-200 hover:border-primary rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Change PW
                  </button>
                </div>

                {/* Inline password change */}
                {changing === admin.id && (
                  <div className="bg-gray-50 border-t-2 border-gray-100 px-4 py-3 space-y-3">
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="New password (min 8 chars)"
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {pwStatus.id === admin.id && pwStatus.msg && (
                      <p className={`text-xs font-semibold ${pwStatus.ok ? "text-emerald-600" : "text-rose-600"}`}>
                        {pwStatus.msg}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => changePassword(admin.id)}
                        className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-secondary transition-colors"
                      >
                        Update Password
                      </button>
                      <button
                        onClick={() => { setChanging(null); setNewPw(""); }}
                        className="px-4 py-2 border-2 border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DevAdminPage() {
  const [tab, setTab]       = useState("create");
  const [secret, setSecret] = useState("");
  const [secretSaved, setSecretSaved] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-lg">
        {/* Header card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
          {/* Top bar */}
          <div
            className="px-8 pt-8 pb-6"
            style={{ background: "linear-gradient(135deg, #02345a 0%, #011e40 100%)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                <Image src="/android-chrome-192x192.png" alt="Blue Sands" width={28} height={28} className="object-contain" />
              </div>
              <div>
                <p className="text-white font-black text-base leading-tight">Blue Sands STEM Labs</p>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Developer Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Shield className="w-4 h-4 text-white/50" />
              <p className="text-white/70 text-sm">Manage admin accounts · Requires DEV_ADMIN_SECRET</p>
            </div>
          </div>

          {/* Secret field */}
          <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Dev Secret (required for all operations)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={secret}
                onChange={(e) => { setSecret(e.target.value); setSecretSaved(false); }}
                placeholder="Value of DEV_ADMIN_SECRET env var"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setSecretSaved(true)}
                className="px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-primary transition-colors"
              >
                {secretSaved ? <CheckCircle2 className="w-4 h-4" /> : "Set"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[
              { id: "create",  label: "Create Admin",   Icon: Plus },
              { id: "manage",  label: "Manage Admins",  Icon: Users },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-colors border-b-2
                  ${tab === id ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-gray-600"}`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-8 py-6">
            {tab === "create"
              ? <CreateAdminTab secret={secret} />
              : <ManageAdminsTab secret={secret} />
            }
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          This page is not linked anywhere — keep the URL private.
        </p>
      </div>
    </div>
  );
}
