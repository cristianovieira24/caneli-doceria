import type { Metadata } from "next";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const metadata: Metadata = {
  title: "Termos de uso",
  robots: { index: false, follow: true },
};

export default function TermosPage() {
  return (
    <div className="section max-w-[70ch] py-12">
      <h1 className="text-3xl">Termos de uso</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
        {DEMO_MODE ? (
          <>
            <p>
              Este site é uma demonstração independente de projeto digital e
              não representa o site oficial da Caneli Doceria.
            </p>

            <p>
              Os preços, produtos, disponibilidade, unidades e demais
              informações exibidas servem para demonstrar a experiência do
              projeto e não constituem oferta comercial ou confirmação de
              disponibilidade.
            </p>

            <p>
              Recursos de pedido pelo WhatsApp, delivery e envio de encomendas
              são simulados enquanto o site estiver em modo demonstração.
              Nenhum pedido ou solicitação real é encaminhado à Caneli por
              esses fluxos.
            </p>

            <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
              Caso este projeto seja adotado oficialmente pela Caneli, os
              termos de uso deverão ser revisados e completados pela empresa ou
              por um profissional jurídico antes da publicação oficial.
            </p>
          </>
        ) : (
          <>
            <p>
              Os preços e a disponibilidade mostrados neste site são
              estimativas e podem variar por unidade. O pedido só é confirmado
              depois que a loja responde no WhatsApp — enviar o pedido pelo
              site não garante automaticamente o preço ou a disponibilidade.
            </p>

            <p>
              O envio do formulário de encomendas também não representa
              confirmação automática do pedido; a equipe entra em contato para
              validar data, valor e disponibilidade.
            </p>

            <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
              O texto completo dos termos de uso deve ser revisado e completado
              pela Caneli ou por um profissional jurídico antes da publicação
              oficial.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
