import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { AuctionType } from "@/lib/domain";
import { createSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { effectiveStatus } from "./status";
import type { Auction } from "./types";

type AuctionRow = Database["public"]["Tables"]["auctions"]["Row"];
type SummaryRow = Database["public"]["Views"]["auction_summaries"]["Row"];

export const AUCTIONS_TAG = "auctions";

export function mapAuction(
  row: AuctionRow,
  summary: SummaryRow | undefined,
  now: number,
): Auction {
  return {
    id: row.id,
    number: row.number,
    type: row.type,
    startsAt: row.starts_at,
    venue: row.venue,
    department: row.department as Auction["department"],
    status: effectiveStatus(row.status, row.starts_at, now),
    imageUrl: row.image_url,
    notes: row.notes,
    lotCount: summary?.lot_count ?? 0,
    headCount: summary?.head_count ?? 0,
    categories: summary?.categories ?? [],
  };
}

/**
 * Every auction with its lot/head totals, oldest first. The dataset is small, so listings are
 * derived from this single cached read. Throws on failure: errors are never cached, and the
 * last good copy keeps being served (see the "catalog" cacheLife profile).
 */
export async function getAllAuctions(): Promise<Auction[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(AUCTIONS_TAG);

  const supabase = createSupabaseClient();
  const [auctions, summaries] = await Promise.all([
    supabase.from("auctions").select("*").order("starts_at"),
    supabase.from("auction_summaries").select("*"),
  ]);
  if (auctions.error)
    throw new Error(`Loading auctions failed: ${auctions.error.message}`);
  if (summaries.error)
    throw new Error(`Loading summaries failed: ${summaries.error.message}`);

  const byAuction = new Map(summaries.data.map((s) => [s.auction_id, s]));
  const now = Date.now();
  return auctions.data.map((row) => mapAuction(row, byAuction.get(row.id), now));
}

export type AuctionScope = "upcoming" | "finished";

/** Upcoming (live first, then soonest) or finished (most recent first), optionally by type. */
export async function getAuctions(
  scope: AuctionScope,
  type?: AuctionType,
): Promise<Auction[]> {
  const all = await getAllAuctions();
  const filtered = all.filter(
    (a) =>
      (scope === "finished" ? a.status === "finished" : a.status !== "finished") &&
      (!type || a.type === type),
  );
  if (scope === "finished") return filtered.reverse();
  return filtered.sort(
    (a, b) => Number(b.status === "live") - Number(a.status === "live"),
  );
}

/** The auction to feature on the home page: the live one, or else the next upcoming one. */
export async function getFeaturedAuction(): Promise<Auction | null> {
  const [first] = await getAuctions("upcoming");
  return first ?? null;
}

export async function getAuction(number: number): Promise<Auction | null> {
  const all = await getAllAuctions();
  return all.find((a) => a.number === number) ?? null;
}
