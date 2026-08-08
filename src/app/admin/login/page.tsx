"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  return (
    <div className="pastry-surface relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-cream px-4 py-8 min-[380px]:px-5">
      <div
        aria-hidden
        className="absolute -left-8 top-[12%] h-28 w-28 animate-float-slow rounded-full border-[10px] border-blush/45"
      />
      <div
        aria-hidden
        className="absolute -right-5 bottom-[14%] hidden animate-float-reverse sm:block"
      >
        <div className="macaron-stack" />
      </div>

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle compact />
      </div>

      <div className="pastry-card relative z-10 w-full max-w-sm bg-cream-soft/90 p-5 shadow-float backdrop-blur sm:p-8">
        <p className="text-center font-script text-4xl leading-none text-pine">
          caneli
        </p>
        <h1 className="mt-2 text-center text-xl">Painel administrativo</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Entre para gerenciar o projeto.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
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
            <p
              role="alert"
              className="rounded-xl bg-terracotta/10 px-3 py-2 text-sm text-terracotta"
            >
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <a
          href="/admin/esqueci-senha"
          className="mt-4 block min-h-9 text-center text-xs text-ink-soft hover:text-pine"
        >
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
      className="w-full rounded-full bg-pine px-6 py-3.5 text-sm font-medium text-cream-soft shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60"
    >
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}
