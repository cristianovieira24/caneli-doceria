"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";

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

  const result = categoryId
    ? await supabase.from("categories").update(payload).eq("id", categoryId)
    : await supabase.from("categories").insert(payload);

  if (result.error) return { error: "Não foi possível salvar. " + result.error.message };

  revalidatePath("/admin/categorias");
  revalidatePath("/cardapio");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: string) {
  await requireEditor();
  const supabase = createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categorias");
}
