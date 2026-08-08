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
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }

    const t = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(t);
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
        className={
          "absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 " +
          (drawerOpen ? "opacity-100" : "opacity-0")
        }
      />

      <aside
        aria-label="Carrinho"
        className={
          "relative flex h-[100dvh] w-full max-w-md flex-col bg-cream-soft shadow-float transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] min-[520px]:rounded-l-[34px] " +
          (drawerOpen ? "translate-x-0" : "translate-x-full")
        }
      >
        <header className="safe-top flex items-center justify-between border-b border-ink/10 px-4 py-4 min-[380px]:px-6 min-[380px]:py-5">
          <div>
            <p className="eyebrow text-xl">seu momento doce</p>
            <h2 className="mt-0.5 text-xl font-display">Seu pedido</h2>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fechar"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:bg-blush-light hover:text-pine"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overscroll-contain overflow-y-auto px-4 py-4 min-[380px]:px-6">
          {lines.length === 0 ? (
            <div className="pastry-surface mt-6 rounded-pastry px-5 py-10 text-center">
              <p className="font-display text-xl text-ink">Seu pedido está vazio.</p>
              <p className="mt-2 text-sm text-ink-soft">
                Escolha uma unidade e adicione seus favoritos.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((line, index) => (
                <li
                  key={index}
                  className="pastry-card flex gap-3 bg-cream px-4 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium text-ink">
                      {line.productName}
                    </p>

                    {line.variant && (
                      <p className="mt-1 text-xs text-ink-soft">
                        Variação: {line.variant}
                      </p>
                    )}

                    {line.addons && line.addons.length > 0 && (
                      <p className="text-xs leading-relaxed text-ink-soft">
                        Adicionais: {line.addons.join(", ")}
                      </p>
                    )}

                    {line.note && (
                      <p className="text-xs leading-relaxed text-ink-soft">
                        Obs.: {line.note}
                      </p>
                    )}

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-soft px-2 py-1">
                      <button
                        type="button"
                        aria-label="Diminuir"
                        onClick={() =>
                          updateQuantity(index, line.quantity - 1)
                        }
                        className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush-light hover:text-pine"
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
                        className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush-light hover:text-pine"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between">
                    <p className="text-sm font-medium">
                      {formatBRL(line.unitPrice * line.quantity)}
                    </p>

                    <button
                      type="button"
                      aria-label={`Remover ${line.productName}`}
                      onClick={() => removeLine(index)}
                      className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="safe-bottom space-y-4 border-t border-ink/10 bg-cream-soft/95 px-4 pt-4 backdrop-blur min-[380px]:px-6 min-[380px]:pt-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-ink-soft">
                Subtotal estimado
              </span>
              <span className="text-lg font-semibold text-ink">
                {formatBRL(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="input min-[400px]:col-span-2"
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
                "block rounded-full px-6 py-3.5 text-center text-sm font-medium transition-all duration-300 " +
                (canCheckout
                  ? "cursor-pointer bg-pine text-cream-soft shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
                  : "bg-ink/10 text-ink-soft/50")
              }
            >
              Enviar pedido pelo WhatsApp
            </a>

            <div className="flex flex-col gap-2 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
              <p className="text-xs leading-relaxed text-ink-soft/70">
                {demoMode
                  ? "Demonstração: nenhum pedido será enviado."
                  : "Valores e disponibilidade são confirmados pela loja no WhatsApp."}
              </p>

              <button
                type="button"
                onClick={clear}
                className="shrink-0 self-start text-xs text-ink-soft underline underline-offset-4 hover:text-terracotta"
              >
                Esvaziar pedido
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
