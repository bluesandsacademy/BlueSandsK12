import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import PreordersClient from "@/components/admin/preorders-client";

export const metadata = { title: "Quote Requests — Admin" };

export default async function PreordersPage({ searchParams }) {
  const sp            = await searchParams;
  const orderStatus   = sp.order_status || "";
  const paymentStatus = sp.payment_status || "";
  const search        = sp.q || "";
  const page          = parseInt(sp.page || "1", 10);
  const limit         = 20;
  const offset        = (page - 1) * limit;

  let query = supabaseAdmin
    .from("k12_preorders")
    .select("id,full_name,email,phone,school_org_name,product_slug,device_count,order_status,payment_status,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (orderStatus)   query = query.eq("order_status", orderStatus);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);
  if (search)        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);

  const { data: orders, count, error } = await query;

  return (
    <PreordersClient
      initialOrders={orders || []}
      total={count || 0}
      page={page}
      limit={limit}
      filters={{ orderStatus, paymentStatus, search }}
    />
  );
}
