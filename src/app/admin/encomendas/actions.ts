"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import type { LeadStatus } from "@/types/database";

const VALID_LEAD_STATUSES: LeadStatus[] = [
  "novo",
  "em_contato",
  "orcamento_enviado",
  "confirmado",
  "concluido",
  "cancelado",
];

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");
  if (!VALID_LEAD_STATUSES.includes(status)) throw new Error("Status inválido.");

  const supabase = createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error("Não foi possível atualizar a encomenda. " + error.message);
  revalidatePath("/admin/encomendas");
}
