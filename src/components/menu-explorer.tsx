"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { StoreSelector } from "@/components/store-selector";
import { resolveProductForStore } from "@/lib/product-for-store";
import { useCartStore } from "@/lib/store/cart-store";
import type { Category, Product, Store, Tag } from "@/types/database";

const DIET_TAGS = ["zero-acucar", "zero-lactose", "sem-gluten"];

export function MenuExplorer({
  stores,
  categories,
  products,
  tags,
  initialCategorySlug,
}: {
  stores: Store[];
  categories: Category[];
  products: Product[];
  tags: Tag[];
  initialCategorySlug?: string;
}) {
  const storeId = useCartStore((s) => s.storeId);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">(
    () =>
      categories.find((category) => category.slug === initialCategorySlug)?.id ??
      "all"
  );
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const dietTags = tags.filter((t) => DIET_TAGS.includes(t.slug));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((p) => {
      if (activeCategory !== "all" && p.category_id !== activeCategory) {
        return false;
      }

      if (
        query &&
        !p.name.toLowerCase().includes(query) &&
        !p.short_description?.toLowerCase().includes(query)
      ) {
        return false;
      }

      if (activeTags.length > 0) {
        const productTagSlugs = p.tags?.map((t) => t.slug) ?? [];
        if (!activeTags.every((t) => productTagSlugs.includes(t))) return false;
      }

      return true;
    });
  }, [products, search, activeCategory, activeTags]);

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <StoreSelector stores={stores} />

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar no cardápio…"
            className="input pl-10"
            aria-label="Buscar produto"
          />
        </div>
      </div>

      {!storeId && (
        <p className="mt-4 rounded-pastry bg-blush-light px-4 py-3 text-sm leading-relaxed text-ink-soft">
          Os valores exibidos são de referência. Escolha uma unidade para
          confirmar preços e disponibilidade.
        </p>
      )}

      <div className="scrollbar-hide -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        <FilterPill
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        >
          Tudo
        </FilterPill>

        {categories.map((c) => (
          <FilterPill
            key={c.id}
            active={activeCategory === c.id}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.name}
          </FilterPill>
        ))}
      </div>

      {dietTags.length > 0 && (
        <div className="scrollbar-hide -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {dietTags.map((tag) => {
            const active = activeTags.includes(tag.slug);

            return (
              <FilterPill
                key={tag.id}
                active={active}
                variant="tag"
                onClick={() =>
                  setActiveTags((prev) =>
                    active
                      ? prev.filter((t) => t !== tag.slug)
                      : [...prev, tag.slug]
                  )
                }
              >
                {tag.name}
              </FilterPill>
            );
          })}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {filtered.map((product) => {
            const resolved = resolveProductForStore(product, storeId);

            return (
              <ProductCard
                key={product.id}
                product={resolved.product}
                availability={resolved.availability}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-10 rounded-pastry border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
          Nada encontrado com esses filtros. Tente limpar a busca ou escolher
          outra categoria.
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  variant = "category",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "category" | "tag";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "shrink-0 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 " +
        (active
          ? variant === "tag"
            ? "border-terracotta bg-terracotta text-cream-soft shadow-soft"
            : "border-pine bg-pine text-cream-soft shadow-soft"
          : "border-ink/15 bg-cream-soft text-ink-soft hover:-translate-y-0.5 hover:border-pine hover:text-pine")
      }
    >
      {children}
    </button>
  );
}
