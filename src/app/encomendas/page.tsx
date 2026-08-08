import type { Metadata } from "next";
import { LeadForm } from "./lead-form";
import { Reveal } from "@/components/reveal";
import { getFunctionalDemoMode } from "@/lib/site-mode";

const DEMO_INSTALLATION =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const metadata: Metadata = {
  title: "Encomendas",
  description: DEMO_INSTALLATION
    ? "Demonstração do fluxo de encomendas da Caneli Doceria."
    : "Bolos, tortas, cestas e kits para presentear. Faça seu pedido de encomenda na Caneli Doceria.",
};

export default async function EncomendasPage() {
  const demoMode = await getFunctionalDemoMode();

  return (
    <div className="section relative py-8 sm:py-12">

      <Reveal>
        <p className="eyebrow">para ocasiões especiais</p>

        <h1 className="mt-1 max-w-[24ch] text-3xl min-[380px]:text-4xl">
          Bolos, tortas e cestas para presentear
        </h1>

        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft sm:text-base">
          {demoMode
            ? "Experimente abaixo como funciona o fluxo de encomendas. Nesta demonstração, nenhum dado será enviado e nenhuma solicitação real será criada."
            : "Preencha os detalhes abaixo e a equipe entra em contato para confirmar disponibilidade e valor."}
        </p>
      </Reveal>

      <Reveal delay={90} distance={20}>
        <div className="max-w-4xl">
          <LeadForm />
        </div>
      </Reveal>
    </div>
  );
}
