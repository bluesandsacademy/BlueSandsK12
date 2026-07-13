import CampaignClient from "@/components/admin/campaign-client";
import { listAudiences } from "@/lib/resend-broadcasts";
import { sequenceSummary } from "@/lib/campaign-emails";
import { EVENT_DATE } from "@/lib/campaign-schedule";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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

  // Default test previews to the signed-in admin's own inbox.
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <CampaignClient
      initial={initial}
      loadError={loadError}
      sequence={sequenceSummary()}
      defaultEventDate={EVENT_DATE}
      defaultTestEmail={user?.email || ""}
    />
  );
}
