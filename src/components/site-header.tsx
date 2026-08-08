"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "@/components/theme-toggle";
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "safe-top sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-ink/5 bg-cream-soft/95 shadow-soft backdrop-blur-xl"
          : "border-transparent bg-cream/70 backdrop-blur-md"
      )}
    >
      <div className="section flex h-16 items-center justify-between sm:h-[72px]">
        <Link
          href="/"
          className="relative z-10 font-script text-[2rem] leading-none text-pine"
          aria-label="Caneli Doceria — início"
        >
          caneli
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex xl:gap-8"
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "relative text-[15px] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:rounded-full after:bg-pine after:transition-all after:duration-300",
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

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/cardapio"
            className="rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-cream-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-pine-dark active:translate-y-0"
          >
            Ver cardápio
          </Link>

          <ThemeToggle compact />

          <button
            type="button"
            onClick={openDrawer}
            aria-label="Meu pedido"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-cream-soft/80 text-pine transition-all duration-300 hover:-translate-y-0.5 hover:bg-blush-light active:translate-y-0"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-medium text-cream-soft">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle compact />

          <button
            type="button"
            onClick={openDrawer}
            aria-label="Meu pedido"
            className="relative grid h-10 w-10 place-items-center rounded-full text-pine"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-0.5 text-[9px] font-medium text-cream-soft">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-blush-light"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "grid overflow-hidden border-ink/5 bg-cream-soft/95 backdrop-blur-xl transition-[grid-template-rows,border-color] duration-300 ease-out lg:hidden",
          menuOpen
            ? "grid-rows-[1fr] border-t"
            : "grid-rows-[0fr] border-t-0"
        )}
      >
        <nav
          className="min-h-0 max-h-[calc(100dvh-64px)] overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-8"
          aria-label="Navegação mobile"
        >
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "border-b border-ink/5 py-3.5 text-[17px] transition-colors last:border-0",
                    isActive ? "text-pine" : "text-ink hover:text-pine"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/cardapio"
              className="mt-4 rounded-full bg-pine px-5 py-3.5 text-center text-sm font-medium text-cream-soft"
            >
              Ver cardápio
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
