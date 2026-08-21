"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { Reveal } from "@/components/reveal";
import type { Category } from "@/types/database";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateControls = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    setCanScrollLeft(scroller.scrollLeft > 4);
    setCanScrollRight(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateControls();
    scroller.addEventListener("scroll", updateControls, { passive: true });

    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", updateControls);
      resizeObserver.disconnect();
    };
  }, [categories.length, updateControls]);

  function scroll(direction: "left" | "right") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left:
        (direction === "right" ? 1 : -1) *
        Math.max(scroller.clientWidth * 0.78, 240),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mt-8">
      <div className="absolute -top-14 right-0 z-20 hidden gap-2 sm:flex">
        <CarouselButton
          label="Ver categorias anteriores"
          disabled={!canScrollLeft}
          onClick={() => scroll("left")}
        >
          <ArrowLeft size={18} />
        </CarouselButton>

        <CarouselButton
          label="Ver próximas categorias"
          disabled={!canScrollRight}
          onClick={() => scroll("right")}
        >
          <ArrowRight size={18} />
        </CarouselButton>
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-10 sm:gap-5"
      >
        {categories.map((category, index) => (
          <Reveal
            key={category.id}
            delay={Math.min(index * 45, 220)}
            className="shrink-0 snap-start"
            direction="left"
            distance={18}
          >
            <CategoryCard category={category} />
          </Reveal>
        ))}
      </div>

      {canScrollRight && (
        <div className="pointer-events-none absolute bottom-4 right-0 top-0 w-12 bg-gradient-to-l from-blush-light to-transparent" />
      )}

      <p className="mt-1 flex items-center justify-end gap-1.5 text-xs text-ink-soft/70 sm:hidden">
        Deslize para ver mais <ArrowRight size={14} aria-hidden="true" />
      </p>
    </div>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full border border-pine/15 bg-cream-soft text-pine shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-pine/30 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
    >
      {children}
    </button>
  );
}
