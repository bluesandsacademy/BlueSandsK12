import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireAdmin } from "@/lib/admin-auth";
import { isValidEmail } from "@/lib/email-list";

// Reads an uploaded spreadsheet (.xlsx/.xls/.csv) and harvests it into clean,
// structured contacts by matching column HEADERS, so a sheet laid out as
// "SCHOOL NAMES | CONTACT NUMBR | EMAIL ADDRESS | SCHOOL ADDRESS | ..." maps the
// right cell to each field instead of jamming everything into a name.
//
// XLSX is binary (zipped XML), so it can't be read in the browser; parsing here
// also keeps the SheetJS bundle off the client.
export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_CONTACTS = 20000;

// Map a header cell to the field it represents. Order matters: "EMAIL ADDRESS"
// contains both "mail" and "address", so mail is checked first.
function classifyHeader(cell) {
  const h = String(cell || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!h) return null;
  if (/mail/.test(h)) return "email";
  if (/address/.test(h)) return "address";
  if (/(phone|mobile|tel|numb|number|whatsapp)/.test(h)) return "phone";
  if (/contacted/.test(h)) return "contacted";
  if (/name/.test(h)) return "name";
  return null;
}

// Find a header row in the first few rows: one that labels columns (no cell is
// itself an email) and names at least an email or name column. Returns
// { headerIdx, cols: { role: index }, labels: { role: headerText } } or null.
function findHeader(rows) {
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const row = (rows[i] || []).map((c) => String(c ?? "").trim());
    if (row.some(isValidEmail)) return null; // data, not headers
    const cols = {};
    const labels = {};
    row.forEach((cell, idx) => {
      const role = classifyHeader(cell);
      if (role && cols[role] === undefined) { cols[role] = idx; labels[role] = cell; }
    });
    if (cols.email !== undefined || cols.name !== undefined) return { headerIdx: i, cols, labels };
  }
  return null;
}

function firstEmailIn(row) {
  for (const cell of row) {
    const v = String(cell ?? "").trim();
    if (isValidEmail(v)) return v.toLowerCase();
  }
  return "";
}

export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function")
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "File is too large (5 MB max)." }, { status: 400 });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const seen = new Set();
    const contacts = [];
    let invalidEmail = 0;
    let noEmail = 0;
    let duplicates = 0;
    let columns = null; // header labels from the first sheet that had them

    for (const name of workbook.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
        header: 1,
        blankrows: false,
        defval: "",
      });
      if (!rows.length) continue;

      const header = findHeader(rows);
      const startIdx = header ? header.headerIdx + 1 : 0;
      const cols = header?.cols || {};
      if (header && !columns) columns = header.labels;

      const cellAt = (row, role) =>
        cols[role] !== undefined ? String(row[cols[role]] ?? "").trim() : "";

      for (let r = startIdx; r < rows.length; r++) {
        if (contacts.length >= MAX_CONTACTS) break;
        const row = rows[r] || [];

        // Prefer the mapped email column, but fall back to any email cell so a
        // mislabeled or shifted column still yields the address.
        let email = cellAt(row, "email").toLowerCase();
        if (!isValidEmail(email)) email = firstEmailIn(row);

        let contactName = cellAt(row, "name");
        if (!contactName && cols.name === undefined) {
          // Headerless: use the first non-email, non-numeric cell as the name.
          contactName =
            row.map((c) => String(c ?? "").trim())
               .find((v) => v && !isValidEmail(v) && !/^[\d\s()+-]+$/.test(v)) || "";
        }

        if (!email) { noEmail++; continue; }
        if (!isValidEmail(email)) { invalidEmail++; continue; }
        if (seen.has(email)) { duplicates++; continue; }
        seen.add(email);

        contacts.push({
          email,
          name: contactName,
          phone: cellAt(row, "phone"),
          address: cellAt(row, "address"),
          contacted: cellAt(row, "contacted"),
        });
      }
    }

    return NextResponse.json({
      data: {
        contacts,
        columns, // { email, name, phone, address, contacted } header labels, or null
        stats: {
          imported: contacts.length,
          invalidEmail,
          noEmail,
          duplicates,
        },
      },
    });
  } catch (err) {
    console.error("[POST /api/admin/campaign/parse-file]", err);
    return NextResponse.json(
      { error: "Could not read that file. Is it a valid .xlsx, .xls or .csv?" },
      { status: 400 }
    );
  }
}
