import { supabaseAdmin } from "@/lib/supabase-admin";
import ApplicationsClient from "@/components/admin/applications-client";

export const metadata = { title: "Applications — Admin" };

export default async function ApplicationsPage({ searchParams }) {
  const sp         = await searchParams;
  const status     = sp.status || "";
  const state      = sp.state || "";
  const occupation = sp.occupation || "";
  const search     = sp.q || "";
  const page       = parseInt(sp.page || "1", 10);
  const limit      = 20;
  const offset     = (page - 1) * limit;

  let query = supabaseAdmin
    .from("k12_distribution_applications")
    .select("id,full_name,email,phone,state,occupation,has_school_connections,status,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status)     query = query.eq("status", status);
  if (state)      query = query.eq("state", state);
  if (occupation) query = query.eq("occupation", occupation);
  if (search)     query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);

  const { data: applications, count } = await query;

  return (
    <ApplicationsClient
      initialApplications={applications || []}
      total={count || 0}
      page={page}
      limit={limit}
      filters={{ status, state, occupation, search }}
    />
  );
}
