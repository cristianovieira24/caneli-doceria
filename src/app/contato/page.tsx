import type { Metadata } from "next";
import { StoreCard } from "@/components/store-card";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { createClient } from "@/lib/supabase/server";
import type { Store, FaqItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Caneli Doceria pelo WhatsApp de cada unidade ou pelo Instagram.",
  alternates: { canonical: "/contato" },
};

export default async function ContatoPage() {
  let stores: Store[] = [];
  let faqs: FaqItem[] = [];

  try {
    const supabase = createClient();

    const [{ data: storeData }, { data: faqData }] = await Promise.all([
      supabase
        .from("stores")
        .select("*")
        .eq("status", "active")
        .order("display_order"),
      supabase
        .from("faq_items")
        .select("*")
        .eq("visible", true)
        .order("display_order"),
    ]);

    stores = (storeData as Store[]) ?? [];
    faqs = (faqData as FaqItem[]) ?? [];
  } catch {
    // Ver README.
  }

  return (
    <div className="section py-8 sm:py-12">
      {faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      )}

      <Reveal>
        <p className="eyebrow">fale com a gente</p>
        <h1 className="mt-1 text-3xl min-[380px]:text-4xl">Contato</h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft sm:text-base">
          Chame a unidade mais próxima direto no WhatsApp, ou siga a gente no{" "}
          <a
            href="https://www.instagram.com/canelidoceria/"
            target="_blank"
            rel="noreferrer"
            className="text-pine underline underline-offset-4"
          >
            Instagram
          </a>
          .
        </p>
      </Reveal>

      <div className="mt-7 grid gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store, i) => (
          <Reveal
            key={store.id}
            delay={Math.min(i * 60, 220)}
            scale={0.98}
          >
            <StoreCard store={store} />
          </Reveal>
        ))}
      </div>

      {faqs.length > 0 && (
        <Reveal delay={100}>
          <div className="mt-14 max-w-[76ch]">
            <p className="eyebrow">dúvidas comuns</p>
            <h2 className="mt-1 text-2xl sm:text-3xl">
              Perguntas frequentes
            </h2>

            <dl className="mt-5 grid gap-3">
              {faqs.map((f) => (
                <div
                  key={f.id}
                  className="rounded-pastry border border-ink/10 bg-cream-soft px-5 py-4 shadow-soft"
                >
                  <dt className="font-medium text-ink">{f.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      )}
    </div>
  );
}
