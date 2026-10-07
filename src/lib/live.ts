// Shared by the live page (server) and its tracker (client). Constants imported from a
// "use client" module arrive as client references on the server, so they live here.

import { LIVE_WINDOW_MS } from "@/lib/data/status";

/**
 * Simulated progress of the demo broadcast: the lots are spread over the live window, so the
 * "in the ring" lot moves on steadily and reaches the last lot when the auction ends.
 */
export function lotIndexAt(startsAt: string, now: number, total: number) {
  const elapsed = now - new Date(startsAt).getTime();
  const index = Math.floor((elapsed / LIVE_WINDOW_MS) * total);
  return Math.min(Math.max(index, 0), total - 1);
}

/** Attribute on the live page grid items; the lot in the ring gets aria-current="true". */
export const LIVE_LOT_ATTRIBUTE = "data-live-lot";
