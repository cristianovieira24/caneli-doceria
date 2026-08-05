import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = createClient();
  const [products, unavailable, stores, leads] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("stores").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "novo"),
  ]);

  return {
    products: products.count ?? 0,
    drafts: unavailable.count ?? 0,
    stores: stores.count ?? 0,
    newLeads: leads.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    { label: "Produtos cadastrados", value: counts.products, href: "/admin/produtos" },
    { label: "Produtos em rascunho", value: counts.drafts, href: "/admin/produtos?status=draft" },
    { label: "Unidades ativas", value: counts.stores, href: "/admin/unidades" },
    { label: "Encomendas novas", value: counts.newLeads, href: "/admin/encomendas" },
  ];

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">Visão geral do que está publicado no site agora.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-card bg-cream-soft p-5 shadow-soft hover:shadow-lift"
          >
            <p className="text-3xl font-display">{c.value}</p>
            <p className="mt-1 text-sm text-ink-soft">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-6 text-sm text-ink-soft">
        Cliques no WhatsApp, produtos mais visualizados e campanhas ativas aparecem aqui quando o
        analytics (Fase 4) estiver conectado — nada é mostrado antes disso pra não inventar métrica.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/produtos/novo" className="rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft">
          + Novo produto
        </Link>
        <Link href="/admin/unidades" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
          Gerenciar unidades
        </Link>
      </div>
    </div>
  );
}
