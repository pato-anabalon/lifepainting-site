import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { AnalyticsGate } from "@/components/organisms/AnalyticsGate";
import { LifePaintingPreloader } from "@/components/organisms/LifePaintingPreloader";
import { LIFE_PRELOADER_BOOT_SCRIPT } from "@/lib/motion/preloader";
import { SiteShell } from "@/components/templates/SiteShell";
import { SITE_URL } from "@/lib/seo";
import { site } from "@/lib/content";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

// Brand title font (licensed; owner's OTF converted to woff2). Black only: the "Line" cuts are outlines.
// It lacks a few symbols (& ’ – ( ) # % +); titles that use them get those characters from Montserrat.
const lovelo = localFont({
  src: "./fonts/LoveloBlack.woff2",
  weight: "900",
  variable: "--font-lovelo",
  display: "swap",
  fallback: ["Montserrat", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.legalName, template: `%s | ${site.name}` },
  applicationName: site.legalName,
};

export const viewport: Viewport = { themeColor: "#1F4A3A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${montserrat.variable} ${lovelo.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: LIFE_PRELOADER_BOOT_SCRIPT }} />
        <LifePaintingPreloader />
        <SiteShell>{children}</SiteShell>
        <AnalyticsGate />
      </body>
    </html>
  );
}
