"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useCartCount, useCartStore } from "@/lib/store/cart-store";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/unidades", label: "Unidades" },
  { href: "/encomendas", label: "Encomendas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartCount();
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "bg-cream-soft/95 backdrop-blur border-ink/5 shadow-soft" : "bg-transparent border-transparent"
      )}
    >
      <div className="section flex h-[72px] items-center justify-between">
        <Link href="/" className="font-script text-3xl text-pine" aria-label="Caneli Doceria — início">
          caneli
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "relative text-[15px] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-pine after:transition-all",
                  isActive
                    ? "text-pine after:w-full"
                    : "text-ink-soft after:w-0 hover:text-pine hover:after:w-full"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/cardapio"
            className="rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-cream-soft hover:bg-pine-dark transition-colors"
          >
            Ver cardápio
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Meu pedido"
            className="relative rounded-full border border-ink/10 p-2.5 text-pine hover:bg-blush-light transition-colors"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[11px] font-medium text-cream-soft">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button type="button" onClick={openDrawer} aria-label="Meu pedido" className="relative p-2 text-pine">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-medium text-cream-soft">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="p-2 text-ink"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden border-t border-ink/5 bg-cream-soft transition-[grid-template-rows] duration-300 ease-out grid ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"
        }`}
      >
        <nav className="min-h-0 px-5 py-4 flex flex-col gap-1" aria-label="Navegação mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-[17px] text-ink border-b border-ink/5 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cardapio"
            onClick={() => setMenuOpen(false)}
            className="mt-4 rounded-full bg-pine px-5 py-3 text-center text-sm font-medium text-cream-soft"
          >
            Ver cardápio
          </Link>
        </nav>
      </div>
    </header>
  );
}
