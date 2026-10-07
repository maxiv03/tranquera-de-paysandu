"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LiveDot } from "@/components/auctions/StatusBadge";
import { Link } from "@/i18n/navigation";
import { LIVE_LOT_ATTRIBUTE, MINUTES_PER_LOT } from "@/lib/live";

function currentIndex(startsAt: string, total: number) {
  const minutes = (Date.now() - new Date(startsAt).getTime()) / 60_000;
  return Math.min(Math.max(Math.floor(minutes / MINUTES_PER_LOT), 0), total - 1);
}

/**
 * "In the ring now" panel: which lot is being auctioned, simulated from the minutes since the
 * start (the demo has no real broadcast). Also highlights that lot in the page grid.
 */
export function LiveLotTracker({
  auctionNumber,
  startsAt,
  lots,
}: {
  auctionNumber: number;
  startsAt: string;
  /** Catalog order: lot number and a short localized summary ("70 vaquillonas · 300 kg"). */
  lots: { number: number; summary: string }[];
}) {
  const t = useTranslations();
  // Computed after mount: the prerendered HTML must not depend on the clock.
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setIndex(currentIndex(startsAt, lots.length));
    update();
    const timer = setInterval(update, 15_000);
    return () => clearInterval(timer);
  }, [startsAt, lots.length]);

  useEffect(() => {
    if (index === null) return;
    const current = String(lots[index].number);
    document.querySelectorAll(`[${LIVE_LOT_ATTRIBUTE}]`).forEach((element) => {
      if (element.getAttribute(LIVE_LOT_ATTRIBUTE) === current) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });
  }, [index, lots]);

  const lot = index === null ? null : lots[index];
  const progress = index === null ? 0 : ((index + 1) / lots.length) * 100;

  return (
    <div className="rounded-lg bg-live-soft p-4" aria-live="polite">
      <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-live uppercase">
        <LiveDot />
        {t("live.onTrack")}
      </p>
      {lot ? (
        <Link
          href={{
            pathname: "/auctions/[auction]/lots/[lot]",
            params: { auction: String(auctionNumber), lot: String(lot.number) },
          }}
          className="group mt-2 block"
        >
          <span className="flex items-center gap-2 font-display text-3xl font-bold text-ink">
            {t("lot.title", { number: lot.number })}
            <ArrowRight
              className="size-5 text-live transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
          <span className="mt-0.5 block text-sm text-ink-muted">{lot.summary}</span>
        </Link>
      ) : (
        <div className="mt-2 space-y-2" aria-hidden="true">
          <div className="h-8 w-28 animate-pulse rounded bg-live/15 motion-reduce:animate-none" />
          <div className="h-4 w-40 rounded bg-live/10" />
        </div>
      )}

      <div className="mt-4">
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={lots.length}
          aria-valuenow={index === null ? undefined : index + 1}
          aria-label={t("live.onTrack")}
          className="h-2 overflow-hidden rounded-full bg-live/15"
        >
          <div
            className="h-full rounded-full bg-live transition-[width] duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 flex justify-between text-xs text-ink-muted tabular">
          <span className="min-h-4">
            {index === null
              ? null
              : index === lots.length - 1
                ? t("live.lastLot")
                : t("live.progress", { current: index + 1, total: lots.length })}
          </span>
          <span>{t("live.trackHelp")}</span>
        </p>
      </div>
    </div>
  );
}
