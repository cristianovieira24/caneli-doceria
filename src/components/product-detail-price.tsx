"use client";

import { formatBRL } from "@/lib/format";
import { resolveProductForStore } from "@/lib/product-for-store";
import { useCartStore } from "@/lib/store/cart-store";
import type { Product } from "@/types/database";

export function ProductDetailPrice({ product }: { product: Product }) {
  const storeId = useCartStore((state) => state.storeId);
  const { product: pricedProduct } = resolveProductForStore(product, storeId);

  return (
    <p className="mt-5 text-xl font-semibold text-ink">
      {pricedProduct.price_prefix === "a partir de" && "a partir de "}
      {formatBRL(pricedProduct.promo_price ?? pricedProduct.price)}
    </p>
  );
}
