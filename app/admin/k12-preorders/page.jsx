import { supabaseAdmin } from "@/lib/supabase-admin";
import K12PreordersClient from "@/components/admin/k12-preorders-client";
import { summarisePreorders } from "@/lib/k12-preorder";

export const metadata = { title: "Admin: K12 Pre-Orders" };

export default async function K12PreordersPage({ searchParams }) {
  const sp     = await searchParams;
  const status = sp.status || "";
  const search = sp.q || "";
  const page   = parseInt(sp.page || "1", 10);
  const limit  = 20;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("k12_platform_preorders")
    .select(
      "id,school_org_name,contact_person,job_title,email,phone,package,student_licenses,student_count,status,created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (search)
    query = query.or(
      `school_org_name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
    );

  // Stat cards read the whole table (package + status only), independent of the
  // current filter or page.
  const [{ data: rows, count }, { data: allRows }] = await Promise.all([
    query,
    supabaseAdmin.from("k12_platform_preorders").select("package,status"),
  ]);

  const stats = summarisePreorders(allRows || []);

  return (
    <K12PreordersClient
      initialRows={rows || []}
      total={count || 0}
      page={page}
      limit={limit}
      filters={{ status, search }}
      stats={stats}
    />
  );
}
