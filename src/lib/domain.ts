import { Constants, type Database } from "@/lib/supabase/database.types";

type Enums = Database["public"]["Enums"];

export type AuctionType = Enums["auction_type"];
export type AuctionStatus = Enums["auction_status"];
export type LotCategory = Enums["lot_category"];

// Enum values in display order. Labels come from messages: auctionType.*, auctionStatus.*, lotCategory.*
export const AUCTION_TYPES = Constants.public.Enums.auction_type;
export const AUCTION_STATUSES = Constants.public.Enums.auction_status;
export const LOT_CATEGORIES = Constants.public.Enums.lot_category;

// Mirrors the uy_department domain in the database. Proper nouns: never translated.
export const DEPARTMENTS = [
  "Artigas",
  "Canelones",
  "Cerro Largo",
  "Colonia",
  "Durazno",
  "Flores",
  "Florida",
  "Lavalleja",
  "Maldonado",
  "Montevideo",
  "Paysandú",
  "Río Negro",
  "Rivera",
  "Rocha",
  "Salto",
  "San José",
  "Soriano",
  "Tacuarembó",
  "Treinta y Tres",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export function isLotCategory(value: string): value is LotCategory {
  return (LOT_CATEGORIES as readonly string[]).includes(value);
}

export function isAuctionType(value: string): value is AuctionType {
  return (AUCTION_TYPES as readonly string[]).includes(value);
}

export function isDepartment(value: string): value is Department {
  return (DEPARTMENTS as readonly string[]).includes(value);
}
