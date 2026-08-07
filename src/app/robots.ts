import type { MetadataRoute } from "next";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.canelidoceria.com.br";

export default function robots(): MetadataRoute.Robots {
  if (DEMO_MODE) {
    // Deliberately NOT a blanket "disallow: /": some crawlers won't even
    // read a page's noindex signal if robots.txt blocks the fetch in the
    // first place. We allow crawling of public pages so the X-Robots-Tag
    // header (see next.config.mjs) and the noindex/nofollow metadata
    // (see layout.tsx) are what actually keep this out of search results.
    // /admin stays blocked either way, and the sitemap is never published
    // in demo, so there's nothing pointing crawlers at content to index.
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin"],
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
