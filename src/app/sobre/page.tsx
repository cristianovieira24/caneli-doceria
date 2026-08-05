import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a Caneli Doceria — doces momentos & dias felizes desde 2020, em Goiânia.",
};

export default function SobrePage() {
  return (
    <div className="section py-12 max-w-[70ch]">
      <p className="eyebrow">nossa história</p>
      <h1 className="mt-1 text-4xl">Doces momentos & dias felizes desde 2020</h1>
      <p className="mt-5 text-ink-soft leading-relaxed">
        Este texto institucional deve ser preenchido pela equipe da Caneli com a história real da
        marca — origem, valores e o que torna cada loja especial. Por instrução do projeto, nenhuma
        data, número ou fato sobre a empresa é inventado aqui: o conteúdo definitivo entra pelo
        painel administrativo (seção &ldquo;Conteúdo institucional&rdquo;), em <code>content_sections</code>
        {" "}com a chave <code>sobre_intro</code>.
      </p>
    </div>
  );
}
