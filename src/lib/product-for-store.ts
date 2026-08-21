import type { Product } from "@/types/database";

export type ProductAvailability = "available" | "unavailable" | "unknown";

export function getProductUnitPrice(product: Product): number {
  return product.promo_price !== null && product.promo_price > 0
    ? product.promo_price
    : product.price;
}

export function resolveProductForStore(
  product: Product,
  storeId: string | null
): { product: Product; availability: ProductAvailability } {
  if (!storeId) return { product, availability: "unknown" };

  const link = product.store_products?.find((item) => item.store_id === storeId);

  if (!link || link.hidden) {
    return { product, availability: "unavailable" };
  }

  return {
    product: {
      ...product,
      price: link.price_override ?? product.price,
      promo_price: link.promo_price_override ?? product.promo_price,
    },
    availability: link.available ? "available" : "unavailable",
  };
}
