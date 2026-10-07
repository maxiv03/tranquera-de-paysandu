-- Display name for each auction ("Gran remate de primavera") and a reference price for lots of
-- finished auctions (US$ per kg live weight). Both are sample content, shown as-is.
alter table public.auctions add column title text;

alter table public.lots
  add column reference_price_usd_per_kg numeric(4, 2)
  check (reference_price_usd_per_kg is null or reference_price_usd_per_kg between 0.5 and 15);
