import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteCampaign } from "./actions";
import type { Campaign } from "@/types/database";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export default async function AdminCampanhasPage() {
  const supabase = createClient();
  const staff = await getCurrentStaff();
  const canDelete = !!staff && hasAtLeast(staff.roles, "administrador");
  const { data } = await supabase.from("campaigns").select("*").order("priority", { ascending: false });
  const campaigns = (data as Campaign[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Campanhas</h1>
        <Link href="/admin/campanhas/novo" className="inline-flex items-center gap-1.5 rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft">
          <Plus size={16} /> Nova campanha
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-card bg-cream-soft shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink-soft">
              <th className="px-4 py-3 font-medium">Campanha</th>
              <th className="px-4 py-3 font-medium">Período</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{c.title}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {new Date(c.starts_at).toLocaleDateString("pt-BR")} – {new Date(c.ends_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-ink-soft capitalize">{c.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/campanhas/${c.id}`} aria-label="Editar" className="text-ink-soft hover:text-pine">
                      <Pencil size={16} />
                    </Link>
                    {canDelete && (
                      <form action={deleteCampaign.bind(null, c.id)}>
                        <ConfirmSubmitButton
                          label={`Excluir ${c.title}`}
                          confirmation={`Excluir a campanha “${c.title}”? Esta ação não pode ser desfeita.`}
                          className="text-ink-soft hover:text-terracotta"
                        >
                          <Trash2 size={16} />
                        </ConfirmSubmitButton>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {campaigns.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">Nenhuma campanha cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}
