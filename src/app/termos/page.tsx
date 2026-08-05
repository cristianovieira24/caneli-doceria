import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de uso",
  robots: { index: false, follow: true },
};

export default function TermosPage() {
  return (
    <div className="section max-w-[70ch] py-12">
      <h1 className="text-3xl">Termos de uso</h1>

      <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
        <p>
          Os preços e a disponibilidade mostrados neste site são estimativas e podem variar por
          unidade. O pedido só é confirmado depois que a loja responde no WhatsApp — enviar o
          pedido pelo site não garante automaticamente o preço ou a disponibilidade.
        </p>
        <p>
          O envio do formulário de encomendas também não representa confirmação automática do
          pedido; a equipe entra em contato para validar data, valor e disponibilidade.
        </p>
        <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
          O texto completo dos termos de uso deve ser revisado e completado pela Caneli antes da
          publicação. Nada foi inventado aqui de propósito, por instrução do projeto.
        </p>
      </div>
    </div>
  );
}
