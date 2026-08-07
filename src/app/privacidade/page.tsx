import type { Metadata } from "next";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const metadata: Metadata = {
  title: "Política de privacidade",
  robots: { index: false, follow: true },
};

export default function PrivacidadePage() {
  return (
    <div className="section max-w-[70ch] py-12">
      <h1 className="text-3xl">Política de privacidade</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
        {DEMO_MODE ? (
          <>
            <p>
              Este site está em modo demonstração e não representa o site
              oficial da Caneli Doceria.
            </p>

            <p>
              Durante esta demonstração, recursos de pedido, contato comercial
              e envio de encomendas são simulados. Os dados preenchidos nesses
              fluxos não são enviados à Caneli e não são armazenados como
              leads.
            </p>

            <p>
              Ferramentas de análise e rastreamento, como Google Analytics e
              Google Tag Manager, permanecem desativadas enquanto o site estiver
              em modo demonstração.
            </p>

            <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
              Caso este projeto seja publicado oficialmente pela Caneli, a
              política de privacidade deverá ser revisada e completada pela
              empresa ou por um profissional jurídico, incluindo informações
              sobre tratamento de dados, retenção e direitos previstos na LGPD.
            </p>
          </>
        ) : (
          <>
            <p>
              Este site usa cookies de análise, como Google Analytics e Google
              Tag Manager, apenas depois que você aceita o aviso de cookies
              exibido na primeira visita. Você pode recusar a qualquer momento;
              isso não afeta o uso do cardápio, do formulário de encomendas ou
              do pedido pelo WhatsApp.
            </p>

            <p>
              Dados enviados pelo formulário de encomendas, como nome,
              WhatsApp, tipo de pedido e detalhes, são usados exclusivamente
              pela equipe da Caneli para tratar aquela solicitação.
            </p>

            <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
              O texto completo desta política — incluindo prazos de retenção,
              direitos do titular previstos na LGPD e contato do responsável
              pelos dados — deve ser revisado e completado pela Caneli ou por
              um profissional jurídico antes da publicação oficial.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
