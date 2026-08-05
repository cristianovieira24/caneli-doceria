"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestPasswordReset, type LoginState } from "../login/actions";

const initialState: LoginState = {};

export default function EsqueciSenhaPage() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm rounded-card bg-cream-soft p-8 shadow-soft">
        <h1 className="text-center text-xl">Recuperar senha</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Informe seu e-mail e enviaremos um link para redefinir a senha.
        </p>
        <form action={formAction} className="mt-6 space-y-4">
          <input name="email" type="email" required className="input" placeholder="seu@email.com" />
          {state.error && <p className="text-sm text-terracotta">{state.error}</p>}
          {state.success && (
            <p className="text-sm text-pine">Se este e-mail existir, o link de redefinição foi enviado.</p>
          )}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-pine px-6 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Enviar link"}
    </button>
  );
}
