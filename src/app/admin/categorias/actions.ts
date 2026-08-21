"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { removeManagedMedia } from "@/lib/media";

const categorySchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  icon: z.string().optional(),
  display_order: z.coerce.number().int().default(0),
  visible: z.enum(["on"]).optional(),
});

export type CategoryFormState = { error?: string; fieldErrors?: Record<string, string> };

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");
}

async function requireAdmin() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "administrador")) {
    throw new Error("Só administradores podem excluir categorias.");
  }
}

export async function saveCategory(
  categoryId: string | null,
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireEditor();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Confira os campos destacados.", fieldErrors };
  }

  const { visible, ...rest } = parsed.data;
  const payload = { ...rest, visible: visible === "on" };
  const supabase = createClient();
  let previousImageUrl: string | null = null;

  if (categoryId) {
    const { data } = await supabase
      .from("categories")
      .select("image_url")
      .eq("id", categoryId)
      .single();
    previousImageUrl = data?.image_url ?? null;
  }

  const result = categoryId
    ? await supabase.from("categories").update(payload).eq("id", categoryId)
    : await supabase.from("categories").insert(payload);

  if (result.error) return { error: "Não foi possível salvar. " + result.error.message };

  if (previousImageUrl && previousImageUrl !== payload.image_url) {
    await removeManagedMedia(supabase, [previousImageUrl]);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/cardapio");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("image_url")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    throw new Error(
      "Não foi possível excluir a categoria. Remova ou mova os produtos vinculados antes."
    );
  }

  await removeManagedMedia(supabase, [category?.image_url]);
  revalidatePath("/admin/categorias");
  revalidatePath("/cardapio");
}
