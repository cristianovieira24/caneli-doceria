"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-script text-4xl text-terracotta">xii...</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Algo deu errado por aqui</h1>
      <p className="mt-3 max-w-[45ch] text-ink-soft">
        Foi um erro momentâneo, não é nada com o seu pedido ou seus dados. Pode tentar de novo.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-pine px-7 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark"
      >
        Tentar novamente
      </button>
    </div>
  );
}
