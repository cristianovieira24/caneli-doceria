"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gift,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  FileText,
  Store as StoreIcon,
  Tags,
  Users,
} from "lucide-react";
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

  // Login and password-recovery pages are inside /admin, so the parent layout
  // must let them render even when there is no authenticated user yet.
  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return <>{children}</>;
  }

  // Middleware normally redirects this case to /admin/login. This fallback
  // prevents the misleading "no role" message if the session disappears
  // between middleware and rendering.
  if (!staff) {
    const loginHref = `/admin/login?next=${encodeURIComponent(pathname || "/admin")}`;

    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
        <div>
          <h1 className="text-xl">Entre para acessar o painel</h1>
          <p className="mt-2 max-w-[45ch] text-sm text-ink-soft">
            Sua sessão não está ativa. Use o e-mail e a senha cadastrados no Supabase.
          </p>
          <Link
            href={loginHref}
            className="mt-5 inline-flex rounded-full bg-pine px-6 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark"
          >
            Entrar no painel
          </Link>
        </div>
      </div>
    );
  }

  if (staff.roles.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
        <div>
          <h1 className="text-xl">Sem acesso ao painel</h1>
          <p className="mt-2 max-w-[45ch] text-sm text-ink-soft">
            A conta <strong>{staff.email}</strong> está conectada, mas não possui um papel em{" "}
            <code>user_roles</code>.
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
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/10 bg-cream-soft p-5 sm:flex">
        <Link href="/" className="font-script text-2xl text-pine">
          caneli
        </Link>
        <p className="mt-0.5 text-xs text-ink-soft">painel administrativo</p>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-blush-light hover:text-pine"
            >
              <Icon size={17} /> {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-ink/10 pt-4 text-xs text-ink-soft">
          <p className="truncate">{staff.email}</p>
          <p className="mt-0.5 capitalize text-pine">{staff.roles[0]}</p>
          <form action={logout} className="mt-3">
            <button type="submit" className="flex items-center gap-1.5 hover:text-terracotta">
              <LogOut size={14} /> Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}
