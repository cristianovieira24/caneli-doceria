"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentStaff } from "@/lib/auth";
import type { AppRole } from "@/types/database";

async function requireOwner() {
  const staff = await getCurrentStaff();
  if (!staff || !staff.roles.includes("proprietario")) {
    throw new Error("Só o proprietário pode gerenciar usuários.");
  }
}

export type AddUserRoleState = { error?: string };

export async function addUserRole(_prev: AddUserRoleState, formData: FormData): Promise<AddUserRoleState> {
  await requireOwner();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "") as AppRole;
  if (!email || !["proprietario", "administrador", "editor"].includes(role)) {
    return { error: "Preencha e-mail e papel corretamente." };
  }

  const admin = createAdminClient();

  // The Admin API doesn't have a direct "get by email", so we page through
  // listUsers() looking for a match. Fine at this scale (a handful of
  // staff accounts); the person must already have created their Supabase
  // Auth account (e.g. via "Esqueci minha senha" or an invite) before
  // being assignable here.
  let userId: string | null = null;
  for (let page = 1; page <= 10 && !userId; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return { error: "Não foi possível buscar usuários agora." };
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) userId = match.id;
    if (data.users.length < 200) break;
  }

  if (!userId) {
    return {
      error:
        "Não encontramos essa conta ainda. A pessoa precisa acessar /admin/login pelo menos uma vez (ou usar 'Esqueci minha senha') antes de você atribuir um papel a ela.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  if (error) return { error: "Não foi possível salvar. " + error.message };

  revalidatePath("/admin/usuarios");
  return {};
}

export async function removeUserRole(id: string) {
  await requireOwner();
  const supabase = createClient();
  await supabase.from("user_roles").delete().eq("id", id);
  revalidatePath("/admin/usuarios");
}
