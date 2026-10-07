"use client";

import { ArrowRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LiveDot } from "@/components/auctions/StatusBadge";
import { Link } from "@/i18n/navigation";
import { LIVE_WINDOW_MS } from "@/lib/data/status";
import {
  DEMO_LIVE_CYCLE_MS,
  demoLiveStart,
  LIVE_LOT_ATTRIBUTE,
  lotIndexAt,
} from "@/lib/live";

/**
 * "In the ring now" panel: which lot is being auctioned, simulated from the minutes since the
 * start (the demo has no real broadcast). Also highlights that lot in the page grid.
 * For the always-live demo auction the start comes from the clock (2-hour cycles), so the start
 * time and the lot in the ring stay right even when the page itself was served from cache.
 */
export function LiveLotTracker({
  auctionNumber,
  startsAt,
  demo,
  lots,
}: {
  auctionNumber: number;
  startsAt: string;
  demo: boolean;
  /** Catalog order: lot number and a short localized summary ("70 vaquillonas · 300 kg"). */
  lots: { number: number; summary: string }[];
}) {
  const t = useTranslations();
  const format = useFormatter();
  // Computed after mount: the prerendered HTML must not depend on the clock.
  const [state, setState] = useState<{ index: number; start: number } | null>(null);
  const index = state?.index ?? null;

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const start = demo ? demoLiveStart(now) : new Date(startsAt).getTime();
      const duration = demo ? DEMO_LIVE_CYCLE_MS : LIVE_WINDOW_MS;
      setState({ index: lotIndexAt(start, now, lots.length, duration), start });
    };
    update();
    const timer = setInterval(update, 15_000);
    return () => clearInterval(timer);
  }, [startsAt, demo, lots.length]);

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
    <>
      <p className="min-h-6 font-semibold tabular">
        {state &&
          t("live.startedAt", { time: format.dateTime(new Date(state.start), "time") })}
      </p>
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
          <p className="mt-1.5 text-xs font-semibold text-ink tabular">
            <span className="min-h-4">
              {index === null
                ? null
                : index === lots.length - 1
                  ? t("live.lastLot")
                  : t("live.progress", { current: index + 1, total: lots.length })}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-ink-subtle">{t("live.trackHelp")}</p>
        </div>
      </div>
    </>
  );
}
