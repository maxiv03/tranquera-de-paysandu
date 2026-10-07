// The company's services. Texts live in messages (services.<slug>.title / .summary / ...).
// Slugs are language-neutral so the language switcher keeps the same URL params.
export const SERVICES = [
  { slug: "screen-auctions", image: "/images/auctions/cover-5.webp" },
  { slug: "fairs", image: "/images/auctions/cover-2.webp" },
  { slug: "slaughterhouse-shipments", image: "/images/auctions/cover-1.webp" },
  { slug: "private-deals", image: "/images/auctions/cover-3.webp" },
  { slug: "land", image: "/images/auctions/cover-4.webp" },
  { slug: "appraisals", image: "/images/auctions/cover-6.webp" },
  { slug: "transport", image: "/images/auctions/cover-7.webp" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

export function isServiceSlug(value: string): value is ServiceSlug {
  return SERVICES.some((service) => service.slug === value);
}
