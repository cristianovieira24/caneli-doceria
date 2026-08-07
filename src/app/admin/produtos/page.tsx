"use client";

import { useFormState, useFormStatus } from "react-dom";
import { importProductsCSV, type ImportResult } from "./actions";

const TEMPLATE_HEADER =
  "name,slug,category_slug,short_description,price,promo_price,price_prefix,weight_or_size,yield_info,featured,seasonal,status,display_order\n" +
  'Croissant Tradicional,croissant-tradicional,croissants,Croissant amanteigado,20.00,,,,,,false,false,published,0\n';

export default function ImportarProdutosPage() {
  const [state, formAction] = useFormState<ImportResult | null, FormData>(importProductsCSV, null);

  return (
    <div>
      <h1 className="text-2xl">Importar produtos por CSV</h1>
      <p className="mt-2 max-w-[65ch] text-sm text-ink-soft">
        Produtos com um <strong>slug</strong> já existente são atualizados; os demais são criados
        como rascunho por padrão (ou publicados, se a coluna <code>status</code> disser isso). A{" "}
        <strong>categoria</strong> precisa já existir — use o slug dela.
      </p>

      <a
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE_HEADER)}`}
        download="modelo-produtos-caneli.csv"
        className="mt-3 inline-block text-sm text-pine underline"
      >
        Baixar modelo de CSV
      </a>

      <form action={formAction} className="mt-6 max-w-md space-y-4">
        <input type="file" name="file" accept=".csv,text/csv" required className="input" />
        <SubmitButton />
      </form>

      {state && (
        <div className="mt-8">
          <h2 className="text-lg">
            Resultado: {state.results.length - state.errorCount} ok, {state.errorCount} com erro
          </h2>
          <div className="mt-3 max-h-96 overflow-y-auto rounded-card bg-cream-soft shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-ink-soft">
                  <th className="px-4 py-2 font-medium">Linha</th>
                  <th className="px-4 py-2 font-medium">Produto</th>
                  <th className="px-4 py-2 font-medium">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {state.results.map((r, i) => (
                  <tr key={i} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-2 text-ink-soft">{r.row}</td>
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2">
                      {r.status === "error" ? (
                        <span className="text-terracotta">Erro: {r.message}</span>
                      ) : (
                        <span className="text-pine">{r.status === "created" ? "Criado" : "Atualizado"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-pine px-7 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
    >
      {pending ? "Importando…" : "Importar"}
    </button>
  );
}
