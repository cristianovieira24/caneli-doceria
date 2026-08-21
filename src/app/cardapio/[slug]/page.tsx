import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ProductDetailPrice } from "@/components/product-detail-price";
import { Reveal } from "@/components/reveal";
import { ViewTracker } from "@/components/view-tracker";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient();

  const { data } = await supabase
    .from("products")
    .select(
      "*, category:categories(id, slug, name, image_url), images:product_images(*), variants:product_variants(*), addons:product_addons(*), tags:product_tags(tag:tags(*)), store_products(*)"
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
    const imageUrl = image?.url ?? product.category?.image_url;

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
        images: imageUrl ? [{ url: imageUrl }] : undefined,
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

  const primaryImage =
    product.images?.find((image) => image.is_primary) ?? product.images?.[0];
  const categoryImage = !primaryImage ? product.category?.image_url : null;
  const structuredImage = primaryImage?.url ?? categoryImage ?? undefined;

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.canelidoceria.com.br";

  return (
    <div className="section py-8 sm:py-12">
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
            image: structuredImage,
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

      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal direction="right" scale={0.98}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-[42%_42%_32px_32px] bg-blush-light shadow-lift lg:max-w-none">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.025]"
              />
            ) : categoryImage ? (
              <>
                <Image
                  src={categoryImage}
                  alt={`Imagem ilustrativa da categoria ${product.category?.name ?? "do produto"}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.025]"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-ink/65 px-3 py-1.5 text-xs font-medium text-cream-soft backdrop-blur-sm">
                  Imagem ilustrativa da categoria
                </span>
              </>
            ) : (
              <div className="pastry-surface flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <span className="font-script text-4xl text-pine/75">caneli</span>
                <span className="text-sm text-ink-soft/60">
                  Foto deste produto em breve
                </span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal direction="left" delay={80} distance={24}>
          <div className="min-w-0">
            {product.seasonal && (
              <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-xs font-medium text-cream-soft shadow-soft">
                Sazonal
              </span>
            )}

            <h1 className="text-3xl min-[380px]:text-4xl">{product.name}</h1>

            {product.weight_or_size && (
              <p className="mt-2 text-sm text-ink-soft">
                {product.weight_or_size}
              </p>
            )}

            {product.yield_info && (
              <p className="text-sm text-ink-soft">{product.yield_info}</p>
            )}

            <ProductDetailPrice product={product} />

            {product.full_description && (
              <p className="mt-4 max-w-[55ch] leading-relaxed text-ink-soft">
                {product.full_description}
              </p>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full bg-pine/10 px-3 py-1.5 text-xs text-pine"
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
        </Reveal>
      </div>
    </div>
  );
}
