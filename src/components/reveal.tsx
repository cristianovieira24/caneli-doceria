"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

export function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  distance = 24,
  scale = 0.99,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  distance?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // O conteúdo começa visível para não deixar áreas em branco durante a
  // hidratação. Apenas elementos realmente abaixo da dobra são preparados
  // para a animação de entrada.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const bounds = node.getBoundingClientRect();
    const isAlreadyOnScreen =
      bounds.top < window.innerHeight * 0.98 && bounds.bottom > 0;

    if (isAlreadyOnScreen) return;

    setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -2% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const translate = (() => {
    switch (direction) {
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "none":
        return "translate3d(0, 0, 0)";
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  })();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0, 0, 0) scale(1)"
          : `${translate} scale(${scale})`,
        transitionProperty: "opacity, transform",
        transitionDuration: "560ms",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(.22, 1, .36, 1)",
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
