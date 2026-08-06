import Image from "next/image";
import Link from "next/link";

export interface HeroContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
}

export function Hero({ content }: { content?: HeroContent }) {
  const eyebrow = content?.eyebrow || "doces, cafés";
  const title = content?.title || "& dias felizes.";
  const description =
    content?.description ||
    "Croissants recheados na hora, bolos de colher e café coado fresquinho — feitos todos os dias nas nossas lojas em Goiânia.";

  return (
    <section className="section grid gap-10 pb-16 pt-10 lg:grid-cols-2 lg:items-center lg:pt-16">
      <div className="order-2 lg:order-1 animate-fade-up">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1 text-[2.6rem] leading-[1.05] sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-[46ch] text-lg text-ink-soft">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/cardapio"
            className="rounded-full bg-pine px-7 py-3.5 text-[15px] font-medium text-cream-soft transition-all hover:bg-pine-dark hover:-translate-y-0.5 active:translate-y-0"
          >
            Ver cardápio
          </Link>
          <Link
            href="/unidades"
            className="rounded-full border border-ink/15 px-7 py-3.5 text-[15px] font-medium text-ink transition-all hover:border-pine hover:text-pine hover:-translate-y-0.5 active:translate-y-0"
          >
            Encontrar uma loja
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-soft/70">4 unidades em Goiânia</p>
      </div>

      <div className="order-1 lg:order-2 relative arch-frame aspect-[4/5] w-full max-w-md justify-self-center shadow-lift lg:max-w-none bg-blush-light animate-fade-up">
        {content?.image_url ? (
          <Image
            src={content.image_url}
            alt={content.image_alt || "Caneli Doceria"}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft/60">
            Foto em breve
          </div>
        )}
      </div>
    </section>
  );
}
