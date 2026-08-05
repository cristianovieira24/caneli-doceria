import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteStore } from "./actions";
import type { Store } from "@/types/database";

export default async function AdminUnidadesPage() {
  const supabase = createClient();
  const { data } = await supabase.from("stores").select("*").order("display_order");
  const stores = (data as Store[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Unidades</h1>
        <Link href="/admin/unidades/novo" className="inline-flex items-center gap-1.5 rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft">
          <Plus size={16} /> Nova unidade
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-card bg-cream-soft shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink-soft">
              <th className="px-4 py-3 font-medium">Unidade</th>
              <th className="px-4 py-3 font-medium">WhatsApp</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-ink-soft">{s.neighborhood}</p>
                </td>
                <td className="px-4 py-3 text-ink-soft">{s.whatsapp}</td>
                <td className="px-4 py-3">
                  <span className={s.status === "active" ? "text-pine" : "text-terracotta"}>
                    {s.status === "active" ? "Ativa" : "Fechada temporariamente"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/unidades/${s.id}`} aria-label="Editar" className="text-ink-soft hover:text-pine">
                      <Pencil size={16} />
                    </Link>
                    <form action={deleteStore.bind(null, s.id)}>
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
        {stores.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">Nenhuma unidade cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}
