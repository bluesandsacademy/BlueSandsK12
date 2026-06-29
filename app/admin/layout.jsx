import AdminShell from "@/components/admin/admin-shell";

export const metadata = { title: "Admin — Blue Sands STEM Labs" };

export default async function AdminLayout({ children }) {
  // Login page renders its own full-page UI — skip the shell
  return <AdminShell>{children}</AdminShell>;
}
