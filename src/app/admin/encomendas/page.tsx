import { createClient } from "@/lib/supabase/server";
import { LeadStatusSelect } from "./lead-status-select";
import type { Lead } from "@/types/database";

function normalizeWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export default async function AdminEncomendasPage() {
  const supabase = createClient();
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  const leads = (data as Lead[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Encomendas</h1>
          <p className="mt-1 text-sm text-ink-soft">{leads.length} pedido(s) recebido(s) pelo formulário</p>
        </div>
        <a href="/admin/encomendas/exportar" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
          Exportar CSV
        </a>
      </div>

      <div className="mt-6 space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-card bg-cream-soft p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{lead.name}</p>
                <p className="text-sm text-ink-soft">{lead.whatsapp} · {lead.order_type}</p>
              </div>
              <LeadStatusSelect id={lead.id} status={lead.status} />
            </div>
            <p className="mt-3 text-sm text-ink-soft">{lead.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-soft/70">
              {lead.desired_date && <span>Data desejada: {lead.desired_date}</span>}
              {lead.people_count && <span>Pessoas: {lead.people_count}</span>}
              {lead.budget_hint && <span>Orçamento: {lead.budget_hint}</span>}
              <span>Recebido em {new Date(lead.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
            <a
              href={`https://wa.me/${normalizeWhatsApp(lead.whatsapp)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-pine underline"
            >
              Responder no WhatsApp
            </a>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
            Nenhuma encomenda recebida ainda.
          </div>
        )}
      </div>
    </div>
  );
}
