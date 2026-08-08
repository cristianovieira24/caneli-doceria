import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/database";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/cardapio?categoria=${category.slug}`}
      className="group relative flex h-36 w-44 shrink-0 items-end overflow-hidden rounded-[28px_28px_58px_28px] bg-blush-light shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:h-44 sm:w-52"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt=""
          fill
          sizes="208px"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
        />
      ) : (
        <div className="pastry-surface absolute inset-0" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/72 via-ink/8 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-cream-soft/15" />

      <span className="relative z-10 p-4 font-display text-lg leading-tight text-cream-soft sm:p-5">
        {category.name}
      </span>
    </Link>
  );
}
