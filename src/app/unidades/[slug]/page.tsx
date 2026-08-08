import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { TrackedLink } from "@/components/tracked-link";
import { DemoWhatsAppLink } from "@/components/demo-whatsapp-link";
import { DemoExternalLink } from "@/components/demo-external-link";
import type { Store, StoreHours, ExternalLink } from "@/types/database";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

async function getStore(slug: string) {
  const supabase = createClient();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!store) return null;

  const [{ data: hours }, { data: links }] = await Promise.all([
    supabase
      .from("store_hours")
      .select("*")
      .eq("store_id", store.id)
      .order("weekday"),
    supabase
      .from("external_links")
      .select("*")
      .eq("store_id", store.id)
      .order("display_order"),
  ]);

  return {
    store: store as Store,
    hours: (hours as StoreHours[]) ?? [],
    links: (links as ExternalLink[]) ?? [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const data = await getStore(params.slug);
    if (!data) return {};

    const description = `${data.store.name} — ${data.store.neighborhood}, ${data.store.city}. Endereço, horário e WhatsApp.`;

    return {
      title: data.store.name,
      description,
      alternates: {
        canonical: `/unidades/${data.store.slug}`,
      },
      openGraph: {
        title: data.store.name,
        description,
        images: data.store.photo_url
          ? [{ url: data.store.photo_url }]
          : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function UnidadeDetalhePage({
  params,
}: {
  params: { slug: string };
}) {
  let data: Awaited<ReturnType<typeof getStore>> = null;

  try {
    data = await getStore(params.slug);
  } catch {
    // Ver README.
  }

  if (!data) notFound();

  const { store, hours, links } = data;

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.canelidoceria.com.br";

  return (
    <div className="section py-8 sm:py-12">
      {!DEMO_MODE && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Bakery",
            name: store.name,
            image: store.photo_url || undefined,
            telephone: store.phone || undefined,
            url: `${SITE_URL}/unidades/${store.slug}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: store.address,
              addressLocality: store.city,
              addressRegion: store.state,
              postalCode: store.zip_code || undefined,
              addressCountry: "BR",
            },
            openingHoursSpecification: hours
              .filter((h) => !h.closed && h.opens_at && h.closes_at)
              .map((h) => ({
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ][h.weekday],
                opens: h.opens_at,
                closes: h.closes_at,
              })),
          }}
        />
      )}

      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Unidades", href: "/unidades" },
          { label: store.name },
        ]}
      />

      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal direction="right" scale={0.98}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[40%_40%_30px_30px] bg-blush-light shadow-lift">
            {store.photo_url ? (
              <Image
                src={store.photo_url}
                alt={store.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.025]"
              />
            ) : (
              <div className="pastry-surface flex h-full items-center justify-center text-sm text-ink-soft/60">
                Foto em breve
              </div>
            )}
          </div>
        </Reveal>

        <Reveal direction="left" delay={80} distance={24}>
          <div className="min-w-0">
            <p className="eyebrow">{store.neighborhood}</p>

            <h1 className="mt-1 text-3xl min-[380px]:text-4xl">
              {store.name}
            </h1>

            <p className="mt-4 flex items-start gap-2 leading-relaxed text-ink-soft">
              <MapPin size={18} className="mt-0.5 shrink-0 text-pine" />
              {store.address}
            </p>

            {store.phone && (
              <p className="mt-2 flex items-center gap-2 text-ink-soft">
                <Phone size={18} className="shrink-0 text-pine" />
                {store.phone}
              </p>
            )}

            {store.description && (
              <p className="mt-4 max-w-[58ch] leading-relaxed text-ink-soft">
                {store.description}
              </p>
            )}

            {hours.length > 0 && (
              <div className="mt-6 rounded-pastry border border-ink/10 bg-cream-soft px-4 py-4 shadow-soft sm:px-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                  Horário
                </h2>

                <ul className="mt-3 space-y-2 text-sm">
                  {hours.map((h) => (
                    <li
                      key={h.id}
                      className="flex justify-between gap-4 text-ink-soft"
                    >
                      <span>{WEEKDAY_LABELS[h.weekday]}</span>

                      <span className="shrink-0 text-right">
                        {h.closed
                          ? "Fechado"
                          : `${h.opens_at?.slice(0, 5)} – ${h.closes_at?.slice(
                              0,
                              5
                            )}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 grid grid-cols-1 gap-2 min-[420px]:flex min-[420px]:flex-wrap">
              <TrackedLink
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  store.address
                )}`}
                target="_blank"
                rel="noreferrer"
                event="map_click"
                params={{ store: store.slug }}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-cream-soft px-5 py-2.5 text-sm transition-colors hover:border-pine hover:text-pine"
              >
                <MapPin size={16} /> Ver no mapa
              </TrackedLink>

              {DEMO_MODE ? (
                <DemoWhatsAppLink
                  href={`https://wa.me/${store.whatsapp}`}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <MessageCircle size={16} /> Pedir pelo WhatsApp
                </DemoWhatsAppLink>
              ) : (
                <TrackedLink
                  href={`https://wa.me/${store.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  event="whatsapp_click"
                  params={{ store: store.slug }}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-pine px-5 py-2.5 text-sm text-cream-soft shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <MessageCircle size={16} /> Pedir pelo WhatsApp
                </TrackedLink>
              )}

              {links.map((link) =>
                DEMO_MODE ? (
                  <DemoExternalLink
                    key={link.id}
                    href={link.url}
                    message="Função desativada nesta demonstração. Nenhum site externo foi aberto."
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-cream-soft px-5 py-2.5 text-sm transition-colors hover:border-pine hover:text-pine"
                  >
                    {link.label}
                  </DemoExternalLink>
                ) : (
                  <TrackedLink
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    event="external_delivery_click"
                    params={{
                      store: store.slug,
                      provider: link.label,
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-cream-soft px-5 py-2.5 text-sm transition-colors hover:border-pine hover:text-pine"
                  >
                    {link.label}
                  </TrackedLink>
                )
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
