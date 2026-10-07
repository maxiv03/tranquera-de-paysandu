import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Previous / next lot of the same auction, with the position in the catalog. */
export function LotNavigation({
  auctionNumber,
  previous,
  next,
  position,
  total,
}: {
  auctionNumber: number;
  previous: number | null;
  next: number | null;
  position: number;
  total: number;
}) {
  const t = useTranslations("lotPage");
  const lotHref = (lot: number) => ({
    pathname: "/auctions/[auction]/lots/[lot]" as const,
    params: { auction: String(auctionNumber), lot: String(lot) },
  });
  const linkClass =
    "flex min-h-12 items-center gap-1.5 rounded-lg px-3 font-semibold text-primary hover:bg-primary-soft";

  return (
    <nav
      aria-label={t("position", { current: position, total })}
      className="flex items-center justify-between gap-2 border-y border-line py-2"
    >
      {previous ? (
        <Link href={lotHref(previous)} className={linkClass}>
          <ChevronLeft className="size-5" aria-hidden="true" />
          <span className="max-sm:sr-only">{t("previous")}</span>
        </Link>
      ) : (
        <span className="w-12" />
      )}
      <Link
        href={{
          pathname: "/auctions/[auction]",
          params: { auction: String(auctionNumber) },
          hash: "catalog",
        }}
        className="text-center text-sm text-ink-muted underline-offset-4 hover:text-primary hover:underline"
      >
        <span className="block font-semibold text-ink tabular">
          {t("position", { current: position, total })}
        </span>
        {t("backToCatalog")}
      </Link>
      {next ? (
        <Link href={lotHref(next)} className={linkClass}>
          <span className="max-sm:sr-only">{t("next")}</span>
          <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className="w-12" />
      )}
    </nav>
  );
}
