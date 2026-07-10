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
