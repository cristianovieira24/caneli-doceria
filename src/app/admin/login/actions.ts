"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRequestBaseUrl } from "@/lib/request-url";

export type LoginState = { error?: string; success?: boolean };

function getSafeAdminDestination(value: string) {
  return value.startsWith("/admin") && !value.startsWith("//")
    ? value
    : "/admin";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = getSafeAdminDestination(
    String(formData.get("next") || "/admin")
  );

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  redirect(next);
}

export async function requestPasswordReset(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const supabase = createClient();
  const baseUrl = getRequestBaseUrl();
  if (!baseUrl) return { error: "A URL pública do site não está configurada." };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/admin/redefinir-senha`,
  });
  if (error) return { error: "Não foi possível enviar o link agora. Tente novamente." };
  return { success: true };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
