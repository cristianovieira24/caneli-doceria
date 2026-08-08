"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";

async function requireAdmin() {
  const staff = await getCurrentStaff();

  if (!staff || !hasAtLeast(staff.roles, "administrador")) {
    throw new Error("Sem permissão.");
  }
}

export async function setDemoMode(formData: FormData) {
  await requireAdmin();

  const enabled = formData.get("enabled") === "true";
  const supabase = createClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: "demo_mode",
        value: enabled,
      },
      { onConflict: "key" }
    );

  if (error) {
    throw new Error("Não foi possível alterar o modo do site.");
  }

  // O root layout lê o valor de site_settings a cada nova navegação.
  // Revalidar o layout garante que as páginas passem a refletir o novo modo.
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}
