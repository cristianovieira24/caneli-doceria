"use client";

import type { ReactNode } from "react";
import { useSiteMode } from "@/components/site-mode-provider";

type DemoWhatsAppLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function DemoWhatsAppLink({
  href,
  children,
  className,
}: DemoWhatsAppLinkProps) {
  const { demoMode } = useSiteMode();

  return (
    <a
      href={demoMode ? "#" : href}
      target={demoMode ? undefined : "_blank"}
      rel={demoMode ? undefined : "noreferrer"}
      className={className}
      onClick={(event) => {
        if (!demoMode) return;

        event.preventDefault();

        window.alert(
          "Função desativada nesta demonstração. Nenhuma conversa foi aberta no WhatsApp."
        );
      }}
    >
      {children}
    </a>
  );
}
