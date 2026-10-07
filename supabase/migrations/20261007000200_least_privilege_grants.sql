-- Least privilege for the public roles. Supabase's default privileges grant anon/authenticated
-- every table privilege and leave RLS as the only guard; narrow them to what the site uses.

revoke all on public.agents, public.auctions, public.lots, public.lot_photos,
  public.contact_messages, public.auction_summaries
  from anon, authenticated;

grant select on public.agents, public.auctions, public.lots, public.lot_photos,
  public.auction_summaries
  to anon, authenticated;

grant insert (name, email, phone, message) on public.contact_messages to anon, authenticated;

-- Future tables start closed: grant explicitly in their migration.
alter default privileges in schema public revoke all on tables from anon, authenticated;
