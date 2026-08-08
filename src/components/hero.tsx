"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export interface HeroContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
}

export function Hero({ content }: { content?: HeroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  const eyebrow = content?.eyebrow || "doces, cafés";
  const title = content?.title || "& dias felizes.";
  const description =
    content?.description ||
    "Croissants recheados na hora, bolos de colher e café coado fresquinho — feitos todos os dias nas nossas lojas em Goiânia.";

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)");

    if (reduced || !desktop.matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      const copy = copyRef.current;
      const media = mediaRef.current;

      if (!section || !copy || !media) return;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;

      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const normalized = Math.max(
        -1,
        Math.min(1, (viewportCenter - sectionCenter) / window.innerHeight)
      );

      media.style.transform = `translate3d(0, ${normalized * 18}px, 0)`;
      copy.style.transform = `translate3d(0, ${normalized * -7}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section relative isolate grid gap-8 pb-16 pt-8 sm:gap-10 sm:pb-20 sm:pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pb-24 lg:pt-16"
    >
      <div
        ref={copyRef}
        className="order-2 relative z-10 will-change-transform lg:order-1"
      >
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center rounded-[14px_14px_24px_14px] border border-terracotta/15 bg-cream-soft/85 px-4 py-2 shadow-soft backdrop-blur">
            <p className="eyebrow text-[1.55rem]">{eyebrow}</p>
          </div>

          <h1 className="max-w-[11ch] text-[2.8rem] leading-[0.98] sm:text-6xl lg:text-[4.65rem]">
            {title}
          </h1>

          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-soft sm:text-lg">
            {description}
          </p>

          <div className="mt-7 flex flex-col gap-3 min-[390px]:flex-row sm:mt-8">
            <Link
              href="/cardapio"
              className="rounded-full bg-pine px-7 py-3.5 text-center text-[15px] font-medium text-cream-soft shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift active:translate-y-0"
            >
              Ver cardápio
            </Link>

            <Link
              href="/unidades"
              className="rounded-full border border-ink/15 bg-cream-soft/70 px-7 py-3.5 text-center text-[15px] font-medium text-ink backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pine hover:text-pine active:translate-y-0"
            >
              Encontrar uma loja
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft/75">
            <span>4 unidades em Goiânia</span>
            <span aria-hidden className="hidden h-4 w-px bg-ink/15 min-[390px]:block" />
            <span>feito todos os dias</span>
          </div>
        </div>
      </div>

      <div
        ref={mediaRef}
        className="order-1 relative z-0 mx-auto w-full max-w-lg will-change-transform lg:order-2 lg:max-w-none"
      >
        <div
          aria-hidden
          className="absolute -inset-x-3 -top-3 bottom-4 -z-10 rotate-[1.25deg] rounded-[44%_44%_34px_34px] bg-blush/50 sm:-inset-x-5 sm:-top-5 sm:bottom-5"
        />

        <div className="arch-frame relative aspect-[4/5] w-full overflow-hidden bg-blush-light shadow-float animate-fade-up">
          {content?.image_url ? (
            <Image
              src={content.image_url}
              alt={content.image_alt || "Caneli Doceria"}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.02]"
            />
          ) : (
            <div className="pastry-surface flex h-full items-center justify-center px-8 text-center text-sm text-ink-soft/60">
              Foto em breve
            </div>
          )}
        </div>

        <div className="brand-ticket absolute -bottom-4 left-4 z-20 px-4 py-2.5 text-xs font-medium sm:left-7 sm:px-5 sm:text-sm">
          doces momentos, todos os dias
        </div>
      </div>
    </section>
  );
}
