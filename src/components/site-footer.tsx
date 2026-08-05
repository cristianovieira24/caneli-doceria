import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
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
    // Supabase not configured yet (local preview) — footer still renders
    // navigation and social links without the store list.
    return [];
  }
}

export async function SiteFooter() {
  const stores = await getActiveStores();

  return (
    <footer className="mt-24 border-t border-ink/10 bg-cream-deep">
      <div className="section grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-script text-3xl text-pine">caneli</p>
          <p className="mt-3 max-w-[26ch] text-sm text-ink-soft">
            Doces, cafés e dias felizes.
          </p>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-pine hover:text-pine-dark"
          >
            <Instagram size={18} /> @canelidoceria
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Navegação</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/cardapio" className="hover:text-pine">Cardápio</Link></li>
            <li><Link href="/unidades" className="hover:text-pine">Unidades</Link></li>
            <li><Link href="/encomendas" className="hover:text-pine">Encomendas</Link></li>
            <li><Link href="/sobre" className="hover:text-pine">Sobre</Link></li>
            <li><Link href="/contato" className="hover:text-pine">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Unidades</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {stores.length === 0 && (
              <li className="text-ink-soft/70">Em breve por aqui.</li>
            )}
            {stores.map((store) => (
              <li key={store.id}>
                <Link href={`/unidades/${store.slug}`} className="hover:text-pine">
                  {store.name} — {store.neighborhood}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Fale com a gente</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {stores.slice(0, 1).map((store) => (
              <li key={store.id}>
                <a
                  href={`https://wa.me/${store.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-pine"
                >
                  <MessageCircle size={16} /> WhatsApp — {store.name}
                </a>
              </li>
            ))}
            <li><Link href="/contato" className="hover:text-pine">Ver todos os contatos</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="section flex flex-col gap-2 py-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Caneli Doceria. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-pine">Política de privacidade</Link>
            <Link href="/termos" className="hover:text-pine">Termos de uso</Link>
            <Link href="/admin" className="hover:text-pine">Acesso administrativo</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
