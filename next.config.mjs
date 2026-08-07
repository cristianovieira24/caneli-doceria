/** @type {import('next').NextConfig} */
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "cdn.vucasolution.com.br" },
      { protocol: "https", hostname: "ugc.production.linktr.ee" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    if (!DEMO_MODE) return [];
    // Belt-and-suspenders alongside robots.ts/metadata robots: even if a
    // crawler ignores robots.txt or meta tags, this HTTP header still
    // tells it not to index or archive the demo. Removed entirely (not
    // just relaxed) once NEXT_PUBLIC_DEMO_MODE=false.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
    ];
  },
};

export default nextConfig;
