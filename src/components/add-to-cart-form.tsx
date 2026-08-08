"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatBRL } from "@/lib/format";
import { track } from "@/lib/analytics";
import type { Product } from "@/types/database";

export function AddToCartForm({ product }: { product: Product }) {
  const storeId = useCartStore((s) => s.storeId);
  const addLine = useCartStore((s) => s.addLine);
  const router = useRouter();

  const [variantId, setVariantId] = useState(product.variants?.[0]?.id ?? "");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = product.variants?.find((v) => v.id === variantId);
  const selectedAddons = useMemo(
    () => product.addons?.filter((a) => addonIds.includes(a.id)) ?? [],
    [product.addons, addonIds]
  );

  const unitPrice = useMemo(() => {
    const base = product.promo_price ?? product.price;
    const variantDelta = variant?.price_delta ?? 0;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return base + variantDelta + addonsTotal;
  }, [product, variant, selectedAddons]);

  function toggleAddon(id: string) {
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  function handleAdd() {
    addLine({
      productId: product.id,
      productName: product.name,
      quantity,
      variant: variant?.name,
      addons: selectedAddons.map((a) => a.name),
      note: note.trim() || undefined,
      unitPrice,
    });

    track("add_to_cart", {
      product: product.slug,
      quantity,
      value: unitPrice * quantity,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  if (!storeId) {
    return (
      <div className="rounded-pastry bg-blush-light px-4 py-3 text-sm leading-relaxed text-ink-soft">
        Escolha sua unidade no{" "}
        <button
          type="button"
          onClick={() => router.push("/cardapio")}
          className="text-pine underline underline-offset-4"
        >
          cardápio
        </button>{" "}
        antes de adicionar itens ao pedido.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {product.variants && product.variants.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Tamanho</legend>

          <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                aria-pressed={variantId === v.id}
                className={
                  "shrink-0 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 " +
                  (variantId === v.id
                    ? "border-pine bg-pine text-cream-soft shadow-soft"
                    : "border-ink/15 bg-cream-soft text-ink-soft hover:border-pine hover:text-pine")
                }
              >
                {v.name}
                {v.price_delta !== 0 && ` (+${formatBRL(v.price_delta)})`}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {product.addons && product.addons.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">
            Adicionais
          </legend>

          <div className="grid gap-2">
            {product.addons.map((a) => (
              <label
                key={a.id}
                className="flex min-h-11 items-center gap-3 rounded-xl border border-ink/10 bg-cream-soft px-3 py-2.5 text-sm text-ink-soft"
              >
                <input
                  type="checkbox"
                  checked={addonIds.includes(a.id)}
                  onChange={() => toggleAddon(a.id)}
                  className="h-4 w-4 accent-pine"
                />
                <span className="min-w-0">
                  {a.name} (+{formatBRL(a.price)})
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label
          htmlFor="note"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Observações (opcional)
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex.: sem chantilly, café mais forte…"
          className="input"
        />
      </div>

      <div className="flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-ink/15 bg-cream-soft px-3 py-1.5">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush-light hover:text-pine"
          >
            <Minus size={16} />
          </button>

          <span className="w-4 text-center text-sm font-medium">{quantity}</span>

          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((q) => q + 1)}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush-light hover:text-pine"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="text-lg font-semibold text-ink">
          {formatBRL(unitPrice * quantity)}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-cream-soft shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
      >
        {justAdded ? "Adicionado ✓" : "Adicionar ao pedido"}
      </button>
    </div>
  );
}
