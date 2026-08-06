import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história da Caneli Doceria, em Goiânia.",
  alternates: { canonical: "/sobre" },
};

interface SobreContent {
  title?: string;
  body?: string;
  image_url?: string;
}

async function getSobreContent(): Promise<SobreContent | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("content_sections").select("data").eq("key", "sobre_intro").maybeSingle();
    return (data?.data as SobreContent) ?? null;
  } catch {
    return null;
  }
}

export default async function SobrePage() {
  const content = await getSobreContent();

  return (
    <div className="section py-12 max-w-[70ch]">
      <p className="eyebrow">nossa história</p>
      <h1 className="mt-1 text-4xl">{content?.title || "Nossa história"}</h1>

      {content?.image_url && (
        <div className="arch-frame relative mt-6 aspect-[16/9] w-full">
          <Image src={content.image_url} alt="" fill sizes="70ch" className="object-cover" />
        </div>
      )}

      {content?.body ? (
        <p className="mt-5 whitespace-pre-line text-ink-soft leading-relaxed">{content.body}</p>
      ) : (
        <p className="mt-5 rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm text-ink-soft">
          Este texto ainda não foi cadastrado. A equipe da Caneli pode escrever a história real da
          marca em <strong>/admin/conteudo</strong> — por instrução do projeto, nenhuma data ou
          fato sobre a empresa é inventado aqui.
        </p>
      )}
    </div>
  );
}
