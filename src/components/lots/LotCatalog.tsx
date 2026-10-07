import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips, type FilterOption } from "@/components/ui/FilterChips";
import { FilterSheet } from "@/components/ui/FilterSheet";
import { Link } from "@/i18n/navigation";
import {
  CATALOG_PAGE_SIZE,
  facetCounts,
  filterLots,
  hasActiveFilters,
  WEIGHT_RANGES,
  weightRangeOf,
  withFilter,
  type CatalogDimension,
  type CatalogFilters,
  type WeightRangeKey,
} from "@/lib/catalog-filters";
import type { Lot } from "@/lib/data/types";
import { DEPARTMENTS, LOT_CATEGORIES, type LotCategory } from "@/lib/domain";
import { LotCard } from "./LotCard";

/**
 * Filterable lot grid for one auction. Filters and paging come from the URL (catalog-filters.ts).
 * Phones: filters live in a bottom sheet and the grid shows `show` lots plus a "show more" link;
 * larger screens show the inline filter panel and every lot.
 */
export function LotCatalog({
  auctionNumber,
  lots,
  filters,
  show = CATALOG_PAGE_SIZE,
  sectionId,
}: {
  auctionNumber: number;
  lots: Lot[];
  filters: CatalogFilters;
  /** Lots visible on phones. */
  show?: number;
  /** Id of the catalog section: the phone "Filter" button shows while it is on screen. */
  sectionId: string;
}) {
  const t = useTranslations();
  const shown = filterLots(lots, filters);
  const href = (query: Record<string, string>) => ({
    pathname: "/auctions/[auction]" as const,
    params: { auction: String(auctionNumber) },
    query,
  });

  // Only offer values present in this auction, in a stable order.
  const present: Record<CatalogDimension, string[]> = {
    category: LOT_CATEGORIES.filter((c) => lots.some((l) => l.category === c)),
    department: DEPARTMENTS.filter((d) => lots.some((l) => l.department === d)),
    weight: WEIGHT_RANGES.map((r) => r.key).filter((k) =>
      lots.some((l) => weightRangeOf(l.avgWeightKg) === k),
    ),
  };
  const labels: Record<CatalogDimension, (value: string) => string> = {
    category: (value) => t(`lotCategory.${value as LotCategory}`),
    department: (value) => value,
    weight: (value) => t(`catalogFilters.weightRange.${value as WeightRangeKey}`),
  };

  const optionsFor = (dimension: CatalogDimension): FilterOption[] => {
    const counts = facetCounts(lots, filters, dimension);
    return [
      {
        key: "all",
        label: t("filters.all"),
        href: href(withFilter(filters, dimension, undefined)),
        active: !filters[dimension],
      },
      ...present[dimension].map((value) => ({
        key: value,
        label: labels[dimension](value),
        href: href(withFilter(filters, dimension, value)),
        active: filters[dimension] === value,
        count: counts.get(value) ?? 0,
        disabled: !counts.get(value),
      })),
    ];
  };

  const dimensions = [
    { key: "category", label: t("catalogFilters.category") },
    { key: "department", label: t("catalogFilters.department") },
    { key: "weight", label: t("catalogFilters.weight") },
  ] as const;
  const activeCount = Object.values(filters).filter(Boolean).length;
  const hidden = shown.length - show;
  const activeQuery = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value),
  ) as Record<string, string>;

  return (
    <>
      <div className="mt-6 hidden gap-5 rounded-card bg-surface p-5 ring-1 ring-line sm:grid lg:grid-cols-3">
        {dimensions.map(({ key, label }) => (
          <FilterChips key={key} label={label} options={optionsFor(key)} />
        ))}
      </div>
      <FilterSheet
        targetId={sectionId}
        activeCount={activeCount}
        resultCount={shown.length}
      >
        {dimensions.map(({ key, label }) => (
          <FilterChips key={key} label={label} options={optionsFor(key)} layout="wrap" />
        ))}
      </FilterSheet>

      <div className="mt-5 flex min-h-9 items-center justify-between gap-3">
        <p className="text-sm text-ink-muted" aria-live="polite">
          {t("auctionPage.results", { shown: shown.length, total: lots.length })}
        </p>
        {hasActiveFilters(filters) && (
          <Link
            href={href({})}
            scroll={false}
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            {t("filters.clear")}
          </Link>
        )}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((lot, index) => (
            <li
              key={lot.id}
              className={`flex min-w-0 [&>article]:flex-1 ${index >= show ? "max-sm:hidden" : ""}`}
            >
              <LotCard lot={lot} auctionNumber={auctionNumber} />
            </li>
          ))}
        </ul>
      ) : null}
      {hidden > 0 && (
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href={href({ ...activeQuery, show: String(show + CATALOG_PAGE_SIZE) })}
            scroll={false}
            className={buttonStyles({ variant: "secondary", className: "w-full" })}
          >
            {t("auctionPage.showMore", { count: hidden })}
          </Link>
        </div>
      )}
      {shown.length === 0 && (
        <div className="mt-4">
          <EmptyState
            title={t("auctionPage.emptyTitle")}
            description={t("auctionPage.emptyDescription")}
            action={
              <Link
                href={href({})}
                scroll={false}
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                {t("filters.clear")}
              </Link>
            }
          />
        </div>
      )}
    </>
  );
}
