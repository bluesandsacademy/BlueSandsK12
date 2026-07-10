// Parse a pasted blob or CSV of contacts into a deduped, validated list.
//
// This runs in BOTH the browser (for a live preview as the admin pastes) and on
// the server (as the authority before contacts are sent to Resend), so it must
// stay dependency-free and side-effect-free.
//
// Accepted, mixed freely, one contact per line:
//   aisha@school.edu.ng                     bare email
//   Aisha Bello <aisha@school.edu.ng>       name + email
//   aisha@school.edu.ng, Aisha, Bello       CSV row (email auto-detected)
//   Aisha; Bello; aisha@school.edu.ng       ; or tab separated too
//   a@x.edu, b@y.edu                        several bare emails on one line

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || "").trim());
}

// Returns { valid: [{ email, firstName, lastName }], invalid: [line], duplicates }
export function parseContacts(raw) {
  const seen = new Set();
  const valid = [];
  const invalid = [];
  let duplicates = 0;

  const push = (emailRaw, nameRaw) => {
    const email = String(emailRaw || "").trim().toLowerCase();
    if (!isValidEmail(email)) {
      invalid.push(emailRaw);
      return;
    }
    if (seen.has(email)) {
      duplicates++;
      return;
    }
    seen.add(email);
    const [firstName = "", ...rest] = String(nameRaw || "")
      .replace(/["']/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    valid.push({ email, firstName, lastName: rest.join(" ") });
  };

  for (const line of String(raw || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // "Name <email>" form.
    const angle = trimmed.match(/^(.*?)<\s*([^>]+?)\s*>\s*$/);
    if (angle) {
      push(angle[2], angle[1]);
      continue;
    }

    const fields = trimmed.split(/[,;\t]+/).map((f) => f.trim()).filter(Boolean);
    const emails = fields.filter(isValidEmail);

    if (emails.length === 0) {
      invalid.push(trimmed);
    } else if (emails.length === 1) {
      // Everything that isn't the email is treated as the name.
      const name = fields.filter((f) => !isValidEmail(f)).join(" ");
      push(emails[0], name);
    } else {
      // Several addresses on one line: keep them all, names can't be attributed.
      for (const email of emails) push(email, "");
    }
  }

  return { valid, invalid, duplicates };
}
