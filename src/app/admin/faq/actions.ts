"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";

const faqSchema = z.object({
  question: z.string().min(3, "Informe a pergunta"),
  answer: z.string().min(3, "Informe a resposta"),
  display_order: z.coerce.number().int().default(0),
  visible: z.enum(["on"]).optional(),
});

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");
}

export async function addFaqItem(formData: FormData): Promise<void> {
  await requireEditor();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Confira a pergunta e a resposta.");

  const { visible, ...rest } = parsed.data;
  const supabase = createClient();
  const { error } = await supabase
    .from("faq_items")
    .insert({ ...rest, visible: visible === "on" });
  if (error) throw new Error("Não foi possível adicionar a pergunta. " + error.message);

  revalidatePath("/admin/faq");
  revalidatePath("/contato");
}

export async function toggleFaqVisible(id: string, visible: boolean) {
  await requireEditor();
  const supabase = createClient();
  const { error } = await supabase
    .from("faq_items")
    .update({ visible })
    .eq("id", id);
  if (error) throw new Error("Não foi possível alterar a visibilidade. " + error.message);
  revalidatePath("/admin/faq");
  revalidatePath("/contato");
}

export async function deleteFaqItem(id: string) {
  await requireEditor();
  const supabase = createClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir a pergunta. " + error.message);
  revalidatePath("/admin/faq");
  revalidatePath("/contato");
}
