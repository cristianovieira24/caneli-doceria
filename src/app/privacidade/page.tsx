import type { Metadata } from "next";
import { getFunctionalDemoMode } from "@/lib/site-mode";

const DEMO_INSTALLATION =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const metadata: Metadata = {
  title: "Política de privacidade",
  robots: { index: false, follow: true },
};

export default async function PrivacidadePage() {
  const demoMode = await getFunctionalDemoMode();

  return (
    <div className="section max-w-[70ch] py-12">
      <h1 className="text-3xl">Política de privacidade</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
        {demoMode ? (
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
              Ferramentas de análise e rastreamento permanecem desativadas
              enquanto esta instalação estiver protegida como demonstração.
            </p>

            <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
              Caso este projeto seja publicado oficialmente pela Caneli, a
              política de privacidade deverá ser revisada e completada pela
              empresa ou por um profissional jurídico, incluindo informações
              sobre tratamento de dados, retenção e direitos previstos na LGPD.
            </p>
          </>
        ) : DEMO_INSTALLATION ? (
          <>
            <p>
              As funcionalidades comerciais desta apresentação estão
              temporariamente liberadas. Dados enviados pelo formulário de
              encomendas, como nome, WhatsApp, tipo de pedido e detalhes, podem
              ser armazenados para permitir a demonstração do fluxo completo.
            </p>

            <p>
              A proteção fixa desta instalação continua ativa: ferramentas de
              análise e rastreamento permanecem desativadas e o projeto continua
              protegido contra indexação enquanto
              NEXT_PUBLIC_DEMO_MODE estiver ativo.
            </p>

            <p className="rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm">
              Este modo é destinado apenas à apresentação do projeto. Antes de
              uma publicação oficial, a política de privacidade deverá ser
              revisada e completada pela Caneli ou por um profissional jurídico.
            </p>
          </>
        ) : (
          <>
            <p>
              Este site pode utilizar ferramentas de análise e rastreamento
              somente conforme as preferências de consentimento exibidas ao
              visitante.
            </p>

            <p>
              Dados enviados pelo formulário de encomendas, como nome,
              WhatsApp, tipo de pedido e detalhes, são usados para tratar a
              solicitação enviada.
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
