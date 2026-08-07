"use client";

import type { ReactNode } from "react";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

type DemoExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  message?: string;
};

/**
 * Guards any outbound commercial link (delivery platforms, campaign CTAs,
 * etc.) behind DEMO_MODE. In demo, the link stays visible and clickable
 * but never navigates — it shows an alert instead. In official mode it
 * behaves like a normal external link.
 */
export function DemoExternalLink({
  href,
  children,
  className,
  message = "Função desativada nesta demonstração.",
}: DemoExternalLinkProps) {
  return (
    <a
      href={DEMO_MODE ? "#" : href}
      target={DEMO_MODE ? undefined : "_blank"}
      rel={DEMO_MODE ? undefined : "noreferrer"}
      className={className}
      onClick={(event) => {
        if (!DEMO_MODE) return;
        event.preventDefault();
        window.alert(message);
      }}
    >
      {children}
    </a>
  );
}
