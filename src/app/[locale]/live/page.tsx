import { ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AuctionCard } from "@/components/auctions/AuctionCard";
import { AuctionTypeBadge } from "@/components/auctions/AuctionTypeBadge";
import { LiveDot } from "@/components/auctions/StatusBadge";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LiveLotTracker } from "@/components/live/LiveLotTracker";
import { LotCard } from "@/components/lots/LotCard";
import { LoopVideo } from "@/components/media/LoopVideo";
import { buttonStyles } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LiveSkeleton } from "@/components/ui/Skeleton";
import { Link } from "@/i18n/navigation";
import { getAuctions } from "@/lib/data/auctions";
import { getAuctionCatalog } from "@/lib/data/lots";
import type { AuctionCatalog, Auction } from "@/lib/data/types";
import { LIVE_LOT_ATTRIBUTE } from "@/lib/live";
import { LIVE_VIDEO, posterFor } from "@/lib/media";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("live");
  return { title: t("metaTitle"), description: t("noneDescription") };
}

// The broadcast depends on cached reads under the [locale] root param (URL data for the App
// Shell), so it streams inside Suspense.
export default function LivePage() {
  return (
    <div className="container-page py-6 sm:py-10">
      <Suspense fallback={<LiveSkeleton />}>
        <LiveContent />
      </Suspense>
    </div>
  );
}

async function LiveContent() {
  const upcoming = await getAuctions("upcoming");
  const live = upcoming.find((a) => a.status === "live");
  const catalog = live ? await getAuctionCatalog(live.number) : null;
  const next = upcoming.find((a) => a.status === "upcoming") ?? null;
  return catalog ? <LiveBroadcast catalog={catalog} /> : <NothingLive next={next} />;
}

function LiveBroadcast({ catalog: { auction, lots } }: { catalog: AuctionCatalog }) {
  const t = useTranslations();
  const format = useFormatter();
  const title = t("auction.title", { number: auction.number });
  const auctionHref = {
    pathname: "/auctions/[auction]" as const,
    params: { auction: String(auction.number) },
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-live px-3 py-1 text-sm font-bold tracking-wide text-white uppercase">
          <LiveDot />
          {t("live.title")}
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {auction.title && <p className="font-medium text-accent">{auction.title}</p>}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px]">
        <figure>
          <div className="relative aspect-video overflow-hidden rounded-card bg-primary-strong shadow-card">
            <LoopVideo
              src={LIVE_VIDEO}
              poster={posterFor(LIVE_VIDEO)}
              label={t("live.videoLabel", { number: auction.number })}
            />
            <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded bg-live px-2 py-0.5 text-xs font-bold tracking-wider text-white uppercase">
              <LiveDot />
              {t("live.onAir")}
            </span>
          </div>
          <figcaption className="mt-2 text-xs text-ink-subtle">
            {t("live.demoNotice")}
          </figcaption>
        </figure>

        <aside className="flex flex-col gap-5 rounded-card bg-surface p-5 ring-1 ring-line">
          <div>
            <AuctionTypeBadge type={auction.type} />
            <p className="mt-3 flex items-start gap-1.5 text-sm text-ink-muted">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-ink-subtle"
                aria-hidden="true"
              />
              <span>
                {auction.venue} · {auction.department}
              </span>
            </p>
            <p className="mt-3 font-display text-lg font-bold tabular">
              {t("units.lots", { count: auction.lotCount })}
              <span className="text-ink-subtle"> · </span>
              {t("units.heads", { count: auction.headCount })}
            </p>
          </div>
          <LiveLotTracker
            auctionNumber={auction.number}
            startsAt={auction.startsAt}
            demo={auction.demoLive}
            lots={lots.map((lot) => ({
              number: lot.number,
              summary: `${t("units.heads", { count: lot.headCount })} · ${t(`lotCategory.${lot.category}`)} · ${t("units.kg", { value: format.number(lot.avgWeightKg, "integer") })}`,
            }))}
          />
          <div className="mt-auto space-y-3">
            <WhatsAppButton
              size="lg"
              className="w-full"
              label={t("live.bid")}
              message={t("live.bidMessage", { number: auction.number })}
            />
            <p className="text-xs text-ink-muted">{t("live.bidHelp")}</p>
            <Link
              href={auctionHref}
              className={buttonStyles({ variant: "secondary", className: "w-full" })}
            >
              {t("live.viewCatalog")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>

      <section aria-labelledby="live-lots" className="mt-12">
        <SectionHeading id="live-lots" title={t("live.catalog")} />
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lots.map((lot) => (
            <li
              key={lot.id}
              {...{ [LIVE_LOT_ATTRIBUTE]: lot.number }}
              className="group/live relative flex min-w-0 rounded-card ring-offset-2 ring-offset-paper transition-shadow aria-[current=true]:ring-2 aria-[current=true]:ring-live [&>article]:flex-1"
            >
              <LotCard lot={lot} auctionNumber={auction.number} />
              <span className="absolute -top-2.5 right-3 z-10 hidden items-center gap-1.5 rounded-full bg-live px-2.5 py-0.5 text-xs font-bold text-white uppercase shadow group-aria-[current=true]/live:inline-flex">
                <LiveDot />
                {t("live.currentBadge")}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function NothingLive({ next }: { next: Auction | null }) {
  const t = useTranslations("live");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="sr-only">{t("title")}</h1>
      <EmptyState title={t("noneTitle")} description={t("noneDescription")} />
      {next && (
        <section aria-labelledby="next-auction" className="mt-10">
          <SectionHeading id="next-auction" title={t("next")} />
          <div className="mt-5 max-w-md">
            <AuctionCard auction={next} />
          </div>
        </section>
      )}
    </div>
  );
}
