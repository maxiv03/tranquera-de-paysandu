-- Demo schedule: keeps the portfolio demo looking current without anyone touching it.
--
-- 1. demo_live: an auction that is always live. Its start time is derived in the app from the
--    current time (2-hour cycles), so it needs no cron and survives cached pages.
-- 2. demo_day_offset / demo_time: where the other auctions sit relative to "today". The daily
--    cron calls rotate_demo_dates(), which re-anchors them once a week.

alter table public.auctions
  add column demo_live boolean not null default false,
  add column demo_day_offset integer,
  add column demo_time time;

-- Small key/value store for demo bookkeeping (last rotation). Not exposed to the Data API.
create table public.demo_state (
  key text primary key,
  value timestamptz not null default now()
);
alter table public.demo_state enable row level security;
revoke all on public.demo_state from anon, authenticated;

-- Re-anchors demo auctions to the current date when the last rotation is 7+ days old (or when
-- forced). Returns true if it rotated. Only the server (secret key) may call it.
create function public.rotate_demo_dates(force boolean default false)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  last_rotation timestamptz;
  today date := (now() at time zone 'America/Montevideo')::date;
begin
  select value into last_rotation from demo_state where key = 'last_rotation';
  if not force and last_rotation is not null and last_rotation > now() - interval '7 days' then
    return false;
  end if;

  update auctions
  set starts_at = (today + demo_day_offset + demo_time) at time zone 'America/Montevideo',
      status = case
        when (today + demo_day_offset + demo_time) at time zone 'America/Montevideo' < now()
          then 'finished'::auction_status
        else 'upcoming'::auction_status
      end
  where demo_day_offset is not null and not demo_live;

  insert into demo_state (key, value) values ('last_rotation', now())
  on conflict (key) do update set value = excluded.value;
  return true;
end;
$$;

revoke all on function public.rotate_demo_dates(boolean) from public, anon, authenticated;
grant execute on function public.rotate_demo_dates(boolean) to service_role;
