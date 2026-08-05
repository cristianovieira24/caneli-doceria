import type { Metadata } from "next";
import { Fraunces, Caveat, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ConsentBanner } from "@/components/consent-banner";
import { AnalyticsScripts } from "@/components/analytics-scripts";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.canelidoceria.com.br"),
  title: {
    default: "Caneli Doceria — Doces, cafés e dias felizes | Goiânia",
    template: "%s | Caneli Doceria",
  },
  description:
    "Doceria e cafeteria artesanal em Goiânia. Croissants, bolos, tortas, cafés e encomendas para presentear e comemorar. Confira o cardápio e peça pelo WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Caneli Doceria",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${caveat.variable} ${inter.variable}`}>
      <body>
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
        <ConsentBanner />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
