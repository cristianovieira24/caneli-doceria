"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setTimeout(() => router.push("/admin"), 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm rounded-card bg-cream-soft p-8 shadow-soft">
        <h1 className="text-center text-xl">Escolher nova senha</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nova senha (mín. 8 caracteres)"
            className="input"
          />
          {status === "error" && (
            <p className="text-sm text-terracotta">Não foi possível salvar. O link pode ter expirado.</p>
          )}
          {status === "done" && <p className="text-sm text-pine">Senha atualizada! Redirecionando…</p>}
          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded-full bg-pine px-6 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
          >
            {status === "saving" ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
