// Server-only helper around Resend's Audiences, Contacts and Broadcasts APIs.
//
// The blast campaign lives entirely in Resend: an "audience" is the contact
// list, and Resend handles unsubscribes, List-Unsubscribe headers and scheduled
// sending for us. This module is the thin layer the admin routes call.
//
// Notes on this SDK version (resend 6.12.4):
//   - `resend.audiences` is an alias for `resend.segments`
//     (`create({ name })`, `list()`, `get(id)`, `remove(id)`).
//   - Every method returns `{ data, error }` and does NOT throw on API errors,
//     so we surface `error` ourselves.
import { Resend } from "resend";
import { CAMPAIGN_SEQUENCE, findCampaignEmail, renderCampaignEmail } from "@/lib/campaign-emails";
import { scheduledAtFor, EVENT_DATE, tomorrowStartWAT } from "@/lib/campaign-schedule";

let _client;
function client() {
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY || "");
  return _client;
}

// Marketing blasts send from their own domain so they never share deliverability
// reputation with transactional order emails (which send from bluesandsstem.com).
export const CAMPAIGN_FROM =
  process.env.CAMPAIGN_FROM_EMAIL || "Blue Sands K12 AR Pedia <hello@bluesandsk12.com>";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function unwrap(result, action) {
  const { data, error } = result;
  if (error) throw new Error(error.message || `Could not ${action}.`);
  return data;
}

// --- Audiences (lists) ------------------------------------------------------

export async function listAudiences() {
  const data = unwrap(await client().audiences.list(), "list audiences");
  return data?.data || [];
}

export async function createAudience(name) {
  return unwrap(await client().audiences.create({ name }), "create the list");
}

export async function removeAudience(id) {
  unwrap(await client().audiences.remove(id), "delete the list");
}

// --- Contacts ---------------------------------------------------------------

// Follows the cursor until the whole audience is fetched. Fine for the modest
// list sizes this campaign targets (a full 30-email run stays under the Resend
// Pro monthly cap at roughly 1,600 contacts).
export async function listContacts(audienceId) {
  const all = [];
  let after;
  // Guard against an unbounded loop if the API ever stops advancing the cursor.
  for (let page = 0; page < 200; page++) {
    const data = unwrap(
      await client().contacts.list({ audienceId, limit: 100, ...(after ? { after } : {}) }),
      "list contacts"
    );
    const rows = data?.data || [];
    all.push(...rows);
    if (!data?.has_more || rows.length === 0) break;
    after = rows[rows.length - 1]?.id;
    if (!after) break;
  }
  return all;
}

export async function countContacts(audienceId) {
  const contacts = await listContacts(audienceId);
  return {
    total: contacts.length,
    unsubscribed: contacts.filter((c) => c.unsubscribed).length,
  };
}

async function addOne(audienceId, contact, attempt = 0) {
  const { error } = await client().contacts.create({
    audienceId,
    email: contact.email,
    firstName: contact.firstName || undefined,
    lastName: contact.lastName || undefined,
  });
  if (!error) return "added";

  const message = String(error.message || "").toLowerCase();
  const rateLimited = error.statusCode === 429 || message.includes("rate");
  if (rateLimited && attempt < 4) {
    await sleep(1000 * (attempt + 1));
    return addOne(audienceId, contact, attempt + 1);
  }
  // Resend treats a re-added address as an error; that's a skip, not a failure.
  if (message.includes("already")) return "skipped";
  return "failed";
}

// Adds contacts while staying under Resend's request rate limit. Small
// concurrency + a pause between batches, with 429 backoff handled per contact.
export async function addContacts(audienceId, contacts) {
  let added = 0;
  let skipped = 0;
  let failed = 0;
  const CONCURRENCY = 2;

  for (let i = 0; i < contacts.length; i += CONCURRENCY) {
    const batch = contacts.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((c) => addOne(audienceId, c)));
    for (const r of results) {
      if (r === "added") added++;
      else if (r === "skipped") skipped++;
      else failed++;
    }
    if (i + CONCURRENCY < contacts.length) await sleep(550);
  }

  return { added, skipped, failed };
}

async function removeOne(audienceId, contact, attempt = 0) {
  const payload = contact.id
    ? { audienceId, id: contact.id }
    : { audienceId, email: contact.email };
  const { error } = await client().contacts.remove(payload);
  if (!error) return "removed";

  const message = String(error.message || "").toLowerCase();
  const rateLimited = error.statusCode === 429 || message.includes("rate");
  if (rateLimited && attempt < 4) {
    await sleep(1000 * (attempt + 1));
    return removeOne(audienceId, contact, attempt + 1);
  }
  // Already gone counts as done, not a failure.
  if (message.includes("not found")) return "removed";
  return "failed";
}

// Removes the given contacts from an audience, keeping the audience itself.
// Same pacing/backoff as adding, since it is one delete call per contact.
export async function removeContacts(audienceId, contacts) {
  let removed = 0;
  let failed = 0;
  const CONCURRENCY = 2;

  for (let i = 0; i < contacts.length; i += CONCURRENCY) {
    const batch = contacts.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((c) => removeOne(audienceId, c)));
    for (const r of results) {
      if (r === "removed") removed++;
      else failed++;
    }
    if (i + CONCURRENCY < contacts.length) await sleep(550);
  }

  return { removed, failed };
}

// --- Broadcasts (the campaign) ----------------------------------------------

// One broadcast per email, each scheduled at its computed WAT send time. Emails
// whose time has already passed are skipped rather than scheduled in the past.
// Two API calls per email (create draft, then schedule), paced to stay under the
// rate limit.
export async function scheduleCampaign({ audienceId, eventDateISO = EVENT_DATE }) {
  // Resend refuses to schedule a broadcast to an empty audience, so guard up
  // front rather than creating drafts that can't be scheduled.
  const probe = unwrap(await client().contacts.list({ audienceId, limit: 1 }), "check the list");
  if (!probe?.data?.length) {
    throw new Error("This list has no contacts yet. Import contacts before scheduling the campaign.");
  }

  // Scheduling always begins tomorrow: today's (and any past) emails are left for
  // the admin to send by hand, never auto-scheduled.
  const cutoff = tomorrowStartWAT().getTime();
  const results = [];

  for (const email of CAMPAIGN_SEQUENCE) {
    const scheduledAt = scheduledAtFor(email, eventDateISO);
    const label = { n: email.n, key: email.key, subject: email.subject, scheduledAt };

    if (new Date(scheduledAt).getTime() < cutoff) {
      results.push({ ...label, status: "skipped" });
      continue;
    }

    let createdId;
    try {
      const created = unwrap(
        await client().broadcasts.create({
          name: `AR Pedia ${String(email.n).padStart(2, "0")} — ${email.angle}`,
          from: CAMPAIGN_FROM,
          subject: email.subject,
          previewText: email.previewText,
          html: renderCampaignEmail(email, { eventDateISO }),
          audienceId,
        }),
        "create the broadcast"
      );
      createdId = created.id;
      unwrap(await client().broadcasts.send(created.id, { scheduledAt }), "schedule the broadcast");
      results.push({ ...label, status: "scheduled", id: created.id });
    } catch (err) {
      // A failed schedule would otherwise leave an unscheduled draft behind.
      if (createdId) {
        try { await client().broadcasts.remove(createdId); } catch { /* best effort */ }
      }
      results.push({ ...label, status: "failed", error: err.message });
    }

    await sleep(400);
  }

  return results;
}

// Sends one campaign email to the whole audience right now (as a broadcast), for
// the emails whose scheduled time has already passed. Same empty-audience guard
// and draft cleanup as scheduling.
export async function sendCampaignNow({ audienceId, emailKey, eventDateISO = EVENT_DATE }) {
  const probe = unwrap(await client().contacts.list({ audienceId, limit: 1 }), "check the list");
  if (!probe?.data?.length) {
    throw new Error("This list has no contacts yet. Import contacts before sending.");
  }
  const email = findCampaignEmail(emailKey);
  if (!email) throw new Error("That email could not be found.");

  const created = unwrap(
    await client().broadcasts.create({
      name: `AR Pedia ${String(email.n).padStart(2, "0")} — ${email.angle} (sent manually)`,
      from: CAMPAIGN_FROM,
      subject: email.subject,
      previewText: email.previewText,
      html: renderCampaignEmail(email, { eventDateISO }),
      audienceId,
    }),
    "create the broadcast"
  );
  try {
    unwrap(await client().broadcasts.send(created.id), "send the broadcast");
  } catch (err) {
    try { await client().broadcasts.remove(created.id); } catch { /* best effort */ }
    throw err;
  }
  return { id: created.id };
}

// Sends a single email to one address immediately, as a normal email (not a
// broadcast), so the admin can preview it without touching the audience. The
// unsubscribe merge tag only resolves inside broadcasts, so it is neutralised.
export async function sendCampaignTest({ to, emailKey, eventDateISO = EVENT_DATE }) {
  const email = findCampaignEmail(emailKey) || CAMPAIGN_SEQUENCE[0];
  const html = renderCampaignEmail(email, { eventDateISO }).replace(
    /\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}/g,
    "#"
  );
  return unwrap(
    await client().emails.send({
      from: CAMPAIGN_FROM,
      to,
      subject: `[TEST] ${email.subject}`,
      html,
    }),
    "send the test email"
  );
}

export async function listBroadcasts() {
  const data = unwrap(await client().broadcasts.list(), "list broadcasts");
  return data?.data || [];
}
