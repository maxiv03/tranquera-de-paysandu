import type { Metadata } from "next";
import { Archivo, Bitter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale } from "next/root-params";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-bitter",
  weight: ["500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("brand");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("name"), template: `%s · ${t("name")}` },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: t("name"),
      locale: (await locale()) === "en" ? "en_US" : "es_UY",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const current = await locale();
  if (!hasLocale(routing.locales, current)) notFound();
  const t = await getTranslations("nav");

  return (
    <html lang={current} className={`${archivo.variable} ${bitter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <a
            href="#content"
            className="sr-only z-50 rounded-lg bg-primary px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {t("skipToContent")}
          </a>
          <SiteHeader />
          <main id="content" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppFab />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
