import { supabaseAdmin } from "@/lib/supabase-admin";
import { reconcileStorefrontOrders } from "@/lib/paystack-orders";
import StoreOrdersClient from "@/components/admin/store-orders-client";

export const metadata = { title: "Store Orders — Admin" };
export const dynamic = "force-dynamic"; // always fetch fresh + reconcile

export default async function StoreOrdersPage() {
  // Self-heal: pull any paid storefront orders Paystack has that we missed
  // (e.g. a webhook that never reached us). Best-effort — a Paystack hiccup must
  // never break the page.
  let syncError = null;
  try {
    await reconcileStorefrontOrders({ limit: 50 });
  } catch (e) {
    syncError = e.message;
    console.error("[store-orders] reconcile failed:", e);
  }

  const { data } = await supabaseAdmin
    .from("paystack_orders")
    .select("*, promo_codes(member_name, code)")
    .order("created_at", { ascending: false });

  return <StoreOrdersClient initial={data || []} syncError={syncError} />;
}
