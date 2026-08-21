import { createClient } from "@/lib/supabase/server";
import { addFaqItem, deleteFaqItem, toggleFaqVisible } from "./actions";
import type { FaqItem } from "@/types/database";
import { Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export default async function AdminFaqPage() {
  const supabase = createClient();
  const { data } = await supabase.from("faq_items").select("*").order("display_order");
  const items = (data as FaqItem[]) ?? [];

  return (
    <div>
      <h1 className="text-2xl">Perguntas frequentes</h1>
      <p className="mt-1 text-sm text-ink-soft">Aparecem na página de Contato.</p>

      <form action={addFaqItem} className="mt-6 max-w-xl space-y-3 rounded-card bg-cream-soft p-5 shadow-soft">
        <input name="question" placeholder="Pergunta" required className="input" />
        <textarea name="answer" placeholder="Resposta" rows={3} required className="input" />
        <div className="flex items-center gap-4">
          <input name="display_order" type="number" placeholder="Ordem" defaultValue={items.length} className="input w-28" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visible" defaultChecked /> Visível
          </label>
        </div>
        <button type="submit" className="rounded-full bg-pine px-6 py-2.5 text-sm text-cream-soft">
          Adicionar
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 rounded-card bg-cream-soft p-4 shadow-soft">
            <div>
              <p className="font-medium text-ink">{item.question}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.answer}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <form action={toggleFaqVisible.bind(null, item.id, !item.visible)}>
                <button type="submit" className="text-xs text-pine underline">
                  {item.visible ? "Ocultar" : "Mostrar"}
                </button>
              </form>
              <form action={deleteFaqItem.bind(null, item.id)}>
                <ConfirmSubmitButton
                  label={`Excluir ${item.question}`}
                  confirmation={`Excluir a pergunta “${item.question}”?`}
                  className="text-ink-soft hover:text-terracotta"
                >
                  <Trash2 size={16} />
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink-soft">Nenhuma pergunta cadastrada ainda.</p>}
      </div>
    </div>
  );
}
