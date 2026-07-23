import type { Metadata } from "next";
import { Archivo, Doppio_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import InteractiveBackground from "@/components/fx/InteractiveBackground";
import CustomCursor from "@/components/fx/CustomCursor";
import Preloader from "@/components/fx/Preloader";
import { site, SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/schema";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const doppioOne = Doppio_One({
  variable: "--font-doppio",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/**
 * Runs before paint: sets data-theme so there is no theme flash, and
 * flags data-preloading so the hero holds its intro for the preloader
 * (skipped for reduced-motion users).
 */
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-preloading","true")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${doppioOne.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      {/*
        suppressHydrationWarning: browser extensions (password managers,
        shopping assistants) inject attributes like bis_register into
        <body> before React hydrates; those attribute-only mismatches
        are noise, not app bugs.
      */}
      <body suppressHydrationWarning>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <SmoothScroll>
            <InteractiveBackground />
            {children}
            <CustomCursor />
            <Preloader />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
