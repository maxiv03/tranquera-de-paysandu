import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  // Internal routes are in English; each locale exposes its own public URL.
  pathnames: {
    "/": "/",
    "/auctions": { es: "/remates", en: "/auctions" },
    "/auctions/[auction]": { es: "/remates/[auction]", en: "/auctions/[auction]" },
    "/auctions/[auction]/lots/[lot]": {
      es: "/remates/[auction]/lotes/[lot]",
      en: "/auctions/[auction]/lots/[lot]",
    },
    "/services": { es: "/servicios", en: "/services" },
    "/services/[service]": { es: "/servicios/[service]", en: "/services/[service]" },
    "/contact": { es: "/contacto", en: "/contact" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;

// Auctions happen in Uruguay: always render dates in local time, whatever the server zone.
export const TIME_ZONE = "America/Montevideo";
