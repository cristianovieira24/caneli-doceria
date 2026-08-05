import type { Metadata } from "next";
import { StoreCard } from "@/components/store-card";
import { createClient } from "@/lib/supabase/server";
import type { Store } from "@/types/database";

export const metadata: Metadata = {
  title: "Unidades",
  description: "Encontre a unidade Caneli Doceria mais perto de você em Goiânia — endereço, horário e WhatsApp.",
};

export default async function UnidadesPage() {
  let stores: Store[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase.from("stores").select("*").eq("status", "active").order("display_order");
    stores = (data as Store[]) ?? [];
  } catch {
    // Ver README — Supabase ainda não configurado neste ambiente.
  }

  return (
    <div className="section py-12">
      <p className="eyebrow">nossas lojas</p>
      <h1 className="mt-1 text-4xl">Unidades em Goiânia</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {stores.length === 0 && (
        <div className="mt-10 rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
          As unidades aparecem aqui assim que o Supabase estiver configurado e o seed for aplicado.
        </div>
      )}
    </div>
  );
}
