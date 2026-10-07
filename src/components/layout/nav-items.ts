import type { Pathname } from "@/i18n/routing";

// Main navigation, in order. Labels: messages nav.<key>.
export const NAV_ITEMS = [
  { key: "auctions", href: "/auctions" },
  { key: "live", href: "/live" },
  { key: "services", href: "/services" },
  { key: "contact", href: "/contact" },
] as const satisfies readonly { key: string; href: Pathname }[];
