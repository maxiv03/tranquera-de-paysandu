// Shared by the live page (server) and its tracker (client). Constants imported from a
// "use client" module arrive as client references on the server, so they live here.

/** Simulated pace of the demo broadcast. */
export const MINUTES_PER_LOT = 6;

/** Attribute on the live page grid items; the lot in the ring gets aria-current="true". */
export const LIVE_LOT_ATTRIBUTE = "data-live-lot";
