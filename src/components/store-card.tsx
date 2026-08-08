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
    <div className="flex h-full flex-col overflow-hidden rounded-card bg-cream-soft shadow-soft">
      <div className="relative aspect-[16/10] bg-blush-light">
        {store.photo_url ? (
          <Image
            src={store.photo_url}
            alt={store.name}
            fill
            sizes="400px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft/60">
            Foto em breve
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl">{store.name}</h3>

        <p className="text-sm text-ink-soft">{store.neighborhood}</p>

        <p className="text-sm text-ink-soft">{store.address}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <TrackedLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              store.address
            )}`}
            target="_blank"
            rel="noreferrer"
            event="map_click"
            params={{ store: store.slug }}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-pine hover:text-pine"
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
              className="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-sm text-cream-soft hover:bg-pine-dark"
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
              className="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-sm text-cream-soft hover:bg-pine-dark"
            >
              <MessageCircle size={15} /> Pedir
            </TrackedLink>
          )}

          <Link
            href={`/unidades/${store.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-pine underline-offset-2 hover:underline"
          >
            Ver cardápio
          </Link>
        </div>
      </div>
    </div>
  );
}
