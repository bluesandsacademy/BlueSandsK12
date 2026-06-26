import { supabaseAdmin } from "@/lib/supabase-admin";
import StoreOrdersClient from "@/components/admin/store-orders-client";

export const metadata = { title: "Store Orders — Admin" };

export default async function StoreOrdersPage() {
  const { data } = await supabaseAdmin
    .from("paystack_orders")
    .select("*, promo_codes(member_name, code)")
    .order("created_at", { ascending: false });

  return <StoreOrdersClient initial={data || []} />;
}
