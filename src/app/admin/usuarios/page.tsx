import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentStaff } from "@/lib/auth";
import { AddUserForm } from "./add-user-form";
import { removeUserRole } from "./actions";
import { Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export default async function UsuariosPage() {
  const staff = await getCurrentStaff();
  const isOwner = staff?.roles.includes("proprietario") ?? false;

  if (!isOwner) {
    return (
      <div>
        <h1 className="text-2xl">Usuários</h1>
        <p className="mt-2 text-sm text-ink-soft">Só o proprietário pode gerenciar quem tem acesso ao painel.</p>
      </div>
    );
  }

  const supabase = createClient();
  const { data: roles } = await supabase.from("user_roles").select("*").order("role");

  let emailById = new Map<string, string>();
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({ perPage: 200 });
    emailById = new Map(data.users.map((u) => [u.id, u.email ?? "—"]));
  } catch {
    // SUPABASE_SERVICE_ROLE_KEY provavelmente não configurada neste ambiente.
  }

  return (
    <div>
      <h1 className="text-2xl">Usuários e permissões</h1>
      <p className="mt-1 max-w-[60ch] text-sm text-ink-soft">
        Proprietário tem acesso total. Administrador gerencia produtos, categorias, unidades,
        campanhas e encomendas. Editor faz o mesmo, exceto excluir registros críticos.
      </p>

      <div className="mt-6 max-w-md">
        <AddUserForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-card bg-cream-soft shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink-soft">
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Papel</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(roles ?? []).map((r) => (
              <tr key={r.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 text-ink">{emailById.get(r.user_id) ?? r.user_id}</td>
                <td className="px-4 py-3 capitalize text-ink-soft">{r.role}</td>
                <td className="px-4 py-3 text-right">
                  <form action={removeUserRole.bind(null, r.id)}>
                    <ConfirmSubmitButton
                      label="Remover acesso"
                      confirmation={`Remover o papel “${r.role}” de ${emailById.get(r.user_id) ?? r.user_id}?`}
                      className="text-ink-soft hover:text-terracotta"
                    >
                      <Trash2 size={16} />
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(roles ?? []).length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">Nenhum usuário com papel atribuído ainda.</p>
        )}
      </div>
    </div>
  );
}
