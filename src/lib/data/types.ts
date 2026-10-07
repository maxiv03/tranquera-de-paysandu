import type { Localized } from "@/lib/localized";
import type { AuctionStatus, AuctionType, Department, LotCategory } from "@/lib/domain";

// Domain types used by pages and components (camelCase, already mapped from the DB rows).
// Dates travel as ISO strings so they serialize cleanly through the cache and to the client.

export type Agent = {
  id: number;
  name: string;
  photoUrl: string | null;
  phone: string;
  whatsapp: string;
};

export type Auction = {
  id: number;
  number: number;
  type: AuctionType;
  /** Display name, e.g. "Gran remate de primavera" (sample content, not translated). */
  title: Localized | null;
  startsAt: string;
  /** Always-live demo auction: start time follows the clock (see src/lib/live.ts). */
  demoLive: boolean;
  /** Starts today in Montevideo time (computed when the data is read). */
  startsToday: boolean;
  venue: string;
  department: Department;
  /** Status shown to visitors: the stored status, corrected by the start time (see status.ts). */
  status: AuctionStatus;
  imageUrl: string | null;
  notes: Localized | null;
  lotCount: number;
  headCount: number;
  categories: LotCategory[];
};

export type LotPhoto = { url: string; position: number };

export type Lot = {
  id: number;
  number: number;
  category: LotCategory;
  headCount: number;
  breed: Localized;
  avgWeightKg: number;
  department: Department;
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  description: Localized | null;
  videoUrl: string | null;
  /** US$ per kg of live weight; only for lots of finished auctions. */
  referencePriceUsdPerKg: number | null;
  photos: LotPhoto[];
  agent: Agent | null;
};

export type AuctionCatalog = { auction: Auction; lots: Lot[] };

export type LotDetail = {
  auction: Auction;
  lot: Lot;
  previousLotNumber: number | null;
  nextLotNumber: number | null;
  /** 1-based position in the auction catalog. */
  position: number;
  total: number;
};
