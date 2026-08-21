"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { removeManagedMedia } from "@/lib/media";

const campaignSchema = z
  .object({
    title: z.string().min(2, "Informe o título"),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    image_desktop_url: z.string().url().optional().or(z.literal("")),
    image_mobile_url: z.string().url().optional().or(z.literal("")),
    button_label: z.string().optional(),
    button_link: z
      .string()
      .refine(
        (value) =>
          !value ||
          (value.startsWith("/") && !value.startsWith("//")) ||
          /^https?:\/\//i.test(value),
        "Use uma rota interna começando com / ou uma URL http(s) completa"
      )
      .optional(),
    starts_at: z.string().min(1, "Informe a data de início"),
    ends_at: z.string().min(1, "Informe a data de término"),
    status: z.enum(["draft", "scheduled", "active", "ended"]),
    priority: z.coerce.number().int().default(0),
  })
  .refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
    message: "A data de término deve ser depois da data de início",
    path: ["ends_at"],
  });

export type CampaignFormState = { error?: string; fieldErrors?: Record<string, string> };

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");
}

async function requireAdmin() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "administrador")) {
    throw new Error("Só administradores podem excluir campanhas.");
  }
}

export async function saveCampaign(
  campaignId: string | null,
  _prev: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  await requireEditor();
  const parsed = campaignSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Confira os campos destacados.", fieldErrors };
  }

  const supabase = createClient();
  let previousImages: Array<string | null> = [];

  if (campaignId) {
    const { data } = await supabase
      .from("campaigns")
      .select("image_desktop_url, image_mobile_url")
      .eq("id", campaignId)
      .single();
    previousImages = [data?.image_desktop_url ?? null, data?.image_mobile_url ?? null];
  }

  const payload = {
    ...parsed.data,
    starts_at: new Date(parsed.data.starts_at).toISOString(),
    ends_at: new Date(parsed.data.ends_at).toISOString(),
  };

  const result = campaignId
    ? await supabase.from("campaigns").update(payload).eq("id", campaignId)
    : await supabase.from("campaigns").insert(payload);

  if (result.error) return { error: "Não foi possível salvar. " + result.error.message };

  await removeManagedMedia(
    supabase,
    previousImages.filter(
      (url) =>
        !!url &&
        url !== payload.image_desktop_url &&
        url !== payload.image_mobile_url
    )
  );

  revalidatePath("/admin/campanhas");
  revalidatePath("/");
  redirect("/admin/campanhas");
}

export async function deleteCampaign(id: string) {
  await requireAdmin();
  const supabase = createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("image_desktop_url, image_mobile_url")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir a campanha. " + error.message);

  await removeManagedMedia(supabase, [
    campaign?.image_desktop_url,
    campaign?.image_mobile_url,
  ]);
  revalidatePath("/admin/campanhas");
  revalidatePath("/");
}
