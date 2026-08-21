"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentStaff } from "@/lib/auth";
import { getRequestBaseUrl } from "@/lib/request-url";
import type { AppRole } from "@/types/database";

async function requireOwner() {
  const staff = await getCurrentStaff();
  if (!staff || !staff.roles.includes("proprietario")) {
    throw new Error("Só o proprietário pode gerenciar usuários.");
  }
  return staff;
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
  // listUsers() looking for a match. Fine at this scale (a small staff).
  let userId: string | null = null;
  for (let page = 1; page <= 10 && !userId; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return { error: "Não foi possível buscar usuários agora." };
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) userId = match.id;
    if (data.users.length < 200) break;
  }

  if (!userId) {
    const baseUrl = getRequestBaseUrl();
    if (!baseUrl) return { error: "A URL pública do site não está configurada." };

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${baseUrl}/admin/redefinir-senha`,
    });
    if (error || !data.user) {
      return { error: "Não foi possível criar e convidar essa conta agora." };
    }
    userId = data.user.id;
  }

  const supabase = createClient();
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  if (error?.code === "23505") {
    return { error: "Essa pessoa já possui esse papel." };
  }
  if (error) return { error: "Não foi possível salvar. " + error.message };

  revalidatePath("/admin/usuarios");
  return {};
}

export async function removeUserRole(id: string) {
  const staff = await requireOwner();
  const supabase = createClient();

  const { data: target, error: targetError } = await supabase
    .from("user_roles")
    .select("id, user_id, role")
    .eq("id", id)
    .single();
  if (targetError || !target) throw new Error("Papel não encontrado.");

  if (target.role === "proprietario") {
    if (target.user_id === staff.userId) {
      throw new Error("Você não pode remover seu próprio acesso de proprietário.");
    }

    const { count, error: countError } = await supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "proprietario");
    if (countError) throw new Error("Não foi possível verificar os proprietários atuais.");
    if ((count ?? 0) <= 1) {
      throw new Error("O painel precisa manter pelo menos um proprietário.");
    }
  }

  const { error } = await supabase.from("user_roles").delete().eq("id", id);
  if (error) throw new Error("Não foi possível remover o acesso. " + error.message);
  revalidatePath("/admin/usuarios");
}
