import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
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
    const { data } = await supabase
      .from("content_sections")
      .select("data")
      .eq("key", "sobre_intro")
      .maybeSingle();

    return (data?.data as SobreContent) ?? null;
  } catch {
    return null;
  }
}

export default async function SobrePage() {
  const content = await getSobreContent();

  return (
    <div className="section max-w-[76ch] py-8 sm:py-12">
      <Reveal>
        <p className="eyebrow">nossa história</p>
        <h1 className="mt-1 text-3xl min-[380px]:text-4xl">
          {content?.title || "Nossa história"}
        </h1>
      </Reveal>

      {content?.image_url && (
        <Reveal delay={80} scale={0.98}>
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-[30px_30px_72px_30px] bg-blush-light shadow-lift">
            <Image
              src={content.image_url}
              alt=""
              fill
              sizes="(min-width: 768px) 76ch, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.02]"
            />
          </div>
        </Reveal>
      )}

      <Reveal delay={130} distance={18}>
        {content?.body ? (
          <p className="mt-6 whitespace-pre-line text-base leading-8 text-ink-soft">
            {content.body}
          </p>
        ) : (
          <p className="mt-6 rounded-pastry border border-dashed border-ink/15 bg-cream-soft/60 px-5 py-4 text-sm leading-relaxed text-ink-soft">
            Este texto ainda não foi cadastrado. A equipe da Caneli pode
            escrever a história real da marca em{" "}
            <strong>/admin/conteudo</strong> — por instrução do projeto, nenhuma
            data ou fato sobre a empresa é inventado aqui.
          </p>
        )}
      </Reveal>
    </div>
  );
}
