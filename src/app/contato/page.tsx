import type { Metadata } from "next";
import { StoreCard } from "@/components/store-card";
import { JsonLd } from "@/components/json-ld";
import { createClient } from "@/lib/supabase/server";
import type { Store, FaqItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Caneli Doceria pelo WhatsApp de cada unidade ou pelo Instagram.",
  alternates: { canonical: "/contato" },
};

export default async function ContatoPage() {
  let stores: Store[] = [];
  let faqs: FaqItem[] = [];
  try {
    const supabase = createClient();
    const [{ data: storeData }, { data: faqData }] = await Promise.all([
      supabase.from("stores").select("*").eq("status", "active").order("display_order"),
      supabase.from("faq_items").select("*").eq("visible", true).order("display_order"),
    ]);
    stores = (storeData as Store[]) ?? [];
    faqs = (faqData as FaqItem[]) ?? [];
  } catch {
    // Ver README.
  }

  return (
    <div className="section py-12">
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

      <p className="eyebrow">fale com a gente</p>
      <h1 className="mt-1 text-4xl">Contato</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">
        Chame a unidade mais próxima direto no WhatsApp, ou siga a gente no{" "}
        <a href="https://www.instagram.com/canelidoceria/" target="_blank" rel="noreferrer" className="text-pine underline">
          Instagram
        </a>
        .
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {faqs.length > 0 && (
        <div className="mt-14 max-w-[70ch]">
          <h2 className="text-2xl">Perguntas frequentes</h2>
          <dl className="mt-4 space-y-5">
            {faqs.map((f) => (
              <div key={f.id}>
                <dt className="font-medium text-ink">{f.question}</dt>
                <dd className="mt-1 text-sm text-ink-soft">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
