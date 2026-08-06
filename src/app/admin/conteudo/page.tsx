import { createClient } from "@/lib/supabase/server";
import { HeroForm } from "./hero-form";
import { SobreForm } from "./sobre-form";

export default async function AdminConteudoPage() {
  const supabase = createClient();
  const { data } = await supabase.from("content_sections").select("*").in("key", ["home_hero", "sobre_intro"]);

  const hero = data?.find((d) => d.key === "home_hero")?.data as
    | { eyebrow?: string; title?: string; description?: string; image_url?: string; image_alt?: string }
    | undefined;
  const sobre = data?.find((d) => d.key === "sobre_intro")?.data as
    | { title?: string; body?: string; image_url?: string }
    | undefined;

  return (
    <div>
      <h1 className="text-2xl">Conteúdo do site</h1>
      <p className="mt-1 max-w-[60ch] text-sm text-ink-soft">
        Campos estruturados e diretos — sem editor visual complexo, pra ficar rápido de manter.
      </p>

      <div className="mt-8 max-w-2xl space-y-3 rounded-card bg-cream-soft p-5 shadow-soft">
        <h2 className="text-lg">Banner principal (Início)</h2>
        <HeroForm defaultValues={hero} />
      </div>

      <div className="mt-8 max-w-2xl space-y-3 rounded-card bg-cream-soft p-5 shadow-soft">
        <h2 className="text-lg">Página &ldquo;Sobre&rdquo;</h2>
        <SobreForm defaultValues={sobre} />
      </div>
    </div>
  );
}
