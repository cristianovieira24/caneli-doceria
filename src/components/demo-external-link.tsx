"use client";

import type { ReactNode } from "react";
import { useSiteMode } from "@/components/site-mode-provider";

type DemoExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  message?: string;
};

export function DemoExternalLink({
  href,
  children,
  className,
  message = "Função desativada nesta demonstração.",
}: DemoExternalLinkProps) {
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
        window.alert(message);
      }}
    >
      {children}
    </a>
  );
}
