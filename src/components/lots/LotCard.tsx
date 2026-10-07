import { Check, MapPin, Play } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/ui/CoverImage";
import { Link } from "@/i18n/navigation";
import type { Lot } from "@/lib/data/types";
import { CategoryBadge } from "./CategoryBadge";

/**
 * Catalog card for one lot: photo, category and the figures buyers scan first.
 * Horizontal on phones (photo beside the data, so a 12-lot catalog stays short), stacked from sm.
 * Lots of finished auctions are marked sold and show their reference price.
 */
export function LotCard({
  lot,
  auctionNumber,
  sold = false,
}: {
  lot: Lot;
  auctionNumber: number;
  sold?: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const title = t("lot.title", { number: lot.number });

  return (
    <article className="group relative flex min-w-0 overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line transition-shadow hover:shadow-lg sm:flex-col">
      <CoverImage
        src={lot.photos[0]?.url}
        alt={`${title} · ${t(`lotCategory.${lot.category}`)} ${lot.breed}`}
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 128px"
        className="w-32 shrink-0 self-stretch sm:aspect-[4/3] sm:w-auto"
      />
      <div className="absolute top-2 left-2 flex max-w-28 flex-wrap gap-1.5 sm:top-3 sm:left-3 sm:max-w-none">
        <Badge tone="solid" className="font-display sm:text-sm">
          {title}
        </Badge>
        {sold && (
          <Badge tone="sold">
            <Check className="size-3.5" aria-hidden="true" />
            {t("lot.sold")}
          </Badge>
        )}
      </div>
      {lot.videoUrl && (
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink/75 px-2 py-0.5 text-xs font-semibold text-white sm:top-3 sm:right-3 sm:bottom-auto sm:left-auto">
          <Play className="size-3 fill-current" aria-hidden="true" />
          {t("lot.hasVideo")}
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={lot.category} />
          <span className="truncate text-sm text-ink-subtle">{lot.breed}</span>
        </div>
        <h3 className="mt-2 text-base leading-snug font-bold sm:mt-3 sm:text-lg">
          <Link
            href={{
              pathname: "/auctions/[auction]/lots/[lot]",
              params: { auction: String(auctionNumber), lot: String(lot.number) },
            }}
            className="after:absolute after:inset-0 after:content-[''] group-has-[a:focus-visible]:after:rounded-card group-has-[a:focus-visible]:after:outline-2 group-has-[a:focus-visible]:after:outline-primary focus-visible:outline-none"
          >
            {t("units.heads", { count: lot.headCount })}
            <span className="text-ink-subtle"> · </span>
            {t("units.kg", { value: format.number(lot.avgWeightKg, "integer") })}
          </Link>
        </h3>
        {sold && lot.referencePriceUsdPerKg !== null && (
          <p className="mt-1 text-sm">
            <span className="text-ink-subtle">{t("lot.referencePriceShort")} </span>
            <span className="font-semibold text-accent tabular">
              {t("units.usdPerKg", {
                value: format.number(lot.referencePriceUsdPerKg, "price"),
              })}
            </span>
          </p>
        )}
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm text-ink-muted sm:pt-3">
          <MapPin className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <span className="truncate">
            {lot.locationLabel
              ? `${lot.locationLabel}, ${lot.department}`
              : lot.department}
          </span>
        </p>
      </div>
    </article>
  );
}
