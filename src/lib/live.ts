// Shared by the live page (server) and its tracker (client). Constants imported from a
// "use client" module arrive as client references on the server, so they live here.
import { TIME_ZONE } from "@/i18n/routing";
import { LIVE_WINDOW_MS } from "@/lib/data/status";

/** Attribute on the live page grid items; the lot in the ring gets aria-current="true". */
export const LIVE_LOT_ATTRIBUTE = "data-live-lot";

/**
 * The demo live auction (auctions.demo_live) is always on air: it "starts" at the beginning of
 * the current 2-hour block, Uruguay time. Being a pure function of the clock, the server (data
 * read) and the browser (tracker) agree, and stale cached pages still show it live.
 */
export const DEMO_LIVE_CYCLE_MS = 2 * 60 * 60 * 1000;

function timeZoneOffsetMs(now: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(now);
  const value = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  const local = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour"),
    value("minute"),
    value("second"),
  );
  return local - Math.floor(now / 1000) * 1000;
}

export function demoLiveStart(now: number) {
  const offset = timeZoneOffsetMs(now);
  return Math.floor((now + offset) / DEMO_LIVE_CYCLE_MS) * DEMO_LIVE_CYCLE_MS - offset;
}

/**
 * Simulated progress of a broadcast: the lots are spread over its duration (the live window for
 * a real auction, the 2-hour cycle for the demo one), reaching the last lot at the end.
 */
export function lotIndexAt(
  startsAt: number,
  now: number,
  total: number,
  durationMs = LIVE_WINDOW_MS,
) {
  const index = Math.floor(((now - startsAt) / durationMs) * total);
  return Math.min(Math.max(index, 0), total - 1);
}
