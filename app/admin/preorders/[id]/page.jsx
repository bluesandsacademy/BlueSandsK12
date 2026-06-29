import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import PreorderDetailClient from "@/components/admin/preorder-detail-client";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Order ${id.slice(0, 8).toUpperCase()} — Admin` };
}

export default async function PreorderDetailPage({ params }) {
  const { id } = await params;

  const [
    { data: preorder, error },
    { data: payments },
    { data: tracking },
    { data: emails },
  ] = await Promise.all([
    supabaseAdmin.from("k12_preorders").select("*").eq("id", id).single(),
    supabaseAdmin.from("order_payments").select("*").eq("preorder_id", id).order("created_at"),
    supabaseAdmin.from("order_tracking").select("*").eq("preorder_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabaseAdmin.from("email_logs").select("*").eq("preorder_id", id).order("created_at", { ascending: false }),
  ]);

  if (error || !preorder) notFound();

  return (
    <PreorderDetailClient
      preorder={preorder}
      payments={payments || []}
      tracking={tracking}
      emails={emails || []}
    />
  );
}
