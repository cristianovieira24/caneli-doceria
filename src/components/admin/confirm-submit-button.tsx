"use client";

import type { MouseEvent, ReactNode } from "react";

export function ConfirmSubmitButton({
  confirmation,
  label,
  className,
  children,
}: {
  confirmation: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(confirmation)) {
      event.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      aria-label={label}
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
