import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllAuctions } from "@/lib/data/auctions";
import { getAuctionCatalog } from "@/lib/data/lots";
import { SERVICES } from "@/lib/services";
import { absoluteUrl } from "@/lib/site";

type Href = Parameters<typeof getPathname>[0]["href"];

/** One entry per page, in Spanish, with the English URL as hreflang alternate. */
function entry(href: Href | ((locale: "es" | "en") => Href), priority: number) {
  const url = (locale: "es" | "en") =>
    absoluteUrl(
      getPathname({ locale, href: typeof href === "function" ? href(locale) : href }),
    );
  return {
    url: url(routing.defaultLocale),
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, url(locale)]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    entry("/", 1),
    entry("/auctions", 0.9),
    entry("/live", 0.7),
    entry("/services", 0.6),
    entry("/contact", 0.5),
    ...SERVICES.map((service) =>
      entry(
        (locale) => ({
          pathname: "/services/[service]",
          params: { service: service.slugs[locale] },
        }),
        0.5,
      ),
    ),
  ];

  // Auctions and lots come from the catalog; without the database the static pages still list.
  try {
    const auctions = await getAllAuctions();
    const catalogs = await Promise.all(auctions.map((a) => getAuctionCatalog(a.number)));
    for (const catalog of catalogs) {
      if (!catalog) continue;
      const auction = String(catalog.auction.number);
      pages.push(entry({ pathname: "/auctions/[auction]", params: { auction } }, 0.8));
      for (const lot of catalog.lots) {
        pages.push(
          entry(
            {
              pathname: "/auctions/[auction]/lots/[lot]",
              params: { auction, lot: String(lot.number) },
            },
            0.6,
          ),
        );
      }
    }
  } catch {}

  return pages;
}
