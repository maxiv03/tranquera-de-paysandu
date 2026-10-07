/** Absolute URL for share links and messages. Set NEXT_PUBLIC_SITE_URL in each environment. */
export function absoluteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}
