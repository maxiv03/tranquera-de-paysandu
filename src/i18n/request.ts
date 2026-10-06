import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { formats } from "./formats";
import { routing, TIME_ZONE } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await rootLocale());
  const resolved = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale: resolved,
    timeZone: TIME_ZONE,
    formats,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
