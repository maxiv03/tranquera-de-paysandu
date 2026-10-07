/**
 * Public base URL of the site: NEXT_PUBLIC_SITE_URL (production, custom domain), else the URL
 * Vercel gives each deployment (previews), else localhost.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000");

/** Absolute URL for share links, metadata and messages. */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
