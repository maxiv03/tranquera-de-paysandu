import type { Lot } from "@/lib/data/types";
import {
  isAuctionType,
  isDepartment,
  isLotCategory,
  type AuctionType,
  type Department,
  type LotCategory,
} from "@/lib/domain";

// URL search params are language-neutral (same keys and values in /es and /en), so the language
// switcher can carry them over unchanged.
export type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// Auction list ------------------------------------------------------------------------------

export type AuctionView = "upcoming" | "finished";

export function parseAuctionListParams(params: SearchParams): {
  view: AuctionView;
  type?: AuctionType;
} {
  const view = single(params.view) === "finished" ? "finished" : "upcoming";
  const type = single(params.type);
  return { view, type: type && isAuctionType(type) ? type : undefined };
}

// Lot catalog -------------------------------------------------------------------------------

/** Average weight ranges in kg: min inclusive, max exclusive. Labels: catalogFilters.weightRange. */
export const WEIGHT_RANGES = [
  { key: "under200", min: 0, max: 200 },
  { key: "200to300", min: 200, max: 300 },
  { key: "300to400", min: 300, max: 400 },
  { key: "over400", min: 400, max: Infinity },
] as const;

export type WeightRangeKey = (typeof WEIGHT_RANGES)[number]["key"];

export type CatalogFilters = {
  category?: LotCategory;
  department?: Department;
  weight?: WeightRangeKey;
};

export type CatalogDimension = keyof CatalogFilters;

export function parseCatalogFilters(params: SearchParams): CatalogFilters {
  const category = single(params.category);
  const department = single(params.department);
  const weight = single(params.weight);
  return {
    category: category && isLotCategory(category) ? category : undefined,
    department: department && isDepartment(department) ? department : undefined,
    weight: WEIGHT_RANGES.some((r) => r.key === weight)
      ? (weight as WeightRangeKey)
      : undefined,
  };
}

export function weightRangeOf(kg: number): WeightRangeKey {
  return WEIGHT_RANGES.find((r) => kg >= r.min && kg < r.max)!.key;
}

function lotValue(lot: Lot, dimension: CatalogDimension): string {
  if (dimension === "category") return lot.category;
  if (dimension === "department") return lot.department;
  return weightRangeOf(lot.avgWeightKg);
}

/** Lots matching every active filter, optionally ignoring one dimension (for facet counts). */
export function filterLots(
  lots: Lot[],
  filters: CatalogFilters,
  ignore?: CatalogDimension,
) {
  return lots.filter((lot) =>
    (Object.keys(filters) as CatalogDimension[]).every(
      (dimension) =>
        dimension === ignore ||
        !filters[dimension] ||
        lotValue(lot, dimension) === filters[dimension],
    ),
  );
}

/**
 * How many lots each option of a dimension would show, given the other active filters.
 * Options with zero lots are not in the map.
 */
export function facetCounts(
  lots: Lot[],
  filters: CatalogFilters,
  dimension: CatalogDimension,
) {
  const counts = new Map<string, number>();
  for (const lot of filterLots(lots, filters, dimension)) {
    const value = lotValue(lot, dimension);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

export function hasActiveFilters(filters: CatalogFilters) {
  return Object.values(filters).some(Boolean);
}

/** Search params for a link that sets (or clears, with undefined) one dimension. */
export function withFilter(
  filters: CatalogFilters,
  dimension: CatalogDimension,
  value: string | undefined,
): Record<string, string> {
  const next = { ...filters, [dimension]: value };
  return Object.fromEntries(Object.entries(next).filter(([, v]) => v)) as Record<
    string,
    string
  >;
}
