import { ArrowRight, Clock, MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { DateBlock } from "@/components/ui/DateBlock";
import { CoverImage } from "@/components/ui/CoverImage";
import { buttonStyles } from "@/components/ui/button-styles";
import { Link } from "@/i18n/navigation";
import type { Auction } from "@/lib/data/types";
import { useLocalized } from "@/lib/localized";
import { AuctionTypeBadge } from "./AuctionTypeBadge";
import { StatusBadge } from "./StatusBadge";

/** Auction summary card. The whole card links to the auction; live auctions add a live CTA. */
export function AuctionCard({
  auction,
  eager = false,
}: {
  auction: Auction;
  eager?: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const text = useLocalized();
  const title = t("auction.title", { number: auction.number });
  const isLive = auction.status === "live";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 transition-shadow hover:shadow-lg ${isLive ? "ring-2 ring-live" : "ring-line"}`}
    >
      <CoverImage
        src={auction.imageUrl}
        alt={t("image.cover", { name: title })}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        eager={eager}
        className="aspect-[16/9]"
      />
      <div className="absolute top-3 left-3 flex gap-2">
        <StatusBadge status={auction.status} onImage />
      </div>

      <div className="flex flex-1 gap-4 p-4">
        <DateBlock date={auction.startsAt} today={auction.startsToday} />
        <div className="min-w-0 flex-1">
          <AuctionTypeBadge type={auction.type} />
          <h3 className="mt-2 text-xl leading-tight font-bold">
            <Link
              href={{
                pathname: "/auctions/[auction]",
                params: { auction: String(auction.number) },
              }}
              className="after:absolute after:inset-0 after:content-[''] group-has-[a:focus-visible]:after:rounded-card group-has-[a:focus-visible]:after:outline-2 group-has-[a:focus-visible]:after:outline-primary focus-visible:outline-none"
            >
              {title}
            </Link>
          </h3>
          {auction.title && (
            <p className="mt-0.5 font-medium text-accent">{text(auction.title)}</p>
          )}
          <ul className="mt-2 space-y-1 text-sm text-ink-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-subtle">
            <li className="flex items-center gap-1.5">
              <Clock aria-hidden="true" />
              <span className="font-semibold text-ink tabular">
                {t("units.time", {
                  time: format.dateTime(new Date(auction.startsAt), "time"),
                })}
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <MapPin aria-hidden="true" className="mt-0.5" />
              <span>
                {auction.venue}
                <span className="text-ink-subtle"> · {auction.department}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">
            {t("units.lots", { count: auction.lotCount })}
          </span>
          {" · "}
          {t("units.heads", { count: auction.headCount })}
        </p>
        {isLive ? (
          <Link
            href="/live"
            className={buttonStyles({
              variant: "live",
              size: "sm",
              className: "relative z-10",
            })}
          >
            {t("auction.watchLive")}
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
            {auction.status === "finished"
              ? t("auction.results")
              : t("auction.viewCatalog")}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    </article>
  );
}
