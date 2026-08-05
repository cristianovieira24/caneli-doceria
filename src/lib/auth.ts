import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/types/database";

export interface CurrentStaff {
  userId: string;
  email: string | null;
  roles: AppRole[];
}

/** Returns the signed-in staff member and their roles, or null if not signed in. */
export async function getCurrentStaff(): Promise<CurrentStaff | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleRows } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const roles = (roleRows ?? []).map((r) => r.role as AppRole);

  return { userId: user.id, email: user.email ?? null, roles };
}

export function hasAtLeast(roles: AppRole[], required: AppRole): boolean {
  if (roles.includes("proprietario")) return true;
  if (required === "administrador") return roles.includes("administrador");
  if (required === "editor") return roles.includes("administrador") || roles.includes("editor");
  return roles.includes(required);
}
