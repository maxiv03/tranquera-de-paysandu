import { MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/ui/CoverImage";
import { Link } from "@/i18n/navigation";
import type { Lot } from "@/lib/data/types";
import { CategoryBadge } from "./CategoryBadge";

/** Catalog card for one lot: photo, category and the three figures buyers scan first. */
export function LotCard({ lot, auctionNumber }: { lot: Lot; auctionNumber: number }) {
  const t = useTranslations();
  const format = useFormatter();
  const title = t("lot.title", { number: lot.number });

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line transition-shadow hover:shadow-lg">
      <CoverImage
        src={lot.photos[0]?.url}
        alt={`${title} · ${t(`lotCategory.${lot.category}`)} ${lot.breed}`}
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3]"
      />
      <div className="absolute top-3 left-3 flex gap-2">
        <Badge tone="solid" className="font-display text-sm">
          {title}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={lot.category} />
          <span className="truncate text-sm text-ink-subtle">{lot.breed}</span>
        </div>
        <h3 className="mt-3 text-lg leading-snug font-bold">
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
        <p className="mt-auto flex items-center gap-1.5 pt-3 text-sm text-ink-muted">
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
