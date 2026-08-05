import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CampaignForm } from "../campaign-form";
import type { Campaign } from "@/types/database";

export default async function EditarCampanhaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("campaigns").select("*").eq("id", params.id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl">Editar campanha</h1>
      <div className="mt-6">
        <CampaignForm campaign={data as Campaign} />
      </div>
    </div>
  );
}
