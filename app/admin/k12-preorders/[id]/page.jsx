import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import K12PreorderDetailClient from "@/components/admin/k12-preorder-detail-client";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Admin: Pre-Order ${id.slice(0, 8).toUpperCase()}` };
}

export default async function K12PreorderDetailPage({ params }) {
  const { id } = await params;

  const { data: preorder, error } = await supabaseAdmin
    .from("k12_platform_preorders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !preorder) notFound();

  return <K12PreorderDetailClient preorder={preorder} />;
}
