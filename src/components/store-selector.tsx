"use client";

import { useEffect, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { track } from "@/lib/analytics";
import type { Store } from "@/types/database";

export function StoreSelector({ stores }: { stores: Store[] }) {
  const storeId = useCartStore((s) => s.storeId);
  const setStore = useCartStore((s) => s.setStore);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !storeId && stores.length === 1) {
      setStore(stores[0].id);
    }
  }, [hydrated, storeId, stores, setStore]);

  if (!hydrated) return null;

  const current = stores.find((s) => s.id === storeId);

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-full border border-ink/15 bg-cream-soft px-4 py-2.5 text-left text-sm text-ink shadow-soft transition-colors hover:border-pine sm:inline-flex sm:w-auto"
      >
        <span className="flex min-w-0 items-center gap-2">
          <MapPin size={16} className="shrink-0 text-pine" />

          {current ? (
            <span className="min-w-0 truncate">
              Pedindo em{" "}
              <strong className="font-medium">{current.name}</strong>
            </span>
          ) : (
            <span>Escolha sua unidade</span>
          )}
        </span>

        <ChevronDown
          size={16}
          className={
            "shrink-0 transition-transform duration-300 " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-30 mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-pastry border border-ink/10 bg-cream-soft shadow-lift"
        >
          {stores.map((store) => (
            <li key={store.id}>
              <button
                type="button"
                role="option"
                aria-selected={store.id === storeId}
                onClick={() => {
                  setStore(store.id);
                  track("store_selected", { store: store.slug });
                  setOpen(false);
                }}
                className="flex w-full flex-col items-start gap-0.5 px-4 py-3.5 text-left text-sm transition-colors hover:bg-blush-light"
              >
                <span className="font-medium text-ink">{store.name}</span>
                <span className="text-ink-soft">{store.neighborhood}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
