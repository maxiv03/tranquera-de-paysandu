import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 60 for above-the-fold photos (LCP on slow phones), 75 (default) everywhere else.
    qualities: [60, 75],
  },
  experimental: {
    // Tailwind output is small: inline it in <head> instead of render-blocking <link>s (LCP).
    inlineCss: true,
  },
  // Open Graph images read local photos and fonts from disk: ship them with those functions.
  outputFileTracingIncludes: {
    "/[locale]/**/opengraph-image": ["./public/images/**/*", "./src/assets/fonts/*"],
    "/[locale]/opengraph-image": ["./public/images/auctions/*", "./src/assets/fonts/*"],
  },
  cacheLife: {
    // Catalog data (auctions, lots, agents). Refreshes in the background every 5 minutes, and
    // keeps serving the last good copy for a month if Supabase is paused or unreachable.
    catalog: {
      stale: 60,
      revalidate: 60 * 5,
      expire: 60 * 60 * 24 * 30,
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
