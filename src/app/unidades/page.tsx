import type { Metadata } from "next";
import { StoreCard } from "@/components/store-card";
import { Reveal } from "@/components/reveal";
import { createClient } from "@/lib/supabase/server";
import type { Store } from "@/types/database";

export const metadata: Metadata = {
  title: "Unidades",
  description:
    "Encontre a unidade Caneli Doceria mais perto de você em Goiânia — endereço, horário e WhatsApp.",
};

export default async function UnidadesPage() {
  let stores: Store[] = [];

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("status", "active")
      .order("display_order");

    stores = (data as Store[]) ?? [];
  } catch {
    // Supabase ainda não configurado neste ambiente.
  }

  return (
    <div className="section py-8 sm:py-12">
      <Reveal>
        <p className="eyebrow">nossas lojas</p>
        <h1 className="mt-1 text-3xl min-[380px]:text-4xl">
          Unidades em Goiânia
        </h1>
      </Reveal>

      <div className="mt-7 grid gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store, i) => (
          <Reveal
            key={store.id}
            delay={Math.min(i * 65, 220)}
            distance={22}
            scale={0.98}
          >
            <StoreCard store={store} />
          </Reveal>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="mt-10 rounded-pastry border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
          As unidades aparecem aqui assim que o Supabase estiver configurado e
          o seed for aplicado.
        </div>
      )}
    </div>
  );
}
