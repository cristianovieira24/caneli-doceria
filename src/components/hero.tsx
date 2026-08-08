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
  const decorRef = useRef<HTMLDivElement>(null);

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
      const decor = decorRef.current;

      if (!section || !copy || !media || !decor) return;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;

      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const normalized = Math.max(
        -1,
        Math.min(1, (viewportCenter - sectionCenter) / window.innerHeight)
      );

      media.style.transform = `translate3d(0, ${normalized * 22}px, 0)`;
      copy.style.transform = `translate3d(0, ${normalized * -9}px, 0)`;
      decor.style.transform = `translate3d(${normalized * 10}px, ${
        normalized * -16
      }px, 0) rotate(${normalized * 2}deg)`;
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
      className="section relative isolate grid gap-8 overflow-visible pb-16 pt-8 sm:gap-10 sm:pb-20 sm:pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pb-24 lg:pt-16"
    >
      <div
        aria-hidden
        className="pastry-sprinkles pointer-events-none absolute inset-x-0 top-0 -z-10 h-[82%] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <div
        ref={decorRef}
        aria-hidden
        className="pointer-events-none absolute right-[3%] top-[6%] -z-[1] hidden h-28 w-28 rounded-full pastry-ring opacity-60 sm:block lg:right-[46%] lg:top-[12%]"
      />

      <div
        ref={copyRef}
        className="order-2 relative z-10 will-change-transform lg:order-1"
      >
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-terracotta/15 bg-cream-soft/70 px-4 py-2 shadow-soft backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-terracotta" />
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
              className="rounded-full border border-ink/15 bg-cream-soft/55 px-7 py-3.5 text-center text-[15px] font-medium text-ink backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pine hover:text-pine active:translate-y-0"
            >
              Encontrar uma loja
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft/75">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              4 unidades em Goiânia
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blush-dark" />
              feito todos os dias
            </span>
          </div>
        </div>
      </div>

      <div
        ref={mediaRef}
        className="order-1 relative z-0 mx-auto w-full max-w-lg will-change-transform lg:order-2 lg:max-w-none"
      >
        <div
          aria-hidden
          className="absolute -inset-3 -z-10 rotate-2 rounded-[48%_52%_58%_42%/42%_48%_52%_58%] bg-blush/45 sm:-inset-5"
        />

        <div
          aria-hidden
          className="absolute -bottom-5 -left-3 z-20 hidden animate-float-reverse sm:block"
        >
          <div className="macaron-stack" />
        </div>

        <div
          aria-hidden
          className="absolute -right-4 top-[18%] z-20 h-14 w-14 animate-float-slow rounded-full border-[7px] border-gold/55 bg-cream/45 shadow-soft backdrop-blur sm:h-16 sm:w-16"
        />

        <div className="arch-frame relative aspect-[4/5] w-full overflow-hidden bg-blush-light shadow-float animate-fade-up">
          {content?.image_url ? (
            <Image
              src={content.image_url}
              alt={content.image_alt || "Caneli Doceria"}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.025]"
            />
          ) : (
            <div className="pastry-surface flex h-full items-center justify-center px-8 text-center text-sm text-ink-soft/60">
              Foto em breve
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
