import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteCategory } from "./actions";
import type { Category } from "@/types/database";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export default async function AdminCategoriasPage() {
  const supabase = createClient();
  const staff = await getCurrentStaff();
  const canDelete = !!staff && hasAtLeast(staff.roles, "administrador");
  const { data } = await supabase.from("categories").select("*").order("display_order");
  const categories = (data as Category[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Categorias</h1>
        <Link href="/admin/categorias/novo" className="inline-flex items-center gap-1.5 rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft">
          <Plus size={16} /> Nova categoria
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-card bg-cream-soft shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink-soft">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Ordem</th>
              <th className="px-4 py-3 font-medium">Visível</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-ink-soft">{c.display_order}</td>
                <td className="px-4 py-3 text-ink-soft">{c.visible ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/categorias/${c.id}`} aria-label="Editar" className="text-ink-soft hover:text-pine">
                      <Pencil size={16} />
                    </Link>
                    {canDelete && (
                      <form action={deleteCategory.bind(null, c.id)}>
                        <ConfirmSubmitButton
                          label={`Excluir ${c.name}`}
                          confirmation={`Excluir a categoria “${c.name}”? Ela só poderá ser removida se não tiver produtos vinculados.`}
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
        {categories.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">Nenhuma categoria cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}
