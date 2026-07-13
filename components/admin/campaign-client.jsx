"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send, Users, Plus, Upload, Trash2, Loader2, X, Check, AlertCircle,
  UserMinus, Mail, FileText, Download, Calendar, Clock, Info, HelpCircle,
} from "lucide-react";
import { parseContacts } from "@/lib/email-list";
import { scheduledAtFor, tomorrowStartWAT } from "@/lib/campaign-schedule";

// A full run of the campaign sends one email per contact for each email in the
// sequence. Surfaced so the admin sees the projected volume against their plan.
const SEQUENCE_LENGTH = 24;
const MONTHLY_SEND_CAP = 50000; // Resend Pro ($20) allowance
const IMPORT_CHUNK = 250;

export default function CampaignClient({ initial, loadError, sequence, defaultEventDate, defaultTestEmail }) {
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
    // Resend requires every account to keep at least one contact list, so the
    // only remaining one can't be deleted. Explain that instead of letting the
    // API return a cryptic error.
    if (audiences.length <= 1) {
      alert(
        `"${audience.name}" is your only contact list, and Resend keeps at least one per account, so it can't be deleted.\n\n` +
        `Create another list first, then you can remove this one.`
      );
      return;
    }
    if (!confirm(`Delete the list "${audience.name}" and all its contacts? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/campaign/audiences/${audience.id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = /last audience/i.test(body.error || "")
        ? "Resend keeps at least one contact list per account, so this one can't be deleted. Create another list first."
        : body.error || "Could not delete the list.";
      alert(msg);
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

      {/* The 30-email sequence + sending controls */}
      <CampaignPanel audiences={audiences} sequence={sequence} defaultEventDate={defaultEventDate} defaultTestEmail={defaultTestEmail} />

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
        <ContactsModal
          detail={detail}
          onClose={() => setDetail(null)}
          onCleared={() => loadCount(detail.audience)}
        />
      )}
    </div>
  );
}

const BROADCAST_TONE = {
  sent: "bg-grass/10 text-grass",
  queued: "bg-blue-50 text-blue-600",
  draft: "bg-gray-100 text-gray-500",
};

function fmtWhen(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZone: "Africa/Lagos",
  });
}

const GUIDE_STEPS = [
  { Icon: Users, title: "Build your list", body: "Import your schools under a contact list. Scheduling stays locked until the list has contacts in it." },
  { Icon: Calendar, title: "Set the demo date", body: "Every send time is worked out backwards from this date, so changing it shifts the whole schedule. Scheduling always begins tomorrow, so today's emails are left for you to send by hand." },
  { Icon: Mail, title: "Preview or send by hand", body: "Use Test on any row to email just that one to yourself. For emails already past their time (today or earlier), use Send now to send them to the whole list right away." },
  { Icon: Send, title: "Schedule once", body: "Click Schedule. Each upcoming email is handed to Resend as a scheduled send. This is the only manual step." },
  { Icon: Clock, title: "It sends itself", body: "Resend delivers every email at its listed time, even if this page is closed and the site is offline. Nothing else to do." },
];

function GuidePanel({ onClose }) {
  return (
    <div className="mx-5 sm:mx-6 my-4 rounded-2xl border border-primary/15 bg-primary/[0.04] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-primary/10">
        <p className="font-bold text-secondary flex items-center gap-2" style={{ fontFamily: "var(--font-jarkata)" }}>
          <HelpCircle className="w-4 h-4 text-primary" /> How the campaign sends
        </p>
        <button onClick={onClose} aria-label="Close guide" className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <ol className="px-5 py-4 space-y-4">
        {GUIDE_STEPS.map(({ Icon, title, body }, i) => (
          <li key={title} className="flex gap-3.5">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white border border-primary/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center tabular-nums">{i + 1}</span>
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="font-bold text-secondary text-sm">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="px-5 py-3 bg-primary/[0.06] border-t border-primary/10">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong className="text-secondary">To change or cancel a scheduled email:</strong> use Check status to see what Resend has queued. Editing the copy here does not affect emails that are already scheduled, you would remove and reschedule them.
        </p>
      </div>
    </div>
  );
}

// An info icon that reveals a short guide on hover, focus, or tap. Positioned to
// stay inside the panel card: `dir="down"` for controls near the top, `dir="up"`
// for the footer; `align` keeps it off the card's right edge.
function Hint({ text, dir = "down", align = "center", label = "More information" }) {
  const [open, setOpen] = useState(false);
  const vpos = dir === "up" ? "bottom-full mb-2" : "top-full mt-2";
  const hpos = align === "right" ? "right-0" : align === "left" ? "left-0" : "left-1/2 -translate-x-1/2";
  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="text-gray-300 hover:text-primary focus:text-primary focus:outline-none rounded-full"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          className={`absolute z-50 ${vpos} ${hpos} w-64 rounded-xl bg-secondary text-white text-[12px] leading-relaxed font-normal normal-case tracking-normal px-3.5 py-3 shadow-xl`}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function CampaignPanel({ audiences, sequence, defaultEventDate, defaultTestEmail }) {
  const [audienceId, setAudienceId] = useState(audiences[0]?.id || "");
  const [eventDate, setEventDate] = useState(defaultEventDate);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [err, setErr] = useState("");
  const [testFor, setTestFor] = useState(null); // email being test-sent
  const [broadcasts, setBroadcasts] = useState(null);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [sendingNow, setSendingNow] = useState("");   // key currently sending
  const [sentNow, setSentNow] = useState(() => new Set()); // keys sent this session
  // Contact count for the selected list, tagged with its id so a stale count
  // never shows against a different list (which also avoids resetting state
  // synchronously inside the effect).
  const [countFor, setCountFor] = useState({ id: null, total: null });
  // Captured once at mount so the timeline comparisons are stable and render-pure.
  const [now] = useState(() => Date.now());
  const [cutoff] = useState(() => tomorrowStartWAT().getTime()); // scheduling starts tomorrow

  // Keep the selected list valid if the audience list changes underneath us.
  const selected = audiences.find((a) => a.id === audienceId) || audiences[0];
  const effectiveAudienceId = selected?.id || "";

  // Load the selected list's contact count so we can warn before scheduling
  // (Resend rejects scheduling to an empty audience).
  useEffect(() => {
    if (!effectiveAudienceId) return;
    let ignore = false;
    fetch(`/api/admin/campaign/audiences/${effectiveAudienceId}`)
      .then((r) => r.json())
      .then((b) => { if (!ignore && b.data) setCountFor({ id: effectiveAudienceId, total: b.data.total }); })
      .catch(() => {});
    return () => { ignore = true; };
  }, [effectiveAudienceId]);
  const audienceCount = countFor.id === effectiveAudienceId ? countFor.total : null;
  const isEmpty = audienceCount === 0;

  const rows = (sequence || []).map((e) => {
    const scheduledAt = scheduledAtFor(e, eventDate);
    const t = new Date(scheduledAt).getTime();
    // "past" already gone, "today" not auto-scheduled (send by hand), "scheduled" tomorrow onward.
    const state = t < now ? "past" : t < cutoff ? "today" : "scheduled";
    return { ...e, scheduledAt, state };
  });
  const futureCount = rows.filter((r) => r.state === "scheduled").length;
  const skippedCount = rows.length - futureCount;

  const schedule = async () => {
    if (!effectiveAudienceId) return;
    if (!confirm(
      `Schedule ${futureCount} email${futureCount !== 1 ? "s" : ""} to "${selected.name}"? ` +
      `Each goes out automatically at its listed time. This creates live scheduled sends in Resend.`
    )) return;
    setScheduling(true);
    setErr("");
    setScheduleResult(null);
    try {
      const res = await fetch("/api/admin/campaign/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audienceId: effectiveAudienceId, eventDate }),
      });
      const body = await res.json();
      if (!res.ok) { setErr(body.error || "Could not schedule the campaign."); return; }
      setScheduleResult(body.data);
    } catch {
      setErr("Network error while scheduling.");
    } finally {
      setScheduling(false);
    }
  };

  const sendNow = async (row) => {
    if (!effectiveAudienceId) return;
    if (isEmpty) { alert("This list has no contacts yet. Import contacts before sending."); return; }
    if (!confirm(
      `Send email #${row.n} "${row.subject}" to all ${audienceCount} contact${audienceCount !== 1 ? "s" : ""} in "${selected.name}" right now? This can't be undone.`
    )) return;
    setSendingNow(row.key);
    setErr("");
    try {
      const res = await fetch("/api/admin/campaign/send-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audienceId: effectiveAudienceId, emailKey: row.key, eventDate }),
      });
      const body = await res.json();
      if (!res.ok) { alert(body.error || "Could not send the email."); return; }
      setSentNow((prev) => new Set(prev).add(row.key));
    } catch {
      alert("Network error while sending.");
    } finally {
      setSendingNow("");
    }
  };

  const loadBroadcasts = async () => {
    setLoadingBroadcasts(true);
    try {
      const res = await fetch("/api/admin/campaign/broadcasts");
      const body = await res.json();
      if (res.ok) setBroadcasts(body.data || []);
    } finally {
      setLoadingBroadcasts(false);
    }
  };

  if (!audiences.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>The email sequence</h2>
        <p className="text-sm text-gray-400 mt-1">Create a contact list and import your schools first, then you can schedule the 30-email campaign here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-black text-secondary text-base flex items-center gap-2" style={{ fontFamily: "var(--font-jarkata)" }}>
            <Send className="w-4 h-4 text-primary" /> The email sequence
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{sequence.length} emails. Schedule once, Resend delivers each one automatically at its time.</p>
        </div>
        <button
          onClick={() => setShowGuide((v) => !v)}
          aria-expanded={showGuide}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
            showGuide ? "bg-primary text-white" : "bg-primary/5 text-primary hover:bg-primary/10"
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Guide
        </button>
      </div>

      {showGuide && <GuidePanel onClose={() => setShowGuide(false)} />}

      {/* Controls */}
      <div className="px-5 py-4 sm:px-6 grid gap-4 sm:grid-cols-2 border-b border-gray-50">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            Send to list
            <Hint
              dir="down"
              align="left"
              label="About the send list"
              text="Every email goes to all contacts in this list. Import your schools first, scheduling is blocked while a list is empty. Anyone who unsubscribes is dropped by Resend automatically."
            />
          </label>
          <select
            value={effectiveAudienceId}
            onChange={(e) => setAudienceId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
          >
            {audiences.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <p className={`text-xs mt-1.5 ${isEmpty ? "text-rose-600 font-semibold" : "text-gray-400"}`}>
            {audienceCount === null
              ? "Checking contacts…"
              : isEmpty
                ? "No contacts yet, import some before scheduling."
                : `${audienceCount} contact${audienceCount !== 1 ? "s" : ""} in this list`}
          </p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Demo date
            <Hint
              dir="down"
              align="right"
              label="About the demo date"
              text="The day of the live demo. The whole sequence is timed backwards from here, so changing it shifts every send time. Scheduling always begins tomorrow, today's emails are left for you to send manually."
            />
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Sequence table */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50/95 backdrop-blur">
            <tr className="text-left text-gray-400 text-[11px] uppercase tracking-wider">
              <th className="px-4 py-2.5 font-bold">#</th>
              <th className="px-4 py-2.5 font-bold">Subject</th>
              <th className="px-4 py-2.5 font-bold whitespace-nowrap">Sends</th>
              <th className="px-4 py-2.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((r) => (
              <tr key={r.key} className={r.state !== "scheduled" ? "opacity-45" : ""}>
                <td className="px-4 py-2.5 text-gray-400 tabular-nums">{r.n}</td>
                <td className="px-4 py-2.5">
                  <p className="font-semibold text-secondary leading-tight">{r.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.angle}</p>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" /> {fmtWhen(r.scheduledAt)}
                  </span>
                  {r.state === "past" && <span className="block text-[11px] text-gray-400 font-semibold mt-0.5">past, will skip</span>}
                  {r.state === "today" && <span className="block text-[11px] text-amber-600 font-semibold mt-0.5">today, send manually</span>}
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  {sentNow.has(r.key) ? (
                    <span className="text-[11px] font-bold text-grass inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Sent to list</span>
                  ) : (
                    <div className="inline-flex items-center gap-3 justify-end">
                      {r.state !== "scheduled" && (
                        <button
                          onClick={() => sendNow(r)}
                          disabled={sendingNow === r.key || isEmpty}
                          title="Send this email to the whole list right now. Use this for the emails you missed before scheduling."
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline disabled:opacity-50"
                        >
                          {sendingNow === r.key ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><Send className="w-3.5 h-3.5" /> Send now</>}
                        </button>
                      )}
                      <button
                        onClick={() => setTestFor(r)}
                        title="Send just this one email to an address you choose, right now, without touching the list. Use it to preview."
                        className="text-xs font-semibold text-gray-400 hover:text-primary hover:underline"
                      >
                        Test
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer actions */}
      <div className="px-5 py-4 sm:px-6 border-t border-gray-100 space-y-3">
        {scheduleResult && (
          <div className="rounded-xl bg-grass/5 border border-grass/20 px-4 py-3 text-sm">
            <p className="font-bold text-grass flex items-center gap-1.5"><Check className="w-4 h-4" /> Sequence scheduled</p>
            <p className="text-gray-600 text-xs mt-1">
              {(scheduleResult.summary.scheduled || 0)} scheduled
              {scheduleResult.summary.skipped ? `, ${scheduleResult.summary.skipped} left for today or earlier (send manually)` : ""}
              {scheduleResult.summary.failed ? `, ${scheduleResult.summary.failed} failed` : ""}.
            </p>
            {scheduleResult.summary.failed > 0 && (
              <ul className="mt-1.5 text-xs text-rose-600 list-disc pl-4">
                {scheduleResult.results.filter((r) => r.status === "failed").map((r) => (
                  <li key={r.key}>#{r.n}: {r.error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {err && <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{err}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            {futureCount} of {rows.length} will be scheduled from tomorrow{skippedCount > 0 ? `, ${skippedCount} today or earlier (send those manually)` : ""}.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadBroadcasts}
              disabled={loadingBroadcasts}
              title="Shows every broadcast in Resend and whether it is a draft, scheduled, or already sent."
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 disabled:opacity-60"
            >
              {loadingBroadcasts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />} Check status
            </button>
            <button
              onClick={schedule}
              disabled={scheduling || futureCount === 0 || !effectiveAudienceId || isEmpty}
              title={isEmpty
                ? "This list has no contacts yet. Import contacts before scheduling."
                : "Creates a scheduled send in Resend for each upcoming email. After this, delivery is automatic, even if this site is offline. To change or cancel one, remove it in Resend."}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 shadow-lg shadow-primary/20"
            >
              {scheduling ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling…</> : <><Send className="w-4 h-4" /> Schedule {futureCount} email{futureCount !== 1 ? "s" : ""}</>}
            </button>
          </div>
        </div>

        {broadcasts && (
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-50 max-h-56 overflow-y-auto">
            {broadcasts.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">No broadcasts in Resend yet.</p>
            ) : broadcasts.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                <span className="text-secondary truncate">{b.name || "(untitled)"}</span>
                <span className="flex items-center gap-2 shrink-0">
                  {b.scheduled_at && <span className="text-xs text-gray-400">{fmtWhen(b.scheduled_at)}</span>}
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${BROADCAST_TONE[b.status] || "bg-gray-100 text-gray-500"}`}>{b.status}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {testFor && (
        <TestModal email={testFor} eventDate={eventDate} defaultTestEmail={defaultTestEmail} onClose={() => setTestFor(null)} />
      )}
    </div>
  );
}

function TestModal({ email, eventDate, defaultTestEmail, onClose }) {
  const [to, setTo] = useState(defaultTestEmail || "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const send = async () => {
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/campaign/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, emailKey: email.key, eventDate }),
      });
      const body = await res.json();
      if (!res.ok) { setErr(body.error || "Could not send the test."); return; }
      setSent(true);
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal title="Send a test" onClose={onClose}>
      {sent ? (
        <div className="space-y-4">
          <p className="flex items-center gap-2 text-grass font-bold"><Check className="w-5 h-5" /> Test sent to {to}</p>
          <p className="text-sm text-gray-500">Check the inbox (and spam) for email #{email.n}.</p>
          <div className="flex justify-end"><button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90">Done</button></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email #{email.n}</p>
            <p className="text-sm font-semibold text-secondary mt-1">{email.subject}</p>
          </div>
          <Field label="Send test to" hint="a real inbox you can open">
            <input
              autoFocus type="email" value={to}
              onChange={(e) => setTo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && to && send()}
              placeholder="you@bluesandsk12.com"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
            />
          </Field>
          {err && <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300">Cancel</button>
            <button onClick={send} disabled={sending || !to} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Mail className="w-4 h-4" /> Send test</>}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

const COLUMN_ROLE_LABELS = { email: "Email", name: "School / name", phone: "Phone", address: "Address", contacted: "Previously contacted" };

function ImportModal({ audience, onClose, onDone }) {
  const [text, setText] = useState("");
  const [fileData, setFileData] = useState(null); // { contacts:[{email,name,phone,address,contacted}], columns, stats }
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(null); // { done, total }
  const [result, setResult] = useState(null);      // { added, skipped, failed }
  const [err, setErr] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const parsed = parseContacts(text);

  // The contacts we'll actually send, normalised to Resend's shape. A harvested
  // spreadsheet uses the whole school name as the greeting name (first_name);
  // typed input keeps its first/last split.
  const contacts = fileData
    ? fileData.contacts.map((c) => ({ email: c.email, firstName: c.name || "", lastName: "" }))
    : parsed.valid;

  const count = contacts.length;
  const projectedSends = count * SEQUENCE_LENGTH;
  const overCap = projectedSends > MONTHLY_SEND_CAP;

  const onFile = async (file) => {
    if (!file) return;
    setErr("");
    // Spreadsheets and CSVs are harvested by column on the server; a plain .txt
    // is treated as freeform paste.
    const structured = /\.(xlsx|xls|csv)$/i.test(file.name);
    setFileLoading(true);
    try {
      if (structured) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/campaign/parse-file", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) { setErr(data.error || "Could not read that file."); return; }
        if (!data.data.contacts.length) { setErr("No email addresses were found in that file."); return; }
        setText("");
        setFileData(data.data);
      } else {
        const content = await file.text();
        if (content?.trim()) setText((prev) => (prev ? `${prev}\n${content}` : content));
      }
    } catch {
      setErr("Could not read that file.");
    } finally {
      setFileLoading(false);
    }
  };

  const downloadCsv = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["School / name", "Email", "Phone", "Address", "Previously contacted"];
    const lines = [header.join(",")].concat(
      fileData.contacts.map((c) => [c.name, c.email, c.phone, c.address, c.contacted].map(esc).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${audience.name.replace(/[^\w-]+/g, "-")}-contacts.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    if (count === 0) return;
    setImporting(true);
    setErr("");
    setResult(null);
    const totals = { added: 0, skipped: 0, failed: 0 };
    setProgress({ done: 0, total: count });

    try {
      for (let i = 0; i < contacts.length; i += IMPORT_CHUNK) {
        const chunk = contacts.slice(i, i + IMPORT_CHUNK);
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
        setProgress({ done: Math.min(i + IMPORT_CHUNK, contacts.length), total: count });
      }
      setResult(totals);
      await onDone();
    } catch {
      setErr("Network error during import.");
    } finally {
      setImporting(false);
    }
  };

  const capNote = count > 0 && (
    <div className={`text-xs pt-1 ${overCap ? "text-rose-600 font-semibold" : "text-gray-400"}`}>
      {overCap
        ? `Sending all ${SEQUENCE_LENGTH} emails to ${count} contacts is ${projectedSends.toLocaleString()} sends, over your ${MONTHLY_SEND_CAP.toLocaleString()}/month plan.`
        : `Full ${SEQUENCE_LENGTH}-email run ≈ ${projectedSends.toLocaleString()} sends (plan allows ${MONTHLY_SEND_CAP.toLocaleString()}/month).`}
    </div>
  );

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
      ) : fileData ? (
        // --- Harvested spreadsheet: show the organized data before importing ---
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 font-semibold text-secondary">
              <Check className="w-4 h-4 text-grass" /> {fileData.stats.imported} contact{fileData.stats.imported !== 1 ? "s" : ""} harvested
            </div>
            <button onClick={() => { setFileData(null); setErr(""); }} className="text-xs font-semibold text-gray-400 hover:text-primary hover:underline">
              Use a different file or paste
            </button>
          </div>

          {fileData.columns && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(fileData.columns).map(([role, label]) => (
                <span key={role} className="inline-flex items-center gap-1 rounded-lg bg-primary/5 text-primary text-[11px] font-semibold px-2 py-1">
                  {COLUMN_ROLE_LABELS[role] || role} <span className="text-primary/50">←</span> {label}
                </span>
              ))}
            </div>
          )}

          <div className="max-h-64 overflow-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="text-left text-gray-400 text-[11px] uppercase tracking-wider">
                  <th className="px-3 py-2 font-bold">School / name</th>
                  <th className="px-3 py-2 font-bold">Email</th>
                  {fileData.columns?.phone && <th className="px-3 py-2 font-bold">Phone</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fileData.contacts.slice(0, 100).map((c) => (
                  <tr key={c.email}>
                    <td className="px-3 py-2 text-secondary">{c.name || <span className="text-gray-300">—</span>}</td>
                    <td className="px-3 py-2 text-gray-600 font-mono text-xs">{c.email}</td>
                    {fileData.columns?.phone && <td className="px-3 py-2 text-gray-500 text-xs">{c.phone || "—"}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fileData.contacts.length > 100 && (
            <p className="text-xs text-gray-400 -mt-2">Showing the first 100 of {fileData.contacts.length}. All will be imported.</p>
          )}

          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500 space-y-1">
            {(fileData.stats.duplicates > 0 || fileData.stats.invalidEmail > 0 || fileData.stats.noEmail > 0) && (
              <p>
                Skipped: {fileData.stats.duplicates} duplicate{fileData.stats.duplicates !== 1 ? "s" : ""}, {fileData.stats.invalidEmail} invalid email{fileData.stats.invalidEmail !== 1 ? "s" : ""}, {fileData.stats.noEmail} row{fileData.stats.noEmail !== 1 ? "s" : ""} with no email.
              </p>
            )}
            <p>Only the email and school name are sent to Resend. Phone and address are harvested for your records.</p>
            {capNote}
          </div>

          <button onClick={downloadCsv} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <Download className="w-4 h-4" /> Download the cleaned list as CSV
          </button>

          {progress && importing && <Progress progress={progress} />}
          {err && <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{err}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} disabled={importing} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 disabled:opacity-60">Cancel</button>
            <button onClick={runImport} disabled={importing || count === 0} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60">
              {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</> : `Import ${count} contact${count !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      ) : (
        // --- Paste / freeform ---
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Paste emails (one per line), or upload an Excel, CSV or text file. Names are optional:
            <span className="text-gray-400"> bare emails, Name &lt;email&gt;, or email, first, last all work.</span>
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder={"aisha@school.edu.ng\nAisha Bello <aisha@school.edu.ng>\nbursar@school.edu.ng, Musa, Ibrahim"}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm font-mono resize-y"
          />

          <label className={`inline-flex items-center gap-2 text-sm font-semibold cursor-pointer hover:underline ${fileLoading ? "text-gray-400 pointer-events-none" : "text-primary"}`}>
            {fileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {fileLoading ? "Reading file…" : "Upload an Excel, CSV or .txt file"}
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/plain"
              className="hidden"
              disabled={fileLoading}
              onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }}
            />
          </label>

          {text.trim() && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-secondary">
                <Check className="w-4 h-4 text-grass" /> {count} valid email{count !== 1 ? "s" : ""}
              </div>
              {parsed.duplicates > 0 && (
                <div className="text-gray-500 text-xs">{parsed.duplicates} duplicate{parsed.duplicates !== 1 ? "s" : ""} removed</div>
              )}
              {parsed.invalid.length > 0 && (
                <div className="flex items-center gap-2 text-amber-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" /> {parsed.invalid.length} line{parsed.invalid.length !== 1 ? "s" : ""} skipped (not a valid email)
                </div>
              )}
              {capNote}
            </div>
          )}

          {progress && importing && <Progress progress={progress} />}
          {err && <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{err}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} disabled={importing} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 disabled:opacity-60">Cancel</button>
            <button onClick={runImport} disabled={importing || count === 0} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60">
              {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</> : `Import ${count || ""} contact${count !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Because contacts are processed in rate-limited chunks (and a list under ~250
// is a single chunk), real `done` updates arrive rarely, so a raw bar would sit
// at 0 then jump. Instead we ease a time-based estimate that moves quickly at
// the start and decelerates near the end, held below 100% until the work truly
// finishes, while any real chunk completion pulls the bar forward.
function Progress({ progress, verb = "Adding", active = true, estMsPerItem = 500 }) {
  const total = progress?.total || 0;
  const done = progress?.done || 0;
  const [start] = useState(() => Date.now()); // captured once at mount
  const barRef = useRef(null);
  const phaseRef = useRef(null);
  const pctRef = useRef(null);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Animate imperatively (no React state) so the frequent updates never trigger
  // re-renders; the DOM bar and label are the "external system" the effect syncs.
  useEffect(() => {
    const estDuration = Math.max(1000, total * estMsPerItem);
    const paint = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / estDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3);          // fast start, slow finish
      const realFraction = total ? done / total : 0;  // real progress wins if ahead
      const target = Math.max(eased * 0.9, realFraction);
      const p = Math.round((active ? Math.min(target, 0.97) : 1) * 100);
      if (barRef.current) barRef.current.style.width = `${p}%`;
      if (phaseRef.current) {
        phaseRef.current.textContent = !active
          ? "Done"
          : p < 25 ? "Getting started…"
          : p < 65 ? `${verb.toLowerCase()} your contacts…`
          : p < 90 ? "Almost there…"
          : "Wrapping up…";
      }
      if (pctRef.current) pctRef.current.textContent = `${p}%`;
    };
    paint();
    const id = setInterval(paint, 180);
    return () => clearInterval(id);
  }, [done, total, active, estMsPerItem, start, verb]);

  return (
    <div className="space-y-1.5">
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-primary rounded-full"
          style={{ width: "4%", transition: reduce ? "none" : "width 0.25s ease-out" }}
        />
      </div>
      <p className="text-xs text-gray-400 text-center capitalize">
        <span ref={phaseRef}>Getting started…</span>{" "}
        <span ref={pctRef} className="tabular-nums text-gray-500 font-semibold">4%</span>
      </p>
    </div>
  );
}

function ContactsModal({ detail, onClose, onCleared }) {
  const { audience } = detail;
  const [data, setData] = useState(detail.data);
  const [clearing, setClearing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [err, setErr] = useState("");

  // Follow the parent's fetch (data arrives null, then populated) using the
  // "adjust state during render" pattern rather than an effect. Local edits
  // (clearing) survive because they don't change `detail.data`'s identity.
  const [seenData, setSeenData] = useState(detail.data);
  if (seenData !== detail.data) {
    setSeenData(detail.data);
    setData(detail.data);
  }

  const clearAll = async () => {
    if (!data?.contacts?.length) return;
    if (!confirm(
      `Remove all ${data.total} contact${data.total !== 1 ? "s" : ""} from "${audience.name}"? ` +
      `The list stays, the contacts are deleted. This can't be undone.`
    )) return;

    setClearing(true);
    setErr("");
    const targets = data.contacts.map((c) => ({ id: c.id, email: c.email }));
    setProgress({ done: 0, total: targets.length });
    let failed = 0;
    try {
      for (let i = 0; i < targets.length; i += IMPORT_CHUNK) {
        const chunk = targets.slice(i, i + IMPORT_CHUNK);
        const res = await fetch(`/api/admin/campaign/audiences/${audience.id}/clear`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contacts: chunk }),
        });
        const body = await res.json();
        if (!res.ok) { setErr(body.error || "Could not clear the list."); break; }
        failed += body.data.failed;
        setProgress({ done: Math.min(i + IMPORT_CHUNK, targets.length), total: targets.length });
      }
      setData({ contacts: [], total: 0, subscribed: 0, unsubscribed: 0 });
      if (failed > 0) setErr(`${failed} contact${failed !== 1 ? "s" : ""} could not be removed. Reopen the list and try again.`);
      onCleared?.();
    } catch {
      setErr("Network error while clearing.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <Modal title={audience.name} onClose={clearing ? undefined : onClose}>
      {data === null ? (
        <div className="py-10 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      ) : data.contacts.length === 0 ? (
        <p className="py-8 text-center text-gray-400 text-sm">
          {err ? err : "This list has no contacts yet. Use Import to add some."}
        </p>
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

          {progress && clearing && <Progress progress={progress} verb="Removing" />}
          {err && <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{err}</p>}

          <div className="flex justify-end pt-1 border-t border-gray-50">
            <button
              onClick={clearAll}
              disabled={clearing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-rose-200 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-60 mt-3"
            >
              {clearing ? <><Loader2 className="w-4 h-4 animate-spin" /> Removing…</> : <><Trash2 className="w-4 h-4" /> Remove all contacts</>}
            </button>
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
