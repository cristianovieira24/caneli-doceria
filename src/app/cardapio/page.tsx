import type { Metadata } from "next";
import { MenuExplorer } from "@/components/menu-explorer";
import { Reveal } from "@/components/reveal";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Store, Tag } from "@/types/database";

export const metadata: Metadata = {
  title: "Cardápio",
  description:
    "Croissants, tortas, cafés e mais. Confira o cardápio da Caneli Doceria e peça pelo WhatsApp.",
};

async function getMenu() {
  const supabase = createClient();

  const [
    { data: stores },
    { data: categories },
    { data: tags },
    { data: products },
  ] = await Promise.all([
    supabase
      .from("stores")
      .select("*")
      .eq("status", "active")
      .order("display_order"),
    supabase
      .from("categories")
      .select("*")
      .eq("visible", true)
      .order("display_order"),
    supabase.from("tags").select("*"),
    supabase
      .from("products")
      .select(
        "*, images:product_images(*), tags:product_tags(tag:tags(*)), store_products(*)"
      )
      .eq("status", "published")
      .order("display_order"),
  ]);

  type RawProduct = Omit<Product, "tags"> & { tags: { tag: Tag }[] };

  const flattenedProducts: Product[] = (
    (products as unknown as RawProduct[]) ?? []
  ).map((p) => ({
    ...p,
    tags: p.tags?.map((t) => t.tag) ?? [],
  }));

  return {
    stores: (stores as Store[]) ?? [],
    categories: (categories as Category[]) ?? [],
    tags: (tags as Tag[]) ?? [],
    products: flattenedProducts,
  };
}

export default async function CardapioPage() {
  let stores: Store[] = [];
  let categories: Category[] = [];
  let tags: Tag[] = [];
  let products: Product[] = [];

  try {
    const data = await getMenu();
    stores = data.stores;
    categories = data.categories;
    tags = data.tags;
    products = data.products;
  } catch {
    // Supabase ainda não configurado neste ambiente.
  }

  return (
    <div className="section relative py-8 sm:py-12">
      <div
        aria-hidden
        className="pastry-sprinkles pointer-events-none absolute right-0 top-0 hidden h-40 w-48 opacity-30 [mask-image:linear-gradient(to_left,black,transparent)] md:block"
      />

      <Reveal>
        <p className="eyebrow">o cardápio</p>
        <h1 className="mt-1 max-w-[24ch] text-3xl min-[380px]:text-4xl">
          Croissants, tortas, cafés & doces
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft sm:text-base">
          Escolha a unidade mais perto de você para ver preço e disponibilidade
          exatos — o cardápio pode variar entre as lojas.
        </p>
      </Reveal>

      <Reveal delay={90} distance={20}>
        <div className="mt-7 sm:mt-8">
          <MenuExplorer
            stores={stores}
            categories={categories}
            products={products}
            tags={tags}
          />
        </div>
      </Reveal>

      {products.length === 0 && stores.length === 0 && (
        <div className="mt-10 rounded-pastry border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
          O cardápio aparece aqui assim que o Supabase estiver configurado e o
          seed for aplicado (ver README).
        </div>
      )}
    </div>
  );
}
