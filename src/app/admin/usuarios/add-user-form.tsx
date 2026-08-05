"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addUserRole, type AddUserRoleState } from "./actions";

const initialState: AddUserRoleState = {};

export function AddUserForm() {
  const [state, formAction] = useFormState(addUserRole, initialState);

  return (
    <form action={formAction} className="space-y-3 rounded-card bg-cream-soft p-5 shadow-soft">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">E-mail da pessoa</label>
        <input name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Papel</label>
        <select name="role" defaultValue="editor" className="input">
          <option value="editor">Editor</option>
          <option value="administrador">Administrador</option>
          <option value="proprietario">Proprietário</option>
        </select>
      </div>
      {state.error && <p className="text-sm text-terracotta">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-pine px-6 py-2.5 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
    >
      {pending ? "Adicionando…" : "Dar acesso ao painel"}
    </button>
  );
}
