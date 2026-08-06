import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "@/lib/format";
import { QuickAddButton } from "@/components/quick-add-button";
import type { Product } from "@/types/database";

export function ProductCard({
  product,
  availability = "unknown",
}: {
  product: Product;
  availability?: "available" | "unavailable" | "unknown";
}) {
  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const isDraft = product.status !== "published";
  const isUnavailableHere = availability === "unavailable";
  const needsCustomization = (product.variants?.length ?? 0) > 0 || (product.addons?.length ?? 0) > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-cream-soft shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5">
      <Link href={`/cardapio/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-blush-light">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft/60">
            Foto em breve
          </div>
        )}
        {product.seasonal && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-medium text-cream-soft">
            Sazonal
          </span>
        )}
        {(isDraft || isUnavailableHere) && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/40 text-center text-sm font-medium text-cream-soft px-3">
            {isUnavailableHere ? "Indisponível nesta unidade" : "Indisponível"}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/cardapio/${product.slug}`}>
          <h3 className="font-display text-lg leading-tight hover:text-pine transition-colors">{product.name}</h3>
        </Link>
        {product.short_description && (
          <p className="line-clamp-2 text-sm text-ink-soft">{product.short_description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag product={product} />
          {needsCustomization ? (
            <Link
              href={`/cardapio/${product.slug}`}
              aria-disabled={isUnavailableHere}
              className={
                "rounded-full border px-4 py-1.5 text-sm transition-colors " +
                (isUnavailableHere
                  ? "border-ink/10 text-ink-soft/50 pointer-events-none"
                  : "border-pine/30 text-pine hover:bg-pine hover:text-cream-soft")
              }
            >
              {isUnavailableHere ? "Indisponível" : "Escolher"}
            </Link>
          ) : (
            <QuickAddButton product={product} disabled={isUnavailableHere} />
          )}
        </div>
      </div>
    </article>
  );
}

function PriceTag({ product }: { product: Product }) {
  const prefix = product.price_prefix === "a partir de" ? "a partir de " : "";
  if (product.promo_price) {
    return (
      <p className="text-sm">
        <span className="mr-1.5 text-ink-soft/60 line-through">{formatBRL(product.price)}</span>
        <span className="font-semibold text-terracotta">{formatBRL(product.promo_price)}</span>
      </p>
    );
  }
  return (
    <p className="text-sm font-semibold text-ink">
      {prefix}
      {formatBRL(product.price)}
    </p>
  );
}
