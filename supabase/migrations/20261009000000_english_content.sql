-- English versions of the sample content. All optional: the app falls back to Spanish when
-- one is missing, and the deployed site keeps working before it reads these columns.
alter table public.auctions
  add column title_en text,
  add column notes_en text;

alter table public.lots
  add column description_en text,
  add column breed_en text;
