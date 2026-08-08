import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFunctionalDemoMode } from "@/lib/site-mode";
import { DemoWhatsAppLink } from "@/components/demo-whatsapp-link";
import type { Store } from "@/types/database";

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/canelidoceria/",
};

async function getActiveStores(): Promise<Store[]> {
  try {
    const supabase = createClient();

    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("status", "active")
      .order("display_order");

    return (data as Store[]) ?? [];
  } catch {
    return [];
  }
}

export async function SiteFooter() {
  const [stores, demoMode] = await Promise.all([
    getActiveStores(),
    getFunctionalDemoMode(),
  ]);

  return (
    <footer className="footer-frosting border-t border-ink/10 bg-cream-deep">
      <div className="section grid gap-9 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4">
        <div>
          <p className="font-script text-4xl leading-none text-pine">caneli</p>

          <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-ink-soft">
            Doces, cafés e dias felizes.
          </p>

          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/10 bg-cream-soft/50 px-4 py-2 text-sm text-pine transition-colors hover:bg-blush-light"
          >
            <Instagram size={17} /> @canelidoceria
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Navegação
          </h3>

          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:block sm:space-y-2">
            <li>
              <Link href="/cardapio" className="hover:text-pine">
                Cardápio
              </Link>
            </li>
            <li>
              <Link href="/unidades" className="hover:text-pine">
                Unidades
              </Link>
            </li>
            <li>
              <Link href="/encomendas" className="hover:text-pine">
                Encomendas
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:text-pine">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-pine">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Unidades
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            {stores.length === 0 && (
              <li className="text-ink-soft/70">Em breve por aqui.</li>
            )}

            {stores.map((store) => (
              <li key={store.id}>
                <Link
                  href={`/unidades/${store.slug}`}
                  className="inline-block py-0.5 leading-relaxed hover:text-pine"
                >
                  {store.name} — {store.neighborhood}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Fale com a gente
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            {stores.slice(0, 1).map((store) => (
              <li key={store.id}>
                <DemoWhatsAppLink
                  href={`https://wa.me/${store.whatsapp}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/10 bg-cream-soft/50 px-4 py-2 hover:bg-blush-light hover:text-pine"
                >
                  <MessageCircle size={16} /> WhatsApp — {store.name}
                </DemoWhatsAppLink>
              </li>
            ))}

            <li>
              <Link
                href="/contato"
                className="inline-flex min-h-9 items-center hover:text-pine"
              >
                Ver todos os contatos
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="section flex flex-col gap-4 py-6 text-xs leading-relaxed text-ink-soft lg:flex-row lg:items-center lg:justify-between">
          {demoMode ? (
            <p className="max-w-[62ch]">
              Demonstração independente de projeto — não é o site oficial da
              Caneli.
            </p>
          ) : (
            <p>
              © {new Date().getFullYear()} Caneli Doceria. Todos os direitos
              reservados.
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacidade" className="hover:text-pine">
              Política de privacidade
            </Link>

            <Link href="/termos" className="hover:text-pine">
              Termos de uso
            </Link>

            <Link href="/admin" className="hover:text-pine">
              Acesso administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
