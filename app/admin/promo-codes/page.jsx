import { supabaseAdmin } from "@/lib/supabase-admin";
import PromoCodesClient from "@/components/admin/promo-codes-client";

export const metadata = { title: "Promo Codes — Admin" };

export default async function PromoCodesPage() {
  const [{ data: codes }, { data: stats }] = await Promise.all([
    supabaseAdmin.from("promo_codes").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("promo_code_stats").select("id, paid_orders, gross_revenue_ngn, total_discount_ngn"),
  ]);

  const byId = Object.fromEntries((stats || []).map((s) => [s.id, s]));
  const initial = (codes || []).map((c) => ({
    ...c,
    paid_orders:        Number(byId[c.id]?.paid_orders ?? 0),
    gross_revenue_ngn:  Number(byId[c.id]?.gross_revenue_ngn ?? 0),
    total_discount_ngn: Number(byId[c.id]?.total_discount_ngn ?? 0),
  }));

  return <PromoCodesClient initial={initial} />;
}
