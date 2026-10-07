import type { Locale } from "@/i18n/routing";

// The company's services. Texts live in messages under services.<key>. Each service has one URL
// slug per locale (/es/servicios/remates-por-pantalla ↔ /en/services/screen-auctions); the
// language switcher maps between them with translateServiceSlug().
export const SERVICES = [
  {
    key: "screen-auctions",
    slugs: { es: "remates-por-pantalla", en: "screen-auctions" },
    image: "/images/auctions/cover-5.webp",
    auctionType: "screen",
  },
  {
    key: "fairs",
    slugs: { es: "ferias", en: "saleyard-fairs" },
    image: "/images/auctions/cover-2.webp",
    auctionType: "fair",
  },
  {
    key: "slaughterhouse-shipments",
    slugs: { es: "embarques-a-frigorificos", en: "slaughterhouse-shipments" },
    image: "/images/auctions/cover-1.webp",
  },
  {
    key: "private-deals",
    slugs: { es: "negocios-particulares", en: "private-deals" },
    image: "/images/auctions/cover-3.webp",
  },
  {
    key: "land",
    slugs: { es: "venta-y-arrendamiento-de-campos", en: "land-sales-and-leases" },
    image: "/images/auctions/cover-4.webp",
  },
  {
    key: "appraisals",
    slugs: { es: "tasaciones", en: "appraisals" },
    image: "/images/auctions/cover-6.webp",
  },
  {
    key: "transport",
    slugs: { es: "transporte", en: "transport" },
    image: "/images/auctions/cover-7.webp",
  },
] as const satisfies readonly {
  key: string;
  slugs: Record<Locale, string>;
  image: string;
  /** Services that are auctions list the upcoming auctions of this type. */
  auctionType?: "screen" | "fair";
}[];

// Every service may carry auctionType (only the auction services define it).
export type Service = (typeof SERVICES)[number] & {
  readonly auctionType?: "screen" | "fair";
};
export type ServiceKey = Service["key"];

export function serviceBySlug(locale: Locale, slug: string): Service | undefined {
  return SERVICES.find((service) => service.slugs[locale] === slug);
}

/** The same service's slug in another locale (falls back to the input if unknown). */
export function translateServiceSlug(slug: string, from: Locale, to: Locale): string {
  return serviceBySlug(from, slug)?.slugs[to] ?? slug;
}
