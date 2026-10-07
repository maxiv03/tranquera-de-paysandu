-- Row Level Security: the catalog is public read-only; contact messages are insert-only.
-- Grants are explicit so the Data API exposure does not depend on project defaults.

alter table public.agents enable row level security;
alter table public.auctions enable row level security;
alter table public.lots enable row level security;
alter table public.lot_photos enable row level security;
alter table public.contact_messages enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.agents, public.auctions, public.lots, public.lot_photos
  to anon, authenticated;
grant insert (name, email, phone, message) on public.contact_messages to anon, authenticated;

create policy "Agents are public" on public.agents
  for select to anon, authenticated using (true);
create policy "Auctions are public" on public.auctions
  for select to anon, authenticated using (true);
create policy "Lots are public" on public.lots
  for select to anon, authenticated using (true);
create policy "Lot photos are public" on public.lot_photos
  for select to anon, authenticated using (true);
create policy "Anyone can send a contact message" on public.contact_messages
  for insert to anon, authenticated with check (true);

-- Per-auction totals for cards and headers. security_invoker keeps the lots RLS in force.
create view public.auction_summaries
with (security_invoker = true) as
select
  a.id as auction_id,
  count(l.id)::integer as lot_count,
  coalesce(sum(l.head_count), 0)::integer as head_count,
  coalesce(
    array_agg(distinct l.category order by l.category) filter (where l.id is not null),
    '{}'
  ) as categories
from public.auctions a
left join public.lots l on l.auction_id = a.id
group by a.id;

grant select on public.auction_summaries to anon, authenticated;
