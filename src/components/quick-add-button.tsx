"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { track } from "@/lib/analytics";
import type { Product } from "@/types/database";

export function QuickAddButton({ product, disabled }: { product: Product; disabled?: boolean }) {
  const storeId = useCartStore((s) => s.storeId);
  const addLine = useCartStore((s) => s.addLine);
  const [justAdded, setJustAdded] = useState(false);
  const [needsStore, setNeedsStore] = useState(false);

  function handleClick() {
    if (!storeId) {
      setNeedsStore(true);
      setTimeout(() => setNeedsStore(false), 2500);
      return;
    }
    addLine({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.promo_price ?? product.price,
    });
    track("add_to_cart", { product: product.slug, quantity: 1, value: product.promo_price ?? product.price });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={`Adicionar ${product.name} ao pedido`}
        className={
          "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-all active:scale-95 " +
          (disabled
            ? "border-ink/10 text-ink-soft/50"
            : justAdded
              ? "border-pine bg-pine text-cream-soft"
              : "border-pine/30 text-pine hover:bg-pine hover:text-cream-soft")
        }
      >
        {justAdded ? (
          <>
            <Check size={14} /> Adicionado
          </>
        ) : disabled ? (
          "Indisponível"
        ) : (
          <>
            <ShoppingBag size={14} /> Adicionar
          </>
        )}
      </button>
      {needsStore && (
        <div className="absolute bottom-full right-0 mb-2 w-44 rounded-lg bg-ink px-3 py-2 text-xs text-cream-soft shadow-lift">
          Escolha sua loja no cardápio antes de adicionar
        </div>
      )}
    </div>
  );
}
