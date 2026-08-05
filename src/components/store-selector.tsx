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

  // Avoid a hydration mismatch: the persisted value only exists in the
  // browser, so we read it after mount.
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !storeId && stores.length === 1) {
      setStore(stores[0].id);
    }
  }, [hydrated, storeId, stores, setStore]);

  if (!hydrated) return null;

  const current = stores.find((s) => s.id === storeId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-soft px-4 py-2.5 text-sm text-ink hover:border-pine"
      >
        <MapPin size={16} className="text-pine" />
        {current ? (
          <span>
            Pedindo em <strong className="font-medium">{current.name}</strong>
          </span>
        ) : (
          <span>Escolha sua unidade</span>
        )}
        <ChevronDown size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-30 mt-2 w-72 overflow-hidden rounded-card border border-ink/10 bg-cream-soft shadow-lift"
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
                className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left text-sm hover:bg-blush-light"
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
