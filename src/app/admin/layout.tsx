import { getCurrentStaff } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

// The admin area depends on the current Supabase session and must never be
// generated as a static page during the Vercel build.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff();

  return <AdminShell staff={staff}>{children}</AdminShell>;
}
