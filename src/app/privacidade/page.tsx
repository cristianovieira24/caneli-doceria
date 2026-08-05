import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade",
  robots: { index: false, follow: true },
};

export default function PrivacidadePage() {
  return (
    <div className="section max-w-[70ch] py-12">
      <h1 className="text-3xl">Política de privacidade</h1>

      <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
        <p>
          Este site usa cookies de análise (como Google Analytics/Tag Manager) apenas depois que
          você aceita o aviso de cookies exibido na primeira visita. Você pode recusar a qualquer
          momento; isso não afeta o uso do cardápio, do formulário de encomendas ou do pedido pelo
          WhatsApp.
        </p>
        <p>
          Dados enviados pelo formulário de encomendas (nome, WhatsApp, tipo de pedido e detalhes)
          são usados exclusivamente pela equipe da Caneli para tratar aquele pedido, e ficam
          guardados no banco de dados da loja até serem removidos manualmente.
        </p>
        <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
          O texto completo desta política — incluindo prazos de retenção, direitos do titular
          (LGPD) e contato do responsável pelos dados — deve ser revisado e completado pela Caneli
          (ou por um profissional jurídico) antes da publicação. Nada foi inventado aqui de
          propósito, por instrução do projeto.
        </p>
      </div>
    </div>
  );
}
