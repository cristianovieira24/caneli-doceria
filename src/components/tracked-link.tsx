"use client";

import { track } from "@/lib/analytics";

export function TrackedLink({
  event,
  params,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { event: string; params?: Record<string, unknown> }) {
  return (
    <a {...props} onClick={() => track(event, params)}>
      {children}
    </a>
  );
}
