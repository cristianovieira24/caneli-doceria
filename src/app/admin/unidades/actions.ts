"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { removeManagedMedia } from "@/lib/media";

const storeSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  neighborhood: z.string().min(1, "Informe o bairro"),
  address: z.string().min(5, "Informe o endereço completo"),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zip_code: z.string().optional(),
  whatsapp: z
    .string()
    .regex(/^\d{12,15}$/, "Use apenas números com DDI+DDD, ex.: 5562999999999"),
  phone: z.string().optional(),
  order_mode: z.enum(["whatsapp", "external_link", "menu_only", "internal"]),
  photo_url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  status: z.enum(["active", "temporarily_closed"]),
  display_order: z.coerce.number().int().default(0),
});

export type StoreFormState = { error?: string; fieldErrors?: Record<string, string> };

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");
}

async function requireAdmin() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "administrador")) {
    throw new Error("Só administradores podem excluir unidades.");
  }
}

export async function saveStore(
  storeId: string | null,
  _prev: StoreFormState,
  formData: FormData
): Promise<StoreFormState> {
  await requireEditor();
  const parsed = storeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Confira os campos destacados.", fieldErrors };
  }

  const supabase = createClient();
  let previousPhotoUrl: string | null = null;

  if (storeId) {
    const { data } = await supabase
      .from("stores")
      .select("photo_url")
      .eq("id", storeId)
      .single();
    previousPhotoUrl = data?.photo_url ?? null;
  }

  const result = storeId
    ? await supabase.from("stores").update(parsed.data).eq("id", storeId)
    : await supabase.from("stores").insert(parsed.data);

  if (result.error) return { error: "Não foi possível salvar. " + result.error.message };

  if (previousPhotoUrl && previousPhotoUrl !== parsed.data.photo_url) {
    await removeManagedMedia(supabase, [previousPhotoUrl]);
  }

  revalidatePath("/admin/unidades");
  revalidatePath("/unidades");
  revalidatePath("/");
  redirect("/admin/unidades");
}

export async function deleteStore(id: string) {
  await requireAdmin();
  const supabase = createClient();

  const { data: store } = await supabase
    .from("stores")
    .select("photo_url")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("stores").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir a unidade. " + error.message);

  await removeManagedMedia(supabase, [store?.photo_url]);
  revalidatePath("/admin/unidades");
  revalidatePath("/unidades");
  revalidatePath("/");
}

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export async function saveStoreHours(storeId: string, formData: FormData) {
  await requireEditor();
  const supabase = createClient();

  const rows = WEEKDAYS.map((day) => {
    const closed = formData.get(`closed_${day}`) === "on";
    const opensAt = String(formData.get(`opens_${day}`) || "");
    const closesAt = String(formData.get(`closes_${day}`) || "");
    return {
      store_id: storeId,
      weekday: day,
      closed,
      opens_at: closed || !opensAt ? null : opensAt,
      closes_at: closed || !closesAt ? null : closesAt,
    };
  });

  const { error } = await supabase
    .from("store_hours")
    .upsert(rows, { onConflict: "store_id,weekday" });
  if (error) throw new Error("Não foi possível salvar os horários. " + error.message);
  revalidatePath(`/admin/unidades/${storeId}`);
  revalidatePath("/unidades");
}
