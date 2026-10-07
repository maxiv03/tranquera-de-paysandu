import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Canonical URL and hreflang alternates of a page in every locale. Pass a function when the
 * params differ per locale (service slugs). Relative URLs resolve against metadataBase.
 */
export async function alternatesFor(
  href: Href | ((locale: Locale) => Href),
): Promise<Metadata["alternates"]> {
  const current = (await getLocale()) as Locale;
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      getPathname({ locale, href: typeof href === "function" ? href(locale) : href }),
    ]),
  ) as Record<Locale, string>;
  return {
    canonical: languages[current],
    languages: { ...languages, "x-default": languages[routing.defaultLocale] },
  };
}
