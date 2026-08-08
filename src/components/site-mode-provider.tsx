"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

type SiteModeContextValue = {
  demoMode: boolean;
};

const SiteModeContext =
  createContext<SiteModeContextValue | null>(null);

export function SiteModeProvider({
  demoMode,
  children,
}: {
  demoMode: boolean;
  children: ReactNode;
}) {
  return (
    <SiteModeContext.Provider value={{ demoMode }}>
      {children}
    </SiteModeContext.Provider>
  );
}

export function useSiteMode() {
  const context = useContext(SiteModeContext);

  if (!context) {
    // Fallback seguro caso algum componente seja usado fora do provider.
    return { demoMode: true };
  }

  return context;
}
