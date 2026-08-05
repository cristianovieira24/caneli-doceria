"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";

const campaignSchema = z
  .object({
    title: z.string().min(2, "Informe o título"),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    image_desktop_url: z.string().url().optional().or(z.literal("")),
    image_mobile_url: z.string().url().optional().or(z.literal("")),
    button_label: z.string().optional(),
    button_link: z.string().optional(),
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
  const payload = {
    ...parsed.data,
    starts_at: new Date(parsed.data.starts_at).toISOString(),
    ends_at: new Date(parsed.data.ends_at).toISOString(),
  };

  const result = campaignId
    ? await supabase.from("campaigns").update(payload).eq("id", campaignId)
    : await supabase.from("campaigns").insert(payload);

  if (result.error) return { error: "Não foi possível salvar. " + result.error.message };

  revalidatePath("/admin/campanhas");
  revalidatePath("/");
  redirect("/admin/campanhas");
}

export async function deleteCampaign(id: string) {
  await requireEditor();
  const supabase = createClient();
  await supabase.from("campaigns").delete().eq("id", id);
  revalidatePath("/admin/campanhas");
}
