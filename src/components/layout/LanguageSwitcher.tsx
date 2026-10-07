"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type Href = Parameters<typeof Link>[0]["href"];

function SwitcherLink({
  query,
  className,
}: {
  query?: Record<string, string>;
  className: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const target: Locale =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale: _locale, ...routeParams } = params;
  const href = { pathname, params: routeParams, query } as Href;

  return (
    <Link
      href={href}
      locale={target}
      hrefLang={target}
      lang={target}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-primary-soft hover:text-primary ${className}`}
    >
      <Languages className="size-4" aria-hidden="true" />
      <span className="sr-only">{t("switchTo")}</span>
      <span aria-hidden="true" className="uppercase">
        {target}
      </span>
    </Link>
  );
}

function SwitcherWithQuery({ className }: { className: string }) {
  const searchParams = useSearchParams();
  return (
    <SwitcherLink
      query={Object.fromEntries(searchParams.entries())}
      className={className}
    />
  );
}

/**
 * Link to the same page in the other locale: same route, same params and same filters
 * (/es/remates/121?categoria=… ↔ /en/auctions/121?…). A real link, so it works without JS.
 * The prerendered HTML has the link without the query; it gains the filters on hydration.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  return (
    <Suspense fallback={<SwitcherLink className={className} />}>
      <SwitcherWithQuery className={className} />
    </Suspense>
  );
}
