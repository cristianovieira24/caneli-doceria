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
    <div className="min-w-0">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Visão geral do que está publicado no site agora.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="pastry-card bg-cream-soft p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <p className="text-3xl font-display">{c.value}</p>
            <p className="mt-1 text-sm text-ink-soft">{c.label}</p>
          </Link>
        ))}
      </div>

      <section
        className={
          "mt-7 rounded-pastry border p-5 shadow-soft sm:mt-8 sm:p-6 " +
          (demoMode
            ? "border-pine/20 bg-pine/5"
            : "border-terracotta/25 bg-terracotta/5")
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Modo do site
        </p>

        <h2 className="mt-2 text-xl sm:text-2xl">
          {demoMode ? "DEMONSTRAÇÃO" : "REAL / APRESENTAÇÃO"}
        </h2>

        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
          {demoMode
            ? "WhatsApp, delivery, carrinho e formulário estão protegidos e não geram ações comerciais reais."
            : "As funcionalidades comerciais estão liberadas. Qualquer visitante pode abrir WhatsApp/delivery e o formulário pode gravar uma solicitação real."}
        </p>

        {!demoMode && (
          <p className="mt-3 rounded-xl bg-terracotta/10 px-4 py-3 text-sm leading-relaxed text-terracotta-dark">
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
                "w-full rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 min-[420px]:w-auto " +
                (demoMode
                  ? "bg-pine text-cream-soft shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
                  : "border border-ink/15 bg-cream-soft text-ink hover:border-pine")
              }
            >
              {demoMode
                ? "Desativar demonstração e liberar modo real"
                : "Ativar modo demonstração"}
            </button>
          </form>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-ink/15 bg-cream-soft/60 px-4 py-3 text-sm leading-relaxed text-ink-soft">
            A trava fixa NEXT_PUBLIC_DEMO_MODE está desativada. Nessa condição,
            o site fica em modo oficial e o botão dinâmico não pode forçar a
            demonstração. Para esta instalação de apresentação, deixe essa
            variável como true.
          </p>
        )}

        <Link
          href="/"
          target="_blank"
          className="mt-4 inline-flex min-h-10 items-center text-sm text-pine underline-offset-4 hover:underline"
        >
          Abrir site em nova aba
        </Link>
      </section>

      <div className="mt-7 rounded-pastry border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-5 text-sm leading-relaxed text-ink-soft sm:mt-8 sm:px-6 sm:py-6">
        Cliques no WhatsApp, produtos mais visualizados e campanhas ativas
        aparecem aqui quando o analytics estiver conectado — nada é mostrado
        antes disso pra não inventar métrica.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:flex min-[420px]:flex-wrap">
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-pine px-5 py-3 text-center text-sm text-cream-soft shadow-soft"
        >
          + Novo produto
        </Link>

        <Link
          href="/admin/unidades"
          className="rounded-full border border-ink/15 bg-cream-soft px-5 py-3 text-center text-sm"
        >
          Gerenciar unidades
        </Link>
      </div>
    </div>
  );
}
