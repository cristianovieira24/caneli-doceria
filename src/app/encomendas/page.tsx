import type { Metadata } from "next";
import { LeadForm } from "./lead-form";

export const metadata: Metadata = {
  title: "Encomendas",
  description: "Bolos, tortas, cestas e kits para presentear. Faça seu pedido de encomenda na Caneli Doceria.",
};

export default function EncomendasPage() {
  return (
    <div className="section py-12">
      <p className="eyebrow">para ocasiões especiais</p>
      <h1 className="mt-1 max-w-[24ch] text-4xl">Bolos, tortas e cestas para presentear</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">
        Preencha os detalhes abaixo e a equipe entra em contato para confirmar disponibilidade e valor.
      </p>
      <LeadForm />
    </div>
  );
}
