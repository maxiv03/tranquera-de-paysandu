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
  startsAt: string;
  venue: string;
  department: Department;
  /** Status shown to visitors: the stored status, corrected by the start time (see status.ts). */
  status: AuctionStatus;
  imageUrl: string | null;
  notes: string | null;
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
  breed: string;
  avgWeightKg: number;
  department: Department;
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  description: string | null;
  videoUrl: string | null;
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
