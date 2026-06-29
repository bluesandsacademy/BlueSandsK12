const PAYSTACK_BASE = "https://api.paystack.co";

function headers() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
}

export function generateReference(preorderId) {
  return `BSL-${preorderId.slice(0, 8).toUpperCase()}-${Date.now()}`;
}

export async function initializeTransaction({ email, amountNGN, reference, metadata = {}, callbackUrl }) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      email,
      amount: Math.round(amountNGN * 100), // kobo
      reference,
      metadata,
      callback_url: callbackUrl,
    }),
  });

  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Paystack initialization failed");
  return json.data; // { authorization_url, access_code, reference }
}

export async function verifyTransaction(reference) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: headers(),
  });

  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Paystack verification failed");
  return json.data; // { status: "success"|"failed", amount, currency, metadata, ... }
}
