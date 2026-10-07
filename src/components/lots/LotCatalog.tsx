import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips, type FilterOption } from "@/components/ui/FilterChips";
import { Link } from "@/i18n/navigation";
import {
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

/** Filterable lot grid for one auction. Filters come from the URL (see catalog-filters.ts). */
export function LotCatalog({
  auctionNumber,
  lots,
  filters,
}: {
  auctionNumber: number;
  lots: Lot[];
  filters: CatalogFilters;
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

  return (
    <>
      <div className="mt-6 grid gap-5 rounded-card bg-surface p-4 ring-1 ring-line sm:p-5 lg:grid-cols-3">
        <FilterChips
          label={t("catalogFilters.category")}
          options={optionsFor("category")}
        />
        <FilterChips
          label={t("catalogFilters.department")}
          options={optionsFor("department")}
        />
        <FilterChips label={t("catalogFilters.weight")} options={optionsFor("weight")} />
      </div>

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
          {shown.map((lot) => (
            <li key={lot.id} className="flex min-w-0 [&>article]:flex-1">
              <LotCard lot={lot} auctionNumber={auctionNumber} />
            </li>
          ))}
        </ul>
      ) : (
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
