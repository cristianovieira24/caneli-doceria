"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Gift,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Package,
  FileText,
  Store as StoreIcon,
  Tags,
  Users,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { CurrentStaff } from "@/lib/auth";
import { logout } from "@/app/admin/login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/unidades", label: "Unidades", icon: StoreIcon },
  { href: "/admin/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/admin/conteudo", label: "Conteúdo do site", icon: FileText },
  { href: "/admin/encomendas", label: "Encomendas", icon: Gift },
  { href: "/admin/faq", label: "Perguntas frequentes", icon: HelpCircle },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
];

const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/esqueci-senha",
  "/admin/redefinir-senha",
]);

interface AdminShellProps {
  staff: CurrentStaff | null;
  children: ReactNode;
}

export function AdminShell({ staff, children }: AdminShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return <>{children}</>;
  }

  if (!staff) {
    const loginHref = `/admin/login?next=${encodeURIComponent(
      pathname || "/admin"
    )}`;

    return (
      <div className="flex min-h-[70dvh] items-center justify-center bg-cream px-5 text-center">
        <div className="pastry-card max-w-md bg-cream-soft px-6 py-8 shadow-soft">
          <h1 className="text-xl">Entre para acessar o painel</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Sua sessão não está ativa. Use o e-mail e a senha cadastrados no
            Supabase.
          </p>
          <Link
            href={loginHref}
            className="mt-5 inline-flex rounded-full bg-pine px-6 py-3 text-sm font-medium text-cream-soft"
          >
            Entrar no painel
          </Link>
        </div>
      </div>
    );
  }

  if (staff.roles.length === 0) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center bg-cream px-5 text-center">
        <div className="pastry-card max-w-md bg-cream-soft px-6 py-8 shadow-soft">
          <h1 className="text-xl">Sem acesso ao painel</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            A conta <strong>{staff.email}</strong> está conectada, mas não
            possui um papel em <code>user_roles</code>.
          </p>
          <form action={logout} className="mt-5">
            <button
              type="submit"
              className="rounded-full border border-pine px-6 py-3 text-sm font-medium text-pine hover:bg-pine hover:text-cream-soft"
            >
              Sair e entrar com outra conta
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream sm:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink/10 bg-cream-soft/80 p-5 backdrop-blur sm:flex">
        <AdminBrand />

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors " +
                  (active
                    ? "bg-blush-light text-pine"
                    : "text-ink-soft hover:bg-blush-light hover:text-pine")
                }
              >
                <Icon size={17} /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-ink/10 pt-4 text-xs text-ink-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate">{staff.email}</p>
              <p className="mt-0.5 capitalize text-pine">{staff.roles[0]}</p>
            </div>
            <ThemeToggle compact />
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="flex min-h-9 items-center gap-1.5 hover:text-terracotta"
            >
              <LogOut size={14} /> Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-cream-soft/95 px-4 py-3 backdrop-blur-xl sm:hidden">
          <AdminBrand compact />

          <div className="flex items-center gap-1">
            <ThemeToggle compact />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu administrativo"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-blush-light"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        <main className="min-w-0 px-4 py-5 min-[380px]:px-5 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>

      <div
        className={
          "fixed inset-0 z-[70] sm:hidden " +
          (menuOpen ? "pointer-events-auto" : "pointer-events-none")
        }
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Fechar menu administrativo"
          onClick={() => setMenuOpen(false)}
          className={
            "absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 " +
            (menuOpen ? "opacity-100" : "opacity-0")
          }
        />

        <aside
          className={
            "safe-bottom safe-top absolute bottom-0 right-0 top-0 flex w-[min(20rem,88vw)] flex-col bg-cream-soft p-5 shadow-float transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] " +
            (menuOpen ? "translate-x-0" : "translate-x-full")
          }
        >
          <div className="flex items-center justify-between gap-3">
            <AdminBrand />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink hover:bg-blush-light"
            >
              <X size={21} />
            </button>
          </div>

          <nav className="mt-7 flex flex-1 flex-col gap-1 overflow-y-auto">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors " +
                    (active
                      ? "bg-blush-light text-pine"
                      : "text-ink-soft hover:bg-blush-light hover:text-pine")
                  }
                >
                  <Icon size={18} /> {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-ink/10 pt-4 text-xs text-ink-soft">
            <p className="truncate">{staff.email}</p>
            <p className="mt-0.5 capitalize text-pine">{staff.roles[0]}</p>

            <form action={logout} className="mt-3">
              <button
                type="submit"
                className="flex min-h-10 items-center gap-2 text-sm hover:text-terracotta"
              >
                <LogOut size={15} /> Sair
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AdminBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="min-w-0">
      <span
        className={
          "block font-script leading-none text-pine " +
          (compact ? "text-2xl" : "text-3xl")
        }
      >
        caneli
      </span>
      {!compact && (
        <span className="mt-0.5 block text-[11px] text-ink-soft">
          painel administrativo
        </span>
      )}
    </Link>
  );
}
