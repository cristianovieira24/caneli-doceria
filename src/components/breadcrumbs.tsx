import Link from "next/link";
import { JsonLd } from "./json-ld";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.canelidoceria.com.br";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: item.href ? `${SITE_URL}${item.href}` : undefined,
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {item.href ? (
                <Link href={item.href} className="hover:text-pine">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {item.label}
                </span>
              )}
              {i < items.length - 1 && <span aria-hidden="true">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
