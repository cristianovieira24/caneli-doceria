import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * NEXT_PUBLIC_DEMO_MODE é a trava fixa da instalação de demonstração.
 *
 * Quando ela está "false", o projeto foi oficialmente liberado e o modo
 * funcional também fica real.
 *
 * Enquanto ela está ativa, o admin pode alternar apenas as funcionalidades
 * comerciais através de site_settings.demo_mode.
 */
const DEMO_INSTALLATION =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export async function getFunctionalDemoMode(): Promise<boolean> {
  noStore();

  // Instalação oficial: não existe limitação funcional de demonstração.
  if (!DEMO_INSTALLATION) {
    return false;
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "demo_mode")
      .maybeSingle();

    // Segurança: qualquer erro mantém a demonstração ligada.
    if (error || !data) {
      return true;
    }

    // O campo é jsonb e pode armazenar diretamente true/false.
    if (typeof data.value === "boolean") {
      return data.value;
    }

    // Compatibilidade caso algum dia seja salvo como { enabled: true }.
    if (
      data.value &&
      typeof data.value === "object" &&
      "enabled" in data.value
    ) {
      return Boolean(
        (data.value as { enabled?: boolean }).enabled
      );
    }

    return true;
  } catch {
    // Nunca liberar ações reais por causa de uma falha de banco/rede.
    return true;
  }
}
