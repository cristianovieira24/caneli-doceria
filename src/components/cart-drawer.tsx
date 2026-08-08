"use client";

import { useEffect, useState } from "react";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { formatBRL } from "@/lib/format";
import { track } from "@/lib/analytics";
import { useSiteMode } from "@/components/site-mode-provider";
import type { Store } from "@/types/database";

export function CartDrawer() {
  const { demoMode } = useSiteMode();

  const {
    storeId,
    lines,
    drawerOpen,
    closeDrawer,
    removeLine,
    updateQuantity,
    clear,
  } = useCartStore();

  const [store, setStore] = useState<Store | null>(null);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"Retirada" | "Delivery">("Retirada");
  const [desiredTime, setDesiredTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!storeId) {
      setStore(null);
      return;
    }

    const supabase = createClient();

    supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .single()
      .then(({ data }) => setStore((data as Store) ?? null));
  }, [storeId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  useEffect(() => {
    if (drawerOpen) {
      setMounted(true);
    } else {
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [drawerOpen]);

  if (!mounted) return null;

  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );

  const canCheckout = Boolean(store && lines.length > 0);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={closeDrawer}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`relative flex h-full w-full max-w-md flex-col bg-cream-soft shadow-lift transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="text-xl font-display">Seu pedido</h2>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fechar"
            className="p-1 text-ink-soft hover:text-pine"
          >
            <X size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-sm text-ink-soft">
              Seu pedido está vazio.
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line, index) => (
                <li
                  key={index}
                  className="flex gap-3 border-b border-ink/5 pb-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-ink">
                      {line.productName}
                    </p>

                    {line.variant && (
                      <p className="text-xs text-ink-soft">
                        Variação: {line.variant}
                      </p>
                    )}

                    {line.addons && line.addons.length > 0 && (
                      <p className="text-xs text-ink-soft">
                        Adicionais: {line.addons.join(", ")}
                      </p>
                    )}

                    {line.note && (
                      <p className="text-xs text-ink-soft">
                        Obs.: {line.note}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Diminuir"
                        onClick={() =>
                          updateQuantity(index, line.quantity - 1)
                        }
                        className="rounded-full border border-ink/15 p-1 text-ink-soft hover:text-pine"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="w-4 text-center text-sm">
                        {line.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Aumentar"
                        onClick={() =>
                          updateQuantity(index, line.quantity + 1)
                        }
                        className="rounded-full border border-ink/15 p-1 text-ink-soft hover:text-pine"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <p className="text-sm font-medium">
                      {formatBRL(line.unitPrice * line.quantity)}
                    </p>

                    <button
                      type="button"
                      aria-label={`Remover ${line.productName}`}
                      onClick={() => removeLine(index)}
                      className="text-ink-soft hover:text-terracotta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="space-y-4 border-t border-ink/10 px-6 py-5">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Subtotal estimado</span>
              <span>{formatBRL(subtotal)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="input col-span-2"
              />

              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "Retirada" | "Delivery")
                }
                className="input"
              >
                <option value="Retirada">Retirada</option>
                <option value="Delivery">Delivery</option>
              </select>

              <input
                value={desiredTime}
                onChange={(e) => setDesiredTime(e.target.value)}
                placeholder="Horário desejado"
                className="input"
              />
            </div>

            <a
              href={
                canCheckout && !demoMode
                  ? buildWhatsAppOrderUrl({
                      store: store!,
                      lines,
                      customerName: name,
                      mode,
                      desiredTime,
                    })
                  : undefined
              }
              target={demoMode ? undefined : "_blank"}
              rel={demoMode ? undefined : "noreferrer"}
              aria-disabled={!canCheckout}
              onClick={(e) => {
                if (!canCheckout) {
                  e.preventDefault();
                  return;
                }

                if (demoMode) {
                  e.preventDefault();

                  window.alert(
                    "Função desativada nesta demonstração. Nenhum pedido foi enviado."
                  );

                  return;
                }

                track("checkout_started", {
                  store: store?.slug,
                  items: lines.length,
                  value: subtotal,
                });
              }}
              className={
                "block rounded-full px-6 py-3.5 text-center text-sm font-medium " +
                (canCheckout
                  ? "cursor-pointer bg-pine text-cream-soft hover:bg-pine-dark"
                  : "bg-ink/10 text-ink-soft/50")
              }
            >
              Enviar pedido pelo WhatsApp
            </a>

            <p className="text-xs text-ink-soft/70">
              {demoMode
                ? "Demonstração: nenhum pedido será enviado."
                : "Valores e disponibilidade são confirmados pela loja no WhatsApp."}
            </p>

            <button
              type="button"
              onClick={clear}
              className="text-xs text-ink-soft underline"
            >
              Esvaziar pedido
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
