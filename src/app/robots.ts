import type { MetadataRoute } from "next";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.canelidoceria.com.br";

export default function robots(): MetadataRoute.Robots {
  if (DEMO_MODE) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
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
