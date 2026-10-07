import type { AuctionStatus } from "@/lib/domain";

/** How long after its start an auction is still considered live, unless marked finished. */
export const LIVE_WINDOW_MS = 5 * 60 * 60 * 1000;

/**
 * The stored status is the source of truth when it says "finished". Otherwise the start time
 * decides, so a demo that nobody updates never shows a past auction as upcoming.
 */
export function effectiveStatus(
  stored: AuctionStatus,
  startsAt: string,
  now: number,
): AuctionStatus {
  if (stored === "finished") return "finished";
  const start = new Date(startsAt).getTime();
  if (now < start) return stored;
  return now < start + LIVE_WINDOW_MS ? "live" : "finished";
}
