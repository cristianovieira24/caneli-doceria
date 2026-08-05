import Link from "next/link";
import { Plus, Pencil, Copy, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct, duplicateProduct } from "./actions";
import { formatBRL } from "@/lib/format";
import type { Category, Product } from "@/types/database";

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: { status?: string; categoria?: string; q?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("display_order");

  if (searchParams.status) query = query.eq("status", searchParams.status);
  if (searchParams.categoria) query = query.eq("category_id", searchParams.categoria);
  if (searchParams.q) query = query.ilike("name", `%${searchParams.q}%`);

  const [{ data: products }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("*").order("display_order"),
  ]);

  const list = (products as (Product & { category: { name: string } | null })[]) ?? [];
  const categoryList = (categories as Category[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Produtos</h1>
          <p className="mt-1 text-sm text-ink-soft">{list.length} produto(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/produtos/exportar" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
            Exportar CSV
          </a>
          <Link href="/admin/produtos/importar" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
            Importar CSV
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-1.5 rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft"
          >
            <Plus size={16} /> Novo produto
          </Link>
        </div>
      </div>

      <form className="mt-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={searchParams.q} placeholder="Buscar por nome…" className="input max-w-xs" />
        <select name="status" defaultValue={searchParams.status ?? ""} className="input max-w-[180px]">
          <option value="">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
        <select name="categoria" defaultValue={searchParams.categoria ?? ""} className="input max-w-[220px]">
          <option value="">Todas as categorias</option>
          {categoryList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
          Filtrar
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-card bg-cream-soft shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink-soft">
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{p.name}</p>
                  {p.featured && <span className="text-xs text-terracotta">Destaque</span>}
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{formatBRL(p.promo_price ?? p.price)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/produtos/${p.id}`} aria-label="Editar" className="text-ink-soft hover:text-pine">
                      <Pencil size={16} />
                    </Link>
                    <form action={duplicateProduct.bind(null, p.id)}>
                      <button type="submit" aria-label="Duplicar" className="text-ink-soft hover:text-pine">
                        <Copy size={16} />
                      </button>
                    </form>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <button type="submit" aria-label="Excluir" className="text-ink-soft hover:text-terracotta">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">
            Nenhum produto encontrado com esses filtros.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  const styles = {
    published: "bg-pine/10 text-pine",
    draft: "bg-gold/10 text-gold",
    archived: "bg-ink/10 text-ink-soft",
  } as const;
  const labels = { published: "Publicado", draft: "Rascunho", archived: "Arquivado" } as const;
  return <span className={`rounded-full px-2.5 py-1 text-xs ${styles[status]}`}>{labels[status]}</span>;
}
