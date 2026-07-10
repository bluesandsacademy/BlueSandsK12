import CampaignClient from "@/components/admin/campaign-client";
import { listAudiences } from "@/lib/resend-broadcasts";

export const metadata = { title: "Email Campaign — Admin" };

// Always render at request time so the contact lists reflect live Resend data
// and the Resend API is never called during the build.
export const dynamic = "force-dynamic";

export default async function CampaignPage() {
  let initial = [];
  let loadError = "";
  try {
    initial = await listAudiences();
  } catch (err) {
    loadError = err.message || "Could not load your contact lists from Resend.";
  }

  return <CampaignClient initial={initial} loadError={loadError} />;
}
