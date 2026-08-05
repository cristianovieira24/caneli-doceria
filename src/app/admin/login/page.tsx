"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm rounded-card bg-cream-soft p-8 shadow-soft">
        <p className="font-script text-3xl text-pine text-center">caneli</p>
        <h1 className="mt-2 text-center text-xl">Painel administrativo</h1>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              E-mail
            </label>
            <input id="email" name="email" type="email" required className="input" autoComplete="username" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              autoComplete="current-password"
            />
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-terracotta">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <a href="/admin/esqueci-senha" className="mt-4 block text-center text-xs text-ink-soft hover:text-pine">
          Esqueci minha senha
        </a>
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
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}
