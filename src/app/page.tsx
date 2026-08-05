import Link from "next/link";
import { Hero } from "@/components/hero";
import { CampaignBanner } from "@/components/campaign-banner";
import { ProductCard } from "@/components/product-card";
import { CategoryCard } from "@/components/category-card";
import { StoreCard } from "@/components/store-card";
import { JsonLd } from "@/components/json-ld";
import { createClient } from "@/lib/supabase/server";
import type { Campaign, Category, Product, Store } from "@/types/database";

async function getHomeData() {
  const supabase = createClient();

  const [{ data: featured }, { data: categories }, { data: stores }, { data: campaigns }] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("status", "published")
      .eq("featured", true)
      .order("display_order")
      .limit(8),
    supabase.from("categories").select("*").eq("visible", true).order("display_order"),
    supabase.from("stores").select("*").eq("status", "active").order("display_order"),
    supabase.from("campaigns").select("*").order("priority", { ascending: false }).limit(1),
  ]);

  return {
    featured: (featured as Product[]) ?? [],
    categories: (categories as Category[]) ?? [],
    stores: (stores as Store[]) ?? [],
    campaign: ((campaigns as Campaign[]) ?? [])[0] ?? null,
  };
}

export default async function HomePage() {
  let featured: Product[] = [];
  let categories: Category[] = [];
  let stores: Store[] = [];
  let campaign: Campaign | null = null;

  try {
    const data = await getHomeData();
    featured = data.featured;
    categories = data.categories;
    stores = data.stores;
    campaign = data.campaign;
  } catch {
    // Supabase ainda não configurado neste ambiente — a página renderiza
    // com estados vazios em vez de quebrar. Ver README para configurar
    // NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Bakery",
          name: "Caneli Doceria",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.canelidoceria.com.br",
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
      <Hero />
      {campaign && <CampaignBanner campaign={campaign} />}

      <section className="section py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">em destaque</p>
            <h2 className="mt-1 text-3xl sm:text-4xl">Feitos para o seu dia</h2>
          </div>
          <Link href="/cardapio" className="hidden text-sm text-pine hover:underline sm:block">
            Ver cardápio completo
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState message="Os destaques do cardápio aparecem aqui assim que forem cadastrados no painel." />
        )}
      </section>

      <section className="bg-blush-light/60 py-16">
        <div className="section">
          <p className="eyebrow">o cardápio</p>
          <h2 className="mt-1 text-3xl sm:text-4xl">Explore por categoria</h2>

          {categories.length > 0 ? (
            <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <EmptyState message="As categorias do cardápio aparecem aqui assim que forem cadastradas no painel." />
          )}
        </div>
      </section>

      <section className="section py-16">
        <p className="eyebrow">nossas lojas</p>
        <h2 className="mt-1 text-3xl sm:text-4xl">Encontre a Caneli mais perto de você</h2>

        {stores.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <EmptyState message="As unidades aparecem aqui assim que forem cadastradas no painel." />
        )}
      </section>

      <section className="section pb-20">
        <div className="arch-frame flex flex-col items-center gap-4 bg-pine px-8 py-14 text-center text-cream-soft sm:px-16">
          <p className="eyebrow text-blush">vamos combinar?</p>
          <h2 className="max-w-[20ch] text-3xl text-cream-soft sm:text-4xl">
            Encomende seu bolo, cesta ou kit para presentear
          </h2>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/encomendas"
              className="rounded-full bg-cream-soft px-7 py-3.5 text-sm font-medium text-pine hover:bg-blush-light"
            >
              Fazer encomenda
            </Link>
            <Link
              href="/unidades"
              className="rounded-full border border-cream-soft/40 px-7 py-3.5 text-sm font-medium text-cream-soft hover:bg-pine-dark"
            >
              Falar no WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
      {message}
    </div>
  );
}
