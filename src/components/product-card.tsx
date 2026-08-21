"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "@/lib/format";
import { resolveProductForStore } from "@/lib/product-for-store";
import { useCartStore } from "@/lib/store/cart-store";
import { QuickAddButton } from "@/components/quick-add-button";
import type { Product } from "@/types/database";

export function ProductCard({
  product: originalProduct,
  availability,
}: {
  product: Product;
  availability?: "available" | "unavailable" | "unknown";
}) {
  const storeId = useCartStore((state) => state.storeId);
  const resolved = resolveProductForStore(originalProduct, storeId);
  const product = availability === undefined ? resolved.product : originalProduct;
  const currentAvailability = availability ?? resolved.availability;
  const primaryImage =
    product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const categoryImage = !primaryImage ? product.category?.image_url : null;
  const isDraft = product.status !== "published";
  const isUnavailableHere = currentAvailability === "unavailable";
  const needsCustomization =
    (product.variants?.length ?? 0) > 0 ||
    (product.addons?.length ?? 0) > 0;

  return (
    <article className="pastry-card group flex h-full min-w-0 flex-col overflow-hidden bg-cream-soft shadow-soft transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={`/cardapio/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-blush-light"
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, (min-width: 380px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
          />
        ) : categoryImage ? (
          <>
            <Image
              src={categoryImage}
              alt={`Imagem ilustrativa da categoria ${product.category?.name ?? "do produto"}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, (min-width: 380px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
            />
            <span className="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-ink/65 px-2.5 py-1 text-[10px] font-medium text-cream-soft backdrop-blur-sm">
              Imagem ilustrativa
            </span>
          </>
        ) : (
          <div className="pastry-surface flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
            <span className="font-script text-2xl text-pine/75">caneli</span>
            <span className="text-xs text-ink-soft/60">
              Foto deste produto em breve
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {product.seasonal && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-medium text-cream-soft shadow-soft">
            Sazonal
          </span>
        )}

        {(isDraft || isUnavailableHere) && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/45 px-3 text-center text-sm font-medium text-cream-soft backdrop-blur-[1px]">
            {isUnavailableHere ? "Indisponível nesta unidade" : "Indisponível"}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
        <Link href={`/cardapio/${product.slug}`} className="min-w-0">
          <h3 className="line-clamp-2 font-display text-lg leading-tight transition-colors group-hover:text-pine">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {product.short_description}
          </p>
        )}

        <div className="mt-auto flex min-w-0 flex-col items-stretch gap-2.5 pt-2 min-[440px]:flex-row min-[440px]:items-center min-[440px]:justify-between">
          <PriceTag product={product} />

          {needsCustomization ? (
            <Link
              href={`/cardapio/${product.slug}`}
              aria-disabled={isUnavailableHere}
              className={
                "rounded-full border px-4 py-2 text-center text-sm transition-all duration-300 min-[440px]:shrink-0 " +
                (isUnavailableHere
                  ? "pointer-events-none border-ink/10 text-ink-soft/50"
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
      <p className="min-w-0 text-sm leading-tight">
        <span className="mr-1.5 text-ink-soft/60 line-through">
          {formatBRL(product.price)}
        </span>
        <span className="font-semibold text-terracotta">
          {formatBRL(product.promo_price)}
        </span>
      </p>
    );
  }

  return (
    <p className="min-w-0 text-sm font-semibold leading-tight text-ink">
      {prefix}
      {formatBRL(product.price)}
    </p>
  );
}
