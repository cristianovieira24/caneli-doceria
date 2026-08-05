"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types/database";

interface CartStore {
  storeId: string | null;
  lines: CartLine[];
  drawerOpen: boolean;
  setStore: (storeId: string) => void;
  addLine: (line: CartLine) => void;
  removeLine: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

/**
 * Cart lives in the browser only (localStorage via zustand persist) —
 * there is no server-side "order" record yet in phase 2. The store
 * choice also lives here so it's remembered across the visit; switching
 * stores clears the cart because prices/availability can differ.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      storeId: null,
      lines: [],
      drawerOpen: false,
      setStore: (storeId) =>
        set((state) => (state.storeId === storeId ? state : { storeId, lines: [] })),
      addLine: (line) => set((state) => ({ lines: [...state.lines, line], drawerOpen: true })),
      removeLine: (index) =>
        set((state) => ({ lines: state.lines.filter((_, i) => i !== index) })),
      updateQuantity: (index, quantity) =>
        set((state) => ({
          lines: state.lines.map((l, i) => (i === index ? { ...l, quantity: Math.max(1, quantity) } : l)),
        })),
      clear: () => set({ lines: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "caneli-cart",
      partialize: (state) => ({ storeId: state.storeId, lines: state.lines }),
    }
  )
);

export function useCartCount() {
  return useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
}
