import { CalendarDays, Clock, MapPin, Radio } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { CoverImage } from "@/components/ui/CoverImage";
import { DateBlock } from "@/components/ui/DateBlock";
import { buttonStyles } from "@/components/ui/button-styles";
import { CategoryBadge } from "@/components/lots/CategoryBadge";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import type { Auction } from "@/lib/data/types";
import { AuctionTypeBadge } from "./AuctionTypeBadge";
import { StatusBadge } from "./StatusBadge";

/** Top of the auction page: cover, key facts and the action that fits the auction status. */
export function AuctionHero({ auction }: { auction: Auction }) {
  const t = useTranslations();
  const format = useFormatter();
  const startsAt = new Date(auction.startsAt);
  const title = t("auction.title", { number: auction.number });

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      <CoverImage
        src={auction.imageUrl}
        alt={t("image.cover", { name: title })}
        sizes="(min-width: 1024px) 600px, 100vw"
        eager
        className="aspect-[16/9] self-start rounded-card shadow-card lg:aspect-[4/3]"
      />

      <div className="flex flex-col">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={auction.status} />
          <AuctionTypeBadge type={auction.type} />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <DateBlock date={auction.startsAt} today={auction.startsToday} size="lg" />
          <div>
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl">{title}</h1>
            {auction.title && (
              <p className="mt-1 text-lg font-medium text-accent">{auction.title}</p>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 [&_svg]:size-4 [&_svg]:text-ink-subtle">
          <div className="flex gap-2.5">
            <CalendarDays aria-hidden="true" className="mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs text-ink-subtle">{t("auctionPage.date")}</dt>
              <dd className="font-semibold first-letter:uppercase">
                {format.dateTime(startsAt, "long")}
              </dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Clock aria-hidden="true" className="mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs text-ink-subtle">{t("auctionPage.time")}</dt>
              <dd className="font-semibold tabular">
                {t("units.time", { time: format.dateTime(startsAt, "time") })}
              </dd>
            </div>
          </div>
          <div className="flex gap-2.5 sm:col-span-2">
            <MapPin aria-hidden="true" className="mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs text-ink-subtle">{t("auctionPage.venue")}</dt>
              <dd className="font-semibold">
                {auction.venue}
                <span className="font-normal text-ink-muted">
                  {" "}
                  · {auction.department}
                </span>
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-6 rounded-card bg-surface p-4 ring-1 ring-line">
          <p className="text-xs font-semibold tracking-wider text-ink-subtle uppercase">
            {t("auctionPage.summary")}
          </p>
          <p className="mt-1 font-display text-xl font-bold tabular">
            {t("units.lots", { count: auction.lotCount })}
            <span className="text-ink-subtle"> · </span>
            {t("units.heads", { count: auction.headCount })}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {auction.categories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>
        </div>

        {auction.notes && (
          <div className="mt-5">
            <p className="text-xs font-semibold tracking-wider text-ink-subtle uppercase">
              {t("auctionPage.notes")}
            </p>
            <p className="mt-1 text-ink-muted">{auction.notes}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {auction.status === "live" && (
            <Link href="/live" className={buttonStyles({ variant: "live", size: "lg" })}>
              <Radio aria-hidden="true" />
              {t("auction.watchLive")}
            </Link>
          )}
          {auction.status !== "finished" && (
            <WhatsAppButton
              size="lg"
              label={t("auctionPage.ask")}
              message={t("auctionPage.askMessage", { number: auction.number })}
              className={auction.status === "live" ? "" : "w-full sm:w-auto"}
            />
          )}
        </div>
        {auction.status !== "upcoming" && (
          <p className="mt-4 text-sm text-ink-muted">
            {auction.status === "live"
              ? t("auctionPage.liveNote")
              : t("auctionPage.finishedNote")}
          </p>
        )}
      </div>
    </section>
  );
}
