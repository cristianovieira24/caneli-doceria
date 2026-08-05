import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StoreForm } from "../store-form";
import { HoursEditor } from "./hours-editor";
import type { Store, StoreHours } from "@/types/database";

export default async function EditarUnidadePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: store }, { data: hours }] = await Promise.all([
    supabase.from("stores").select("*").eq("id", params.id).single(),
    supabase.from("store_hours").select("*").eq("store_id", params.id),
  ]);
  if (!store) notFound();

  return (
    <div>
      <h1 className="text-2xl">Editar unidade</h1>
      <div className="mt-6">
        <StoreForm store={store as Store} />
      </div>

      <div className="mt-10 max-w-2xl border-t border-ink/10 pt-8">
        <h2 className="text-lg">Horário de funcionamento</h2>
        <p className="mt-1 text-sm text-ink-soft">Deixe em branco os dias sem horário definido.</p>
        <div className="mt-4">
          <HoursEditor storeId={params.id} hours={(hours as StoreHours[]) ?? []} />
        </div>
      </div>
    </div>
  );
}
