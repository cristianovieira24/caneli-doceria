import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/database";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/cardapio?categoria=${category.slug}`}
      className="group relative flex h-32 flex-shrink-0 w-40 items-end overflow-hidden rounded-card bg-blush-light shadow-soft sm:h-40 sm:w-48"
    >
      {category.image_url && (
        <Image
          src={category.image_url}
          alt=""
          fill
          sizes="200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0" />
      <span className="relative z-10 p-4 font-display text-base text-cream-soft">
        {category.name}
      </span>
    </Link>
  );
}
