import { useLocale } from "next-intl";

/**
 * Sample content stored in both languages (Spanish required, English optional). Display it with
 * pickLocalized / useLocalized: English when present on /en, otherwise the Spanish original.
 */
export type Localized = { es: string; en: string | null };

export function localized(es: string, en: string | null): Localized {
  return { es, en: en?.trim() ? en : null };
}

export function pickLocalized(value: Localized, locale: string): string;
export function pickLocalized(value: Localized | null, locale: string): string | null;
export function pickLocalized(value: Localized | null, locale: string) {
  if (!value) return null;
  return locale === "en" && value.en ? value.en : value.es;
}

/** In components: const text = useLocalized(); text(auction.title). */
export function useLocalized() {
  const locale = useLocale();
  function text(value: Localized): string;
  function text(value: Localized | null): string | null;
  function text(value: Localized | null) {
    return pickLocalized(value, locale);
  }
  return text;
}
