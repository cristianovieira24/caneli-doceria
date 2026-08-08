import type { Metadata } from "next";
import { Fraunces, Caveat, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ConsentBanner } from "@/components/consent-banner";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { SiteModeProvider } from "@/components/site-mode-provider";
import { getFunctionalDemoMode } from "@/lib/site-mode";

/**
 * Trava fixa da instalação.
 * Controla SEO, indexação, schemas e analytics.
 * NÃO é alterada pelo botão do admin.
 */
const DEMO_INSTALLATION =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const themeInitScript = `
  (function () {
    try {
      var saved = localStorage.getItem("caneli-theme-v2");
      var dark = saved === "dark";
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch (e) {}
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(
    DEMO_INSTALLATION
      ? "https://caneli-doceria.vercel.app"
      : process.env.NEXT_PUBLIC_SITE_URL ||
          "https://www.canelidoceria.com.br"
  ),
  title: {
    default: "Caneli Doceria — Doces, cafés e dias felizes | Goiânia",
    template: "%s | Caneli Doceria",
  },
  description: DEMO_INSTALLATION
    ? "Demonstração independente de projeto digital para a Caneli Doceria."
    : "Doceria e cafeteria artesanal em Goiânia. Croissants, bolos, tortas, cafés e encomendas para presentear e comemorar.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Caneli Doceria",
  },
  robots: DEMO_INSTALLATION
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : {
        index: true,
        follow: true,
      },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoMode = await getFunctionalDemoMode();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fraunces.variable} ${caveat.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>

      <body>
        <SiteModeProvider demoMode={demoMode}>
          <a
            href="#conteudo-principal"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-pine focus:px-5 focus:py-2.5 focus:text-sm focus:text-cream-soft"
          >
            Pular para o conteúdo
          </a>

          <SiteHeader />

          <main id="conteudo-principal">{children}</main>

          <SiteFooter />
          <CartDrawer />
        </SiteModeProvider>

        {!DEMO_INSTALLATION && <ConsentBanner />}
        {!DEMO_INSTALLATION && <AnalyticsScripts />}
      </body>
    </html>
  );
}
