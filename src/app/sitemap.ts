import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.canelidoceria.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (DEMO_MODE) {
    return [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/cardapio`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/unidades`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/encomendas`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contato`, changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const supabase = createClient();

    const [{ data: products }, { data: stores }] = await Promise.all([
      supabase
        .from("products")
        .select("slug, updated_at")
        .eq("status", "published"),

      supabase
        .from("stores")
        .select("slug, updated_at")
        .eq("status", "active"),
    ]);

    const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
      url: `${SITE_URL}/cardapio/${p.slug}`,
      lastModified: p.updated_at ?? undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const storeRoutes: MetadataRoute.Sitemap = (stores ?? []).map((s) => ({
      url: `${SITE_URL}/unidades/${s.slug}`,
      lastModified: s.updated_at ?? undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...storeRoutes];
  } catch {
    return staticRoutes;
  }
}
