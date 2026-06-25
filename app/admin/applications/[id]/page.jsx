import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import ApplicationDetailClient from "@/components/admin/application-detail-client";

export default async function ApplicationDetailPage({ params }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("k12_distribution_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  return <ApplicationDetailClient application={data} />;
}
