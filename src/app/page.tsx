import Link from "next/link";
import { Hero, type HeroContent } from "@/components/hero";
import { CampaignBanner } from "@/components/campaign-banner";
import { ProductCard } from "@/components/product-card";
import { CategoryCard } from "@/components/category-card";
import { StoreCard } from "@/components/store-card";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { createClient } from "@/lib/supabase/server";
import type { Campaign, Category, Product, Store } from "@/types/database";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

async function getHomeData() {
  const supabase = createClient();

  const [
    { data: featured },
    { data: categories },
    { data: stores },
    { data: campaigns },
    { data: heroRow },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("status", "published")
      .eq("featured", true)
      .order("display_order")
      .limit(8),
    supabase
      .from("categories")
      .select("*")
      .eq("visible", true)
      .order("display_order"),
    supabase
      .from("stores")
      .select("*")
      .eq("status", "active")
      .order("display_order"),
    supabase
      .from("campaigns")
      .select("*")
      .order("priority", { ascending: false })
      .limit(1),
    supabase
      .from("content_sections")
      .select("data")
      .eq("key", "home_hero")
      .maybeSingle(),
  ]);

  return {
    featured: (featured as Product[]) ?? [],
    categories: (categories as Category[]) ?? [],
    stores: (stores as Store[]) ?? [],
    campaign: ((campaigns as Campaign[]) ?? [])[0] ?? null,
    hero: (heroRow?.data as HeroContent | undefined) ?? undefined,
  };
}

export default async function HomePage() {
  let featured: Product[] = [];
  let categories: Category[] = [];
  let stores: Store[] = [];
  let campaign: Campaign | null = null;
  let hero: HeroContent | undefined;

  try {
    const data = await getHomeData();
    featured = data.featured;
    categories = data.categories;
    stores = data.stores;
    campaign = data.campaign;
    hero = data.hero;
  } catch {
    // Supabase ainda não configurado neste ambiente — a página renderiza
    // com estados vazios em vez de quebrar.
  }

  return (
    <>
      {!DEMO_MODE && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Bakery",
            name: "Caneli Doceria",
            url:
              process.env.NEXT_PUBLIC_SITE_URL ||
              "https://www.canelidoceria.com.br",
            sameAs: ["https://www.instagram.com/canelidoceria/"],
            location: stores.map((s) => ({
              "@type": "Place",
              name: s.name,
              address: {
                "@type": "PostalAddress",
                streetAddress: s.address,
                addressLocality: s.city,
                addressRegion: s.state,
                addressCountry: "BR",
              },
            })),
          }}
        />
      )}

      <Hero content={hero} />

      {campaign && (
        <Reveal direction="up" distance={22}>
          <CampaignBanner campaign={campaign} />
        </Reveal>
      )}

      <section className="section relative py-14 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-8 hidden h-24 w-24 rounded-full border-[9px] border-blush/35 md:block"
        />

        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">em destaque</p>
              <h2 className="mt-1 text-3xl sm:text-4xl">
                Feitos para o seu dia
              </h2>
            </div>

            <Link
              href="/cardapio"
              className="hidden text-sm text-pine underline-offset-4 hover:underline sm:block"
            >
              Ver cardápio completo
            </Link>
          </div>
        </Reveal>

        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {featured.map((product, i) => (
              <Reveal
                key={product.id}
                delay={Math.min(i * 55, 260)}
                distance={22}
                scale={0.975}
              >
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message="Os destaques do cardápio aparecem aqui assim que forem cadastrados no painel." />
        )}

        <Link
          href="/cardapio"
          className="mt-7 inline-flex w-full justify-center rounded-full border border-pine/20 bg-cream-soft px-6 py-3 text-sm font-medium text-pine sm:hidden"
        >
          Ver cardápio completo
        </Link>
      </section>

      <section className="scallop-section bg-blush-light py-16 sm:py-20">
        <div className="section">
          <Reveal direction="right">
            <p className="eyebrow">o cardápio</p>
            <h2 className="mt-1 max-w-[22ch] text-3xl sm:text-4xl">
              Uma vitrine para escolher com os olhos
            </h2>
          </Reveal>

          {categories.length > 0 ? (
            <div className="scrollbar-hide mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5">
              {categories.map((category, i) => (
                <Reveal
                  key={category.id}
                  delay={Math.min(i * 45, 220)}
                  className="shrink-0 snap-start"
                  direction="left"
                  distance={18}
                >
                  <CategoryCard category={category} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState message="As categorias do cardápio aparecem aqui assim que forem cadastradas no painel." />
          )}
        </div>
      </section>

      <section className="section relative py-16 sm:py-20">
        <div
          aria-hidden
          className="pastry-sprinkles pointer-events-none absolute inset-y-10 right-0 hidden w-48 opacity-35 [mask-image:linear-gradient(to_left,black,transparent)] lg:block"
        />

        <Reveal>
          <p className="eyebrow">nossas lojas</p>
          <h2 className="mt-1 max-w-[24ch] text-3xl sm:text-4xl">
            Encontre a Caneli mais perto de você
          </h2>
        </Reveal>

        {stores.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((store, i) => (
              <Reveal
                key={store.id}
                delay={Math.min(i * 65, 220)}
                scale={0.98}
              >
                <StoreCard store={store} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message="As unidades aparecem aqui assim que forem cadastradas no painel." />
        )}
      </section>

      <section className="section pb-16 sm:pb-24">
        <Reveal direction="up" distance={32} scale={0.97}>
          <div className="frosting-panel pastry-sprinkles relative bg-pine px-5 py-12 text-center text-cream-soft shadow-float sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="absolute -left-4 -top-5 h-20 w-20 animate-float-slow rounded-full border-[8px] border-blush/55 opacity-80"
            />
            <div
              aria-hidden
              className="absolute -bottom-5 right-[8%] hidden animate-float-reverse sm:block"
            >
              <div className="macaron-stack" />
            </div>

            <p className="eyebrow text-blush">vamos combinar?</p>

            <h2 className="mx-auto mt-2 max-w-[20ch] text-3xl text-cream-soft sm:text-4xl lg:text-5xl">
              Encomende seu bolo, cesta ou kit para presentear
            </h2>

            <p className="mx-auto mt-4 max-w-[55ch] text-sm leading-relaxed text-cream-soft/75 sm:text-base">
              Um fluxo simples para transformar vontade em pedido — sem perder
              o carinho de falar com a loja.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 min-[390px]:flex-row">
              <Link
                href="/encomendas"
                className="rounded-full bg-cream-soft px-7 py-3.5 text-sm font-medium text-pine shadow-soft transition-all duration-300 hover:-translate-y-1 hover:bg-blush-light active:translate-y-0"
              >
                Fazer encomenda
              </Link>

              <Link
                href="/unidades"
                className="rounded-full border border-cream-soft/35 bg-pine-dark/25 px-7 py-3.5 text-sm font-medium text-cream-soft backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-pine-dark/45 active:translate-y-0"
              >
                Falar no WhatsApp
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-pastry border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
      {message}
    </div>
  );
}
