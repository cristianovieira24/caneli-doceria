"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { useSiteMode } from "@/components/site-mode-provider";
import type { Store } from "@/types/database";

export function StoreCard({ store }: { store: Store }) {
  const { demoMode } = useSiteMode();

  return (
    <article className="pastry-card group flex h-full min-w-0 flex-col overflow-hidden bg-cream-soft shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-blush-light">
        {store.photo_url ? (
          <Image
            src={store.photo_url}
            alt={store.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="pastry-surface flex h-full items-center justify-center text-sm text-ink-soft/60">
            Foto em breve
          </div>
        )}

        <div
          aria-hidden
          className="absolute -right-3 -top-3 h-14 w-14 rounded-full border-[6px] border-cream-soft/55 shadow-soft"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-5">
        <div>
          <h3 className="font-display text-xl leading-tight">{store.name}</h3>
          <p className="mt-1 text-sm font-medium text-terracotta">
            {store.neighborhood}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-ink-soft">{store.address}</p>

        <div className="mt-auto grid grid-cols-1 gap-2 pt-4 min-[380px]:grid-cols-2 sm:flex sm:flex-wrap">
          <TrackedLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              store.address
            )}`}
            target="_blank"
            rel="noreferrer"
            event="map_click"
            params={{ store: store.slug }}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm transition-all duration-300 hover:border-pine hover:text-pine sm:flex-1"
          >
            <MapPin size={15} /> Ver no mapa
          </TrackedLink>

          {demoMode ? (
            <button
              type="button"
              onClick={() =>
                window.alert(
                  "Função desativada nesta demonstração. Nenhuma conversa foi aberta no WhatsApp."
                )
              }
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-pine px-4 py-2 text-sm text-cream-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-pine-dark sm:flex-1"
            >
              <MessageCircle size={15} /> Pedir
            </button>
          ) : (
            <TrackedLink
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              event="whatsapp_click"
              params={{ store: store.slug }}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-pine px-4 py-2 text-sm text-cream-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-pine-dark sm:flex-1"
            >
              <MessageCircle size={15} /> Pedir
            </TrackedLink>
          )}

          <Link
            href={`/unidades/${store.slug}`}
            className="inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm text-pine underline-offset-4 hover:underline min-[380px]:col-span-2 sm:w-full"
          >
            Ver cardápio da unidade
          </Link>
        </div>
      </div>
    </article>
  );
}
