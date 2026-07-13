// Pure scheduling maths for the AR Pedia campaign. No email bodies or Resend
// imports live here, so it is safe to import from both the browser (live send-time
// preview) and the server.
//
// The sequence is anchored to the EVENT (the Friday demo), which is day 14.
// Email 1 goes out on day 0 (14 days before), Email 29/30 on the event day. The
// admin picks the event date and every send time is derived from it, which keeps
// the relative copy ("one week today", "tomorrow", "48 hours to go") honest.

export const EVENT_DATE = process.env.CAMPAIGN_EVENT_DATE || "2026-07-24";
export const EVENT_TIME_LABEL = "10:00 AM (WAT)";
export const WAT_OFFSET = "+01:00"; // West Africa Time, no daylight saving
export const TOTAL_DAYS = 11;       // day 0 = first send (Mon 13 Jul) … day 11 = event day (Fri 24 Jul)

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// "Friday 24th July, 2026" from an ISO date. Computed at noon UTC so the calendar
// day never slips across a timezone boundary.
export function longDate(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${ordinal(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

// The calendar date (YYYY-MM-DD) an email with the given dayOffset sends on.
export function sendDateISO(dayOffset, eventDateISO = EVENT_DATE) {
  const d = new Date(`${eventDateISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (TOTAL_DAYS - dayOffset));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Full ISO 8601 send instant in WAT, e.g. "2026-07-24T07:30:00+01:00".
export function scheduledAtFor(email, eventDateISO = EVENT_DATE) {
  return `${sendDateISO(email.dayOffset, eventDateISO)}T${email.time}:00${WAT_OFFSET}`;
}

// The instant of 00:00 WAT tomorrow. Auto-scheduling starts here: today's emails
// are never scheduled, so the admin can decide to send them by hand instead.
export function tomorrowStartWAT(now = new Date()) {
  // Shift by +1h so the UTC calendar fields read WAT wall-clock, giving today's
  // WAT date; tomorrow's WAT midnight is one UTC hour before tomorrow's UTC midnight.
  const wat = new Date(now.getTime() + 60 * 60 * 1000);
  const y = wat.getUTCFullYear();
  const m = wat.getUTCMonth();
  const d = wat.getUTCDate();
  return new Date(Date.UTC(y, m, d + 1, 0, 0, 0) - 60 * 60 * 1000);
}
