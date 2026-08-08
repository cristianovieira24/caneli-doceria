"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
    window.localStorage.setItem("caneli-theme-v2", nextDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={dark ? "Tema claro" : "Tema escuro"}
      className={
        "inline-flex shrink-0 items-center justify-center rounded-full border border-ink/10 bg-cream-soft/80 text-pine shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-pine/30 hover:bg-blush-light active:translate-y-0 " +
        (compact ? "h-10 w-10" : "h-11 w-11")
      }
    >
      <span className="relative grid h-5 w-5 place-items-center">
        <Sun
          size={18}
          className={
            "absolute transition-all duration-300 " +
            (mounted && dark
              ? "scale-0 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100")
          }
        />
        <Moon
          size={18}
          className={
            "absolute transition-all duration-300 " +
            (mounted && dark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0")
          }
        />
      </span>
    </button>
  );
}
