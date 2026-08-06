"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");
}

const heroSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(2, "Informe o título"),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  image_alt: z.string().optional(),
});

export type ContentFormState = { error?: string };

export async function saveHeroSection(_prev: ContentFormState, formData: FormData): Promise<ContentFormState> {
  await requireEditor();
  const parsed = heroSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Confira os campos." };

  const supabase = createClient();
  const { error } = await supabase
    .from("content_sections")
    .upsert({ key: "home_hero", data: parsed.data }, { onConflict: "key" });
  if (error) return { error: error.message };

  revalidatePath("/");
  return {};
}

const sobreSchema = z.object({
  title: z.string().min(2, "Informe o título"),
  body: z.string().min(10, "Escreva o texto"),
  image_url: z.string().url().optional().or(z.literal("")),
});

export async function saveSobreSection(_prev: ContentFormState, formData: FormData): Promise<ContentFormState> {
  await requireEditor();
  const parsed = sobreSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Confira os campos." };

  const supabase = createClient();
  const { error } = await supabase
    .from("content_sections")
    .upsert({ key: "sobre_intro", data: parsed.data }, { onConflict: "key" });
  if (error) return { error: error.message };

  revalidatePath("/sobre");
  return {};
}
