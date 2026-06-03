/**
 * Provider-agnostic logistics abstraction.
 * When a logistics provider is chosen, implement their API calls here.
 * All external code uses only createShipment() and getTrackingStatus().
 */

const PROVIDER = process.env.LOGISTICS_PROVIDER; // e.g. "sendbox" | "gigl" | "kwik"
const API_KEY   = process.env.LOGISTICS_API_KEY;
const BASE_URL  = process.env.LOGISTICS_API_BASE_URL;

function authHeaders() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * Creates a shipment with the configured logistics provider.
 * @returns {{ tracking_number, tracking_url, estimated_delivery }}
 */
export async function createShipment({ preorderId, senderInfo, recipientInfo, parcelInfo }) {
  if (!PROVIDER || !API_KEY) {
    throw new Error("Logistics provider not configured. Set LOGISTICS_PROVIDER and LOGISTICS_API_KEY.");
  }

  // Add provider-specific implementation here when a provider is chosen.
  // The function should POST to the provider's shipment creation endpoint
  // and return a normalized response matching the shape below.

  // Example skeleton:
  // const res = await fetch(`${BASE_URL}/shipments`, {
  //   method: "POST",
  //   headers: authHeaders(),
  //   body: JSON.stringify({ /* provider-specific payload */ }),
  // });
  // const data = await res.json();
  // return {
  //   tracking_number: data.tracking_code,
  //   tracking_url:    data.tracking_url,
  //   estimated_delivery: data.estimated_delivery, // ISO date string
  // };

  throw new Error(`Logistics provider "${PROVIDER}" integration not yet implemented.`);
}

/**
 * Fetches the current tracking status from the logistics provider.
 * @returns {{ status, events: [{ timestamp, description, location }] }}
 */
export async function getTrackingStatus(trackingNumber) {
  if (!PROVIDER || !API_KEY) {
    return { status: "unknown", events: [] };
  }

  // Add provider-specific implementation here when a provider is chosen.
  // The function should GET the shipment status and return a normalized shape.

  // Example skeleton:
  // const res = await fetch(`${BASE_URL}/shipments/${trackingNumber}`, {
  //   headers: authHeaders(),
  // });
  // const data = await res.json();
  // return {
  //   status: normalizeStatus(data.status),
  //   events: (data.events || []).map(e => ({
  //     timestamp:   e.created_at,
  //     description: e.description,
  //     location:    e.location,
  //   })),
  // };

  return { status: "unknown", events: [] };
}

// Map provider-specific statuses to our internal values:
// processing | dispatched | in_transit | out_for_delivery | delivered | returned
function normalizeStatus(providerStatus) {
  // Populate when provider is chosen
  return providerStatus;
}
