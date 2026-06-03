import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Blue Sands K12 AR Pedia <orders@bluesandsstem.com>";

export async function sendOrderConfirmation({ to, customerName, plan, deviceCount, amountPaid, paymentType, orderId }) {
  const depositNote =
    paymentType === "deposit"
      ? `<p style="color:#555;margin:8px 0">You've secured your order with a 30% deposit. When your order is ready, we'll send you a secure payment link for the remaining 70%.</p>`
      : "";

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
          ${depositNote}
          <p>Our team will review your order and reach out within 1–2 business days with an update.</p>
          <p style="color:#555">Questions? Reply to this email or reach us on WhatsApp.</p>
          <p style="margin-bottom:0">The Blue Sands STEM Labs Team</p>
        </div>
      </div>
    `,
  });
}

/**
 * Sends an "order ready" email pointing to /pay-balance — NOT a direct Paystack URL.
 * The customer must verify their email + order ref on that page before getting a payment link.
 * This prevents the Paystack URL from being forwarded or stolen from an inbox.
 */
export async function sendBalancePaymentLink({ to, customerName, plan, balanceNGN, siteUrl, orderId }) {
  const ref        = `BSL-${orderId.slice(0, 8).toUpperCase()}`;
  const payPageUrl = `${siteUrl}/pay-balance`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Your Order is Ready — Complete Payment | Blue Sands K12 AR Pedia`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Blue Sands K12 AR Pedia</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0">Your Order is Ready!</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <p style="font-size:18px;font-weight:bold;margin-top:0">Great news, ${customerName}!</p>
          <p>Your <strong>${plan}</strong> order is packaged and ready for delivery.</p>
          <div style="background:#f0f9ff;border:2px solid #0483e2;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
            <p style="margin:0;color:#555;font-size:14px">Balance Due</p>
            <p style="margin:8px 0 0;font-size:36px;font-weight:bold;color:#02345a">₦${Number(balanceNGN).toLocaleString("en-NG")}</p>
            <p style="margin:8px 0 0;color:#555;font-size:13px">Order Reference: <strong>${ref}</strong></p>
          </div>
          <p style="color:#555;font-size:14px">To pay securely, visit the link below and enter your order reference and email address. A secure Paystack checkout will be generated for you.</p>
          <div style="text-align:center;margin:24px 0">
            <a href="${payPageUrl}" style="background:#0483e2;color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">Complete Payment →</a>
          </div>
          <p style="color:#888;font-size:12px;text-align:center">Visit: ${payPageUrl}</p>
          <p style="color:#555">Once payment is confirmed, we will dispatch your order and send tracking information.</p>
          <p style="margin-bottom:0">The Blue Sands STEM Labs Team</p>
        </div>
      </div>
    `,
  });
}

export async function sendBalanceConfirmation({ to, customerName, plan, deviceCount, amountPaid, orderId }) {
  const ref = `BSL-${orderId.slice(0, 8).toUpperCase()}`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Full Payment Received — Your Order is Fully Paid | Blue Sands K12 AR Pedia`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#02345a">
        <div style="background:#02345a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Blue Sands K12 AR Pedia</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0">Payment Received in Full</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <p style="font-size:18px;font-weight:bold;margin-top:0">You're all set, ${customerName}!</p>
          <p>Your balance payment has been confirmed. Your <strong>${plan}</strong> order is now <strong>fully paid</strong> and our team will begin preparing it for dispatch.</p>
          <div style="background:#ecfdf5;border:2px solid #10b981;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0;color:#065f46;font-weight:bold;font-size:16px">✓ Order Fully Paid</p>
            <p style="margin:8px 0 0;color:#065f46;font-size:14px">Amount: ₦${Number(amountPaid).toLocaleString("en-NG")} · ${deviceCount} device${deviceCount !== 1 ? "s" : ""}</p>
            <p style="margin:4px 0 0;color:#065f46;font-size:13px">Reference: ${ref}</p>
          </div>
          <p style="color:#555">We will send you a separate email with tracking details once your order is dispatched. This typically happens within 1–3 business days.</p>
          <p style="color:#555">Questions? Reply to this email or reach us on WhatsApp.</p>
          <p style="margin-bottom:0">The Blue Sands STEM Labs Team</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminPaymentAlert({ paymentType, amountNGN, customerName, customerEmail, plan, deviceCount, orderId }) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const typeLabel = paymentType === "deposit" ? "30% Deposit" : paymentType === "balance" ? "70% Balance" : "Full Payment";
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
