import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ViewTracker } from "@/components/view-tracker";
import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/types/database";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient();

  const { data } = await supabase
    .from("products")
    .select(
      "*, images:product_images(*), variants:product_variants(*), addons:product_addons(*), tags:product_tags(tag:tags(*))"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return null;

  type RawProduct = Omit<Product, "tags"> & {
    tags: { tag: NonNullable<Product["tags"]>[number] }[];
  };

  const raw = data as unknown as RawProduct;

  return {
    ...raw,
    tags: raw.tags?.map((t) => t.tag) ?? [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await getProduct(params.slug);

    if (!product) return {};

    const image =
      product.images?.find((i) => i.is_primary) ?? product.images?.[0];

    return {
      title: product.seo_title || product.name,
      description:
        product.seo_description ||
        product.short_description ||
        undefined,
      alternates: {
        canonical: `/cardapio/${product.slug}`,
      },
      openGraph: {
        title: product.seo_title || product.name,
        description:
          product.seo_description ||
          product.short_description ||
          undefined,
        images: image ? [{ url: image.url }] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: Product | null = null;

  try {
    product = await getProduct(params.slug);
  } catch {
    // Supabase não configurado neste ambiente — ver README.
  }

  if (!product) notFound();

  const images = product.images?.length ? product.images : [];

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.canelidoceria.com.br";

  return (
    <div className="section py-12">
      <ViewTracker
        event="product_view"
        params={{ product: product.slug }}
      />

      {!DEMO_MODE && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description:
              product.short_description ||
              product.full_description ||
              undefined,
            image: images[0]?.url,
            url: `${SITE_URL}/cardapio/${product.slug}`,
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              price: product.promo_price ?? product.price,
              availability:
                product.status === "published"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `${SITE_URL}/cardapio/${product.slug}`,
            },
          }}
        />
      )}

      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Cardápio", href: "/cardapio" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="arch-frame relative aspect-[4/5] bg-blush-light">
          {images[0] ? (
            <Image
              src={images[0].url}
              alt={images[0].alt || product.name}
              fill
              sizes="50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-soft/60">
              Foto em breve
            </div>
          )}
        </div>

        <div>
          {product.seasonal && (
            <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-xs font-medium text-cream-soft">
              Sazonal
            </span>
          )}

          <h1 className="text-3xl">{product.name}</h1>

          {product.weight_or_size && (
            <p className="mt-1 text-sm text-ink-soft">
              {product.weight_or_size}
            </p>
          )}

          {product.yield_info && (
            <p className="text-sm text-ink-soft">
              {product.yield_info}
            </p>
          )}

          <p className="mt-4 text-lg font-semibold text-ink">
            {product.price_prefix === "a partir de" &&
              "a partir de "}
            {formatBRL(product.promo_price ?? product.price)}
          </p>

          {product.full_description && (
            <p className="mt-4 max-w-[55ch] leading-relaxed text-ink-soft">
              {product.full_description}
            </p>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-pine/10 px-3 py-1 text-xs text-pine"
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 border-t border-ink/10 pt-6">
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
