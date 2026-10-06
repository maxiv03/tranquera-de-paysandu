import type { Metadata } from "next";
import { Archivo, Bitter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { locale } from "next/root-params";
import { routing } from "@/i18n/routing";
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
    title: { default: t("name"), template: `%s · ${t("name")}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <html lang={await locale()} className={`${archivo.variable} ${bitter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
