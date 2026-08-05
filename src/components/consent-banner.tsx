"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/analytics";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-cream-soft px-5 py-4 shadow-lift"
    >
      <div className="section flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-ink-soft">
          Usamos cookies para entender como o site é usado.{" "}
          <Link href="/privacidade" className="text-pine underline">
            Saiba mais
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              setConsent("declined");
              setVisible(false);
            }}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent("accepted");
              setVisible(false);
            }}
            className="rounded-full bg-pine px-4 py-2 text-sm text-cream-soft"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
