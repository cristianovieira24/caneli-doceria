"use client";

import type { ReactNode } from "react";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

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
  return (
    <a
      href={DEMO_MODE ? "#" : href}
      target={DEMO_MODE ? undefined : "_blank"}
      rel={DEMO_MODE ? undefined : "noreferrer"}
      className={className}
      onClick={(event) => {
        if (!DEMO_MODE) return;

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
