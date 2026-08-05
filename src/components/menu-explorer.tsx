"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { StoreSelector } from "@/components/store-selector";
import { useCartStore } from "@/lib/store/cart-store";
import type { Category, Product, Store, Tag } from "@/types/database";

const DIET_TAGS = ["zero-acucar", "zero-lactose", "sem-gluten"];

export function MenuExplorer({
  stores,
  categories,
  products,
  tags,
}: {
  stores: Store[];
  categories: Category[];
  products: Product[];
  tags: Tag[];
}) {
  const storeId = useCartStore((s) => s.storeId);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const dietTags = tags.filter((t) => DIET_TAGS.includes(t.slug));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategory !== "all" && p.category_id !== activeCategory) return false;
      if (query && !p.name.toLowerCase().includes(query) && !p.short_description?.toLowerCase().includes(query)) {
        return false;
      }
      if (activeTags.length > 0) {
        const productTagSlugs = p.tags?.map((t) => t.slug) ?? [];
        if (!activeTags.every((t) => productTagSlugs.includes(t))) return false;
      }
      return true;
    });
  }, [products, search, activeCategory, activeTags]);

  function availabilityFor(product: Product): "available" | "unavailable" | "unknown" {
    if (!storeId) return "unknown";
    const link = product.store_products?.find((sp) => sp.store_id === storeId);
    if (!link || link.hidden) return "unavailable";
    return link.available ? "available" : "unavailable";
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StoreSelector stores={stores} />

        <div className="relative sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60" />
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
        <p className="mt-4 rounded-card bg-blush-light px-4 py-3 text-sm text-ink-soft">
          Escolha sua unidade acima para ver preço e disponibilidade exatos — eles podem variar
          entre as lojas.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
          Tudo
        </FilterPill>
        {categories.map((c) => (
          <FilterPill key={c.id} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>
            {c.name}
          </FilterPill>
        ))}
      </div>

      {dietTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {dietTags.map((tag) => {
            const active = activeTags.includes(tag.slug);
            return (
              <FilterPill
                key={tag.id}
                active={active}
                variant="tag"
                onClick={() =>
                  setActiveTags((prev) => (active ? prev.filter((t) => t !== tag.slug) : [...prev, tag.slug]))
                }
              >
                {tag.name}
              </FilterPill>
            );
          })}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} availability={availabilityFor(product)} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-card border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-10 text-center text-sm text-ink-soft">
          Nada encontrado com esses filtros. Tente limpar a busca ou escolher outra categoria.
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
        "rounded-full border px-4 py-2 text-sm transition-colors " +
        (active
          ? variant === "tag"
            ? "border-terracotta bg-terracotta text-cream-soft"
            : "border-pine bg-pine text-cream-soft"
          : "border-ink/15 bg-cream-soft text-ink-soft hover:border-pine hover:text-pine")
      }
    >
      {children}
    </button>
  );
}
