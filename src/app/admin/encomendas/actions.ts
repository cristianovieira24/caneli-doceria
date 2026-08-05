"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import type { LeadStatus } from "@/types/database";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");

  const supabase = createClient();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin/encomendas");
}
