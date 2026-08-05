import Link from "next/link";
import { LayoutDashboard, Package, Tags, Store as StoreIcon, Gift, Megaphone, Users, HelpCircle, LogOut } from "lucide-react";
import { getCurrentStaff } from "@/lib/auth";
import { logout } from "./login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/unidades", label: "Unidades", icon: StoreIcon },
  { href: "/admin/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/admin/encomendas", label: "Encomendas", icon: Gift },
  { href: "/admin/faq", label: "Perguntas frequentes", icon: HelpCircle },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff();

  // Middleware already redirects unauthenticated visitors to /admin/login.
  // This second check handles a signed-in Supabase user who has no row in
  // user_roles yet (e.g. right after account creation).
  if (!staff || staff.roles.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
        <div>
          <h1 className="text-xl">Sem acesso ao painel</h1>
          <p className="mt-2 max-w-[45ch] text-sm text-ink-soft">
            Sua conta está autenticada, mas ainda não tem um papel (proprietário, administrador ou
            editor) atribuído em <code>user_roles</code>. Peça para o proprietário te adicionar —
            ver instruções no README.
          </p>
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

      <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
