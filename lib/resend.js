import { Resend } from "resend";

// Lazily instantiated so missing env var doesn't crash the build
let _resend;
const getResend = () => {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || "");
  return _resend;
};
export const resend = { emails: { send: (...args) => getResend().emails.send(...args) } };

const FROM = "Blue Sands K12 AR Pedia <orders@bluesandstemlabs.com>";

// Where every form/admin notification lands. Env can override, but this default
// guarantees submissions reach the admin inbox even if the env var is unset.
const ADMIN_INBOX =
  process.env.ADMIN_NOTIFICATION_EMAIL || "info@bluesandstemlabs.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Escape user-supplied text before dropping it into email HTML (free-text
// fields like an application's "why apply" can contain < & " characters).
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]),
  );

export async function sendOrderConfirmation({ to, customerName, plan, deviceCount, amountPaid, orderId }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Order Confirmed — ${plan} | Blue Sands K12 AR Pedia`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Blue Sands K12 AR Pedia</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0">Order Confirmation</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <p style="font-size:18px;font-weight:bold;margin-top:0">Hello ${customerName},</p>
          <p>Your preorder has been received and payment confirmed. Here's a summary:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f9fafb"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Plan</td><td style="padding:10px;border:1px solid #e5e7eb">${plan}</td></tr>
            <tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Devices</td><td style="padding:10px;border:1px solid #e5e7eb">${deviceCount}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Amount Paid</td><td style="padding:10px;border:1px solid #e5e7eb">₦${Number(amountPaid).toLocaleString("en-NG")}</td></tr>
            <tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Order Reference</td><td style="padding:10px;border:1px solid #e5e7eb">BSL-${orderId.slice(0,8).toUpperCase()}</td></tr>
          </table>
          <p>Our team will review your order and reach out within 1–2 business days with an update.</p>
          <p style="color:#555">Questions? Reply to this email or reach us on WhatsApp.</p>
          <p style="margin-bottom:0">The Blue Sands STEM Labs Team</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminPaymentAlert({ amountNGN, customerName, customerEmail, plan, deviceCount, orderId }) {
  const adminEmail = ADMIN_INBOX;

  const typeLabel = "Full Payment";
  const ref = `BSL-${orderId.slice(0, 8).toUpperCase()}`;

  return resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[K12 AR Pedia] New Payment — ${typeLabel} from ${customerName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:20px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:18px">💳 New Payment Received</h1>
        </div>
        <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;width:40%">Payment Type</td><td style="padding:10px 12px;border:1px solid #e5e7eb"><strong style="color:#0483e2">${typeLabel}</strong></td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Amount</td><td style="padding:10px 12px;border:1px solid #e5e7eb;font-size:18px;font-weight:bold">₦${Number(amountNGN).toLocaleString("en-NG")}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Customer</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${customerName} &lt;${customerEmail}&gt;</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Plan</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${plan}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Devices</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${deviceCount}</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Order Ref</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${ref}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/preorders/${orderId}"
              style="background:#0483e2;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block">
              View Order in Admin →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendContactMessage({ name, email, phone, message }) {
  const adminEmail = ADMIN_INBOX;

  return resend.emails.send({
    from: FROM,
    to: adminEmail,
    replyTo: email,
    subject: `[K12 AR Pedia] New Contact Message from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:20px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:18px">📨 New Contact Message</h1>
        </div>
        <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;width:32%">Name</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${name}</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Email</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${email}</td></tr>
            ${phone ? `<tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Phone</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${phone}</td></tr>` : ""}
          </table>
          <div style="margin-top:16px">
            <p style="font-weight:600;margin:0 0 6px">Message</p>
            <p style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;white-space:pre-wrap;margin:0">${message}</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendTrackingNotification({ to, customerName, plan, trackingNumber, trackingUrl, provider, trackPageUrl }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Your Order is On the Way! — Blue Sands K12 AR Pedia`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Blue Sands K12 AR Pedia</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0">Your Order is On the Way!</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <p style="font-size:18px;font-weight:bold;margin-top:0">It's on its way, ${customerName}!</p>
          <p>Your <strong>${plan}</strong> has been dispatched. Here are your tracking details:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f9fafb"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Tracking Number</td><td style="padding:10px;border:1px solid #e5e7eb">${trackingNumber}</td></tr>
            ${provider ? `<tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Courier</td><td style="padding:10px;border:1px solid #e5e7eb">${provider}</td></tr>` : ""}
          </table>
          <div style="text-align:center;margin:24px 0">
            <a href="${trackPageUrl}" style="background:#0483e2;color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">Track Your Order</a>
          </div>
          ${trackingUrl ? `<p style="text-align:center"><a href="${trackingUrl}" style="color:#0483e2">Track directly with ${provider || "courier"}</a></p>` : ""}
          <p style="color:#555">Questions? Reply to this email or reach us on WhatsApp.</p>
          <p style="margin-bottom:0">The Blue Sands STEM Labs Team</p>
        </div>
      </div>
    `,
  });
}

// ── Bulk preorder / quote request ───────────────────────────────────────────
// The quote form takes no payment, so these fire on submission: an ack to the
// requester and an alert to the admin inbox.

export async function sendPreorderAcknowledgement({ to, customerName, orgName, productName, quantity, orderId }) {
  const ref = `BSL-${String(orderId).slice(0, 8).toUpperCase()}`;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `We've received your quote request`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Blue Sands K12 AR Pedia</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0">Quote Request Received</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <p style="font-size:18px;font-weight:bold;margin-top:0">Hello ${esc(customerName)},</p>
          <p>Thanks for requesting a quote for <strong>${esc(orgName)}</strong>. We have it, and here is what you sent:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f9fafb"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Kit</td><td style="padding:10px;border:1px solid #e5e7eb">${esc(productName)}</td></tr>
            <tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Sets</td><td style="padding:10px;border:1px solid #e5e7eb">${esc(quantity)}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600">Reference</td><td style="padding:10px;border:1px solid #e5e7eb">${ref}</td></tr>
          </table>
          <p>Our team will review this and send a tailored quote and invoice within 1 to 2 business days.</p>
          <p style="color:#555">Questions? Reply to this email or reach us on WhatsApp.</p>
          <p style="margin-bottom:0">The Blue Sands STEM Labs Team</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminPreorderAlert({ orgName, customerName, email, phone, whatsapp, productName, quantity, state, city, orderId }) {
  const ref = `BSL-${String(orderId).slice(0, 8).toUpperCase()}`;
  return resend.emails.send({
    from: FROM,
    to: ADMIN_INBOX,
    replyTo: email,
    subject: `[K12 AR Pedia] New Quote Request — ${orgName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:20px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:18px">📦 New Bulk Quote Request</h1>
        </div>
        <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;width:38%">Organisation</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(orgName)}</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Contact</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(customerName)} &lt;${esc(email)}&gt;</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Phone / WhatsApp</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(phone)} / ${esc(whatsapp)}</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Kit</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(productName)}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Sets</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(quantity)}</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Location</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(city)}, ${esc(state)}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Reference</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${ref}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center">
            <a href="${SITE_URL}/admin/preorders/${orderId}" style="background:#0483e2;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block">View in Admin →</a>
          </div>
        </div>
      </div>
    `,
  });
}

// ── Distribution / partner application ──────────────────────────────────────

export async function sendApplicationAcknowledgement({ to, applicantName }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `We've received your application`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Blue Sands STEM Labs</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0">Application Received</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <p style="font-size:18px;font-weight:bold;margin-top:0">Hello ${esc(applicantName)},</p>
          <p>Thanks for applying to join the Blue Sands distribution network. Your application is in, and our team will review it and be in touch within 3 business days.</p>
          <p style="color:#555">Questions in the meantime? Reply to this email or reach us on WhatsApp.</p>
          <p style="margin-bottom:0">The Blue Sands STEM Labs Team</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminApplicationAlert({ applicantName, email, phone, whatsapp, state, occupation, hasSchoolConnections, networkSize, whyApply, cvUrl, applicationId }) {
  const occupationLabel = String(occupation || "").replace(/_/g, " ");
  const connections = hasSchoolConnections
    ? `Yes${networkSize ? ` (${esc(networkSize)} schools)` : ""}`
    : "No";
  return resend.emails.send({
    from: FROM,
    to: ADMIN_INBOX,
    replyTo: email,
    subject: `[K12 AR Pedia] New Distribution Application — ${applicantName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:20px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:18px">🤝 New Distribution Application</h1>
        </div>
        <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;width:38%">Applicant</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(applicantName)} &lt;${esc(email)}&gt;</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Phone / WhatsApp</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(phone)} / ${esc(whatsapp)}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">State</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${esc(state)}</td></tr>
            <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">Occupation</td><td style="padding:10px 12px;border:1px solid #e5e7eb;text-transform:capitalize">${esc(occupationLabel)}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">School connections</td><td style="padding:10px 12px;border:1px solid #e5e7eb">${connections}</td></tr>
            ${cvUrl ? `<tr><td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">CV</td><td style="padding:10px 12px;border:1px solid #e5e7eb"><a href="${esc(cvUrl)}" style="color:#0483e2">${esc(cvUrl)}</a></td></tr>` : ""}
          </table>
          <div style="margin-top:16px">
            <p style="font-weight:600;margin:0 0 6px">Why they applied</p>
            <p style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;white-space:pre-wrap;margin:0">${esc(whyApply)}</p>
          </div>
          <div style="margin-top:20px;text-align:center">
            <a href="${SITE_URL}/admin/applications/${applicationId}" style="background:#0483e2;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block">View in Admin →</a>
          </div>
        </div>
      </div>
    `,
  });
}
