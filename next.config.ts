import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
