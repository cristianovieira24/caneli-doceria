import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getFunctionalDemoMode } from "@/lib/site-mode";
import { setDemoMode } from "./demo-mode-actions";

const DEMO_INSTALLATION =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

async function getCounts() {
  const supabase = createClient();

  const [products, unavailable, stores, leads] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("stores")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "novo"),
  ]);

  return {
    products: products.count ?? 0,
    drafts: unavailable.count ?? 0,
    stores: stores.count ?? 0,
    newLeads: leads.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const [counts, demoMode] = await Promise.all([
    getCounts(),
    getFunctionalDemoMode(),
  ]);

  const cards = [
    {
      label: "Produtos cadastrados",
      value: counts.products,
      href: "/admin/produtos",
    },
    {
      label: "Produtos em rascunho",
      value: counts.drafts,
      href: "/admin/produtos?status=draft",
    },
    {
      label: "Unidades ativas",
      value: counts.stores,
      href: "/admin/unidades",
    },
    {
      label: "Encomendas novas",
      value: counts.newLeads,
      href: "/admin/encomendas",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Visão geral do que está publicado no site agora.
      </p>

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

      <section
        className={
          "mt-8 rounded-card border p-6 shadow-soft " +
          (demoMode
            ? "border-pine/20 bg-pine/5"
            : "border-terracotta/25 bg-terracotta/5")
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Modo do site
        </p>

        <h2 className="mt-2 text-2xl font-display">
          {demoMode ? "DEMONSTRAÇÃO" : "REAL / APRESENTAÇÃO"}
        </h2>

        <p className="mt-2 max-w-[70ch] text-sm text-ink-soft">
          {demoMode
            ? "WhatsApp, delivery, carrinho e formulário estão protegidos e não geram ações comerciais reais."
            : "As funcionalidades comerciais estão liberadas. Qualquer visitante pode abrir WhatsApp/delivery e o formulário pode gravar uma solicitação real."}
        </p>

        {!demoMode && (
          <p className="mt-3 rounded-card bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
            Quando terminar a apresentação, ative novamente o modo demonstração.
          </p>
        )}

        {DEMO_INSTALLATION ? (
          <form action={setDemoMode} className="mt-5">
            <input
              type="hidden"
              name="enabled"
              value={demoMode ? "false" : "true"}
            />

            <button
              type="submit"
              className={
                "rounded-full px-5 py-2.5 text-sm font-medium " +
                (demoMode
                  ? "bg-pine text-cream-soft hover:bg-pine-dark"
                  : "border border-ink/15 bg-cream-soft text-ink hover:border-pine")
              }
            >
              {demoMode
                ? "Desativar demonstração e liberar modo real"
                : "Ativar modo demonstração"}
            </button>
          </form>
        ) : (
          <p className="mt-5 rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-4 py-3 text-sm text-ink-soft">
            A trava fixa NEXT_PUBLIC_DEMO_MODE está desativada. Nessa condição,
            o site fica em modo oficial e o botão dinâmico não pode forçar a
            demonstração. Para esta instalação de apresentação, deixe essa
            variável como true.
          </p>
        )}

        <Link
          href="/"
          target="_blank"
          className="mt-4 inline-flex text-sm text-pine underline-offset-2 hover:underline"
        >
          Abrir site em nova aba
        </Link>
      </section>

      <div className="mt-8 rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-6 text-sm text-ink-soft">
        Cliques no WhatsApp, produtos mais visualizados e campanhas ativas
        aparecem aqui quando o analytics estiver conectado — nada é mostrado
        antes disso pra não inventar métrica.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft"
        >
          + Novo produto
        </Link>

        <Link
          href="/admin/unidades"
          className="rounded-full border border-ink/15 px-5 py-2.5 text-sm"
        >
          Gerenciar unidades
        </Link>
      </div>
    </div>
  );
}
