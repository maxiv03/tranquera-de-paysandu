import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/server";
import { AUCTIONS_TAG, getAuction } from "./auctions";
import type { AuctionCatalog, Lot, LotDetail } from "./types";

const LOT_SELECT =
  "*, lot_photos (url, position), agents (id, name, photo_url, phone, whatsapp)" as const;

async function getLotsForAuction(auctionId: number): Promise<Lot[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(AUCTIONS_TAG, `auction-${auctionId}`);

  const { data, error } = await createSupabaseClient()
    .from("lots")
    .select(LOT_SELECT)
    .eq("auction_id", auctionId)
    .order("number")
    .order("position", { referencedTable: "lot_photos" });
  if (error)
    throw new Error(`Loading lots of auction ${auctionId} failed: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    number: row.number,
    category: row.category,
    headCount: row.head_count,
    breed: row.breed,
    avgWeightKg: row.avg_weight_kg,
    department: row.department as Lot["department"],
    latitude: row.latitude,
    longitude: row.longitude,
    locationLabel: row.location_label,
    description: row.description,
    videoUrl: row.video_url,
    photos: row.lot_photos,
    agent: row.agents && {
      id: row.agents.id,
      name: row.agents.name,
      photoUrl: row.agents.photo_url,
      phone: row.agents.phone,
      whatsapp: row.agents.whatsapp,
    },
  }));
}

/** An auction with its full lot catalog, or null if the auction number does not exist. */
export async function getAuctionCatalog(
  auctionNumber: number,
): Promise<AuctionCatalog | null> {
  const auction = await getAuction(auctionNumber);
  if (!auction) return null;
  return { auction, lots: await getLotsForAuction(auction.id) };
}

/** One lot with its auction and the neighbours used by the previous/next navigation. */
export async function getLotDetail(
  auctionNumber: number,
  lotNumber: number,
): Promise<LotDetail | null> {
  const catalog = await getAuctionCatalog(auctionNumber);
  if (!catalog) return null;
  const index = catalog.lots.findIndex((l) => l.number === lotNumber);
  if (index === -1) return null;
  return {
    auction: catalog.auction,
    lot: catalog.lots[index],
    previousLotNumber: catalog.lots[index - 1]?.number ?? null,
    nextLotNumber: catalog.lots[index + 1]?.number ?? null,
    position: index + 1,
    total: catalog.lots.length,
  };
}
