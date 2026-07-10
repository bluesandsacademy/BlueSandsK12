"use client";

import { useState } from "react";
import {
  Send, Users, Plus, Upload, Trash2, Loader2, X, Check, AlertCircle,
  UserMinus, Mail, FileText,
} from "lucide-react";
import { parseContacts } from "@/lib/email-list";

// A full run of the campaign sends one email per contact for each email in the
// sequence. Surfaced so the admin sees the projected volume against their plan.
const SEQUENCE_LENGTH = 30;
const MONTHLY_SEND_CAP = 50000; // Resend Pro ($20) allowance
const IMPORT_CHUNK = 250;

export default function CampaignClient({ initial, loadError }) {
  const [audiences, setAudiences] = useState(initial || []);
  const [error, setError] = useState(loadError || "");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingList, setSavingList] = useState(false);
  const [counts, setCounts] = useState({});        // audienceId -> { total, subscribed, unsubscribed }
  const [importFor, setImportFor] = useState(null); // audience being imported into
  const [detail, setDetail] = useState(null);       // { audience, data } | { audience, data: null }

  const refresh = async () => {
    const res = await fetch("/api/admin/campaign/audiences");
    const body = await res.json();
    if (res.ok) setAudiences(body.data || []);
  };

  const loadCount = async (audience) => {
    const res = await fetch(`/api/admin/campaign/audiences/${audience.id}`);
    const body = await res.json();
    if (res.ok) setCounts((c) => ({ ...c, [audience.id]: body.data }));
  };

  const createList = async () => {
    if (!newName.trim()) return;
    setSavingList(true);
    setError("");
    try {
      const res = await fetch("/api/admin/campaign/audiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const body = await res.json();
      if (!res.ok) { setError(body.error || "Could not create the list."); return; }
      setCreating(false);
      setNewName("");
      await refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSavingList(false);
    }
  };

  const removeList = async (audience) => {
    if (!confirm(`Delete the list "${audience.name}" and all its contacts? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/campaign/audiences/${audience.id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || "Could not delete the list.");
      return;
    }
    setAudiences((list) => list.filter((a) => a.id !== audience.id));
  };

  const openDetail = async (audience) => {
    setDetail({ audience, data: null });
    const res = await fetch(`/api/admin/campaign/audiences/${audience.id}`);
    const body = await res.json();
    setDetail({ audience, data: res.ok ? body.data : { contacts: [], total: 0, subscribed: 0, unsubscribed: 0 } });
    if (res.ok) setCounts((c) => ({ ...c, [audience.id]: body.data }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
            Email Campaign
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Build the contact lists for the AR Pedia campaign.
          </p>
        </div>
        <button
          onClick={() => { setCreating(true); setError(""); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> New List
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lists */}
      {audiences.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No contact lists yet</p>
          <p className="text-gray-400 text-sm mt-1">Create a list, then paste or upload the school emails you want to reach.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {audiences.map((a) => {
            const c = counts[a.id];
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-secondary truncate">{a.name}</p>
                      <p className="text-xs text-gray-400">
                        {c ? `${c.total} contact${c.total !== 1 ? "s" : ""}` : (
                          <button onClick={() => loadCount(a)} className="text-primary hover:underline">Load count</button>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeList(a)}
                    title="Delete list"
                    className="p-1.5 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {c && (
                  <div className="flex gap-4 mt-4 text-xs">
                    <span className="inline-flex items-center gap-1 text-grass font-semibold">
                      <Mail className="w-3.5 h-3.5" /> {c.subscribed} subscribed
                    </span>
                    {c.unsubscribed > 0 && (
                      <span className="inline-flex items-center gap-1 text-gray-400 font-semibold">
                        <UserMinus className="w-3.5 h-3.5" /> {c.unsubscribed} opted out
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => { setImportFor(a); setError(""); }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Import
                  </button>
                  <button
                    onClick={() => openDetail(a)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {creating && (
        <Modal title="New Contact List" onClose={() => setCreating(false)}>
          <div className="space-y-4">
            <Field label="List name" hint="e.g. Lagos private schools">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createList()}
                placeholder="Lagos private schools"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
              />
            </Field>
            {error && <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setCreating(false)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300">Cancel</button>
              <button onClick={createList} disabled={savingList || !newName.trim()} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60">
                {savingList ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Create List"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {importFor && (
        <ImportModal
          audience={importFor}
          onClose={() => setImportFor(null)}
          onDone={async () => { await loadCount(importFor); }}
        />
      )}

      {detail && (
        <ContactsModal detail={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}

function ImportModal({ audience, onClose, onDone }) {
  const [text, setText] = useState("");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(null); // { done, total }
  const [result, setResult] = useState(null);      // { added, skipped, failed }
  const [err, setErr] = useState("");

  const parsed = parseContacts(text);
  const validCount = parsed.valid.length;
  const projectedSends = validCount * SEQUENCE_LENGTH;
  const overCap = projectedSends > MONTHLY_SEND_CAP;

  const onFile = async (file) => {
    if (!file) return;
    const content = await file.text();
    setText((prev) => (prev ? `${prev}\n${content}` : content));
  };

  const runImport = async () => {
    if (validCount === 0) return;
    setImporting(true);
    setErr("");
    setResult(null);
    const totals = { added: 0, skipped: 0, failed: 0 };
    const all = parsed.valid;
    setProgress({ done: 0, total: all.length });

    try {
      for (let i = 0; i < all.length; i += IMPORT_CHUNK) {
        const chunk = all.slice(i, i + IMPORT_CHUNK);
        const res = await fetch(`/api/admin/campaign/audiences/${audience.id}/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contacts: chunk }),
        });
        const body = await res.json();
        if (!res.ok) { setErr(body.error || "Import failed partway through."); break; }
        totals.added += body.data.added;
        totals.skipped += body.data.skipped;
        totals.failed += body.data.failed;
        setProgress({ done: Math.min(i + IMPORT_CHUNK, all.length), total: all.length });
      }
      setResult(totals);
      await onDone();
    } catch {
      setErr("Network error during import.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal title={`Import into "${audience.name}"`} onClose={importing ? undefined : onClose}>
      {result ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-grass">
            <Check className="w-5 h-5" />
            <p className="font-bold">Import complete</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Tally label="Added" value={result.added} tone="grass" />
            <Tally label="Already there" value={result.skipped} tone="gray" />
            <Tally label="Failed" value={result.failed} tone={result.failed ? "rose" : "gray"} />
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90">Done</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Paste emails (one per line), or upload a CSV / text file. Names are optional:
            <span className="text-gray-400"> bare emails, Name &lt;email&gt;, or email, first, last all work.</span>
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder={"aisha@school.edu.ng\nAisha Bello <aisha@school.edu.ng>\nbursar@school.edu.ng, Musa, Ibrahim"}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm font-mono resize-y"
          />

          <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer hover:underline">
            <FileText className="w-4 h-4" />
            Upload a CSV or .txt file
            <input
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>

          {text.trim() && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-secondary">
                <Check className="w-4 h-4 text-grass" /> {validCount} valid email{validCount !== 1 ? "s" : ""}
              </div>
              {parsed.duplicates > 0 && (
                <div className="text-gray-500 text-xs">{parsed.duplicates} duplicate{parsed.duplicates !== 1 ? "s" : ""} removed</div>
              )}
              {parsed.invalid.length > 0 && (
                <div className="flex items-center gap-2 text-amber-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" /> {parsed.invalid.length} line{parsed.invalid.length !== 1 ? "s" : ""} skipped (not a valid email)
                </div>
              )}
              {validCount > 0 && (
                <div className={`text-xs pt-1 ${overCap ? "text-rose-600 font-semibold" : "text-gray-400"}`}>
                  {overCap
                    ? `Sending all ${SEQUENCE_LENGTH} emails to ${validCount} contacts is ${projectedSends.toLocaleString()} sends, over your ${MONTHLY_SEND_CAP.toLocaleString()}/month plan.`
                    : `Full ${SEQUENCE_LENGTH}-email run ≈ ${projectedSends.toLocaleString()} sends (plan allows ${MONTHLY_SEND_CAP.toLocaleString()}/month).`}
                </div>
              )}
            </div>
          )}

          {progress && importing && (
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 text-center">Adding {progress.done} of {progress.total}…</p>
            </div>
          )}

          {err && <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{err}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} disabled={importing} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 disabled:opacity-60">Cancel</button>
            <button onClick={runImport} disabled={importing || validCount === 0} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60">
              {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</> : `Import ${validCount || ""} contact${validCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function ContactsModal({ detail, onClose }) {
  const { audience, data } = detail;
  return (
    <Modal title={audience.name} onClose={onClose}>
      {data === null ? (
        <div className="py-10 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      ) : data.contacts.length === 0 ? (
        <p className="py-8 text-center text-gray-400 text-sm">This list has no contacts yet. Use Import to add some.</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <Tally label="Total" value={data.total} tone="gray" />
            <Tally label="Subscribed" value={data.subscribed} tone="grass" />
            <Tally label="Opted out" value={data.unsubscribed} tone="gray" />
          </div>
          <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
            {data.contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="text-secondary truncate">{c.email}</p>
                  {(c.first_name || c.last_name) && (
                    <p className="text-xs text-gray-400 truncate">{[c.first_name, c.last_name].filter(Boolean).join(" ")}</p>
                  )}
                </div>
                {c.unsubscribed && <span className="text-xs text-gray-400 shrink-0 inline-flex items-center gap-1"><UserMinus className="w-3.5 h-3.5" /> opted out</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Tally({ label, value, tone }) {
  const toneCls = tone === "grass" ? "text-grass" : tone === "rose" ? "text-rose-500" : "text-secondary";
  return (
    <div className="rounded-xl bg-gray-50 py-3">
      <p className={`text-2xl font-black ${toneCls}`} style={{ fontFamily: "var(--font-jarkata)" }}>{value}</p>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>{title}</h2>
          {onClose && <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-secondary mb-1.5">
        {label}
        {hint && <span className="text-gray-400 font-normal"> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}
