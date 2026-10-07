-- Initial schema: agents, auctions, lots, lot photos and contact messages.
-- Enum values are English keys; the UI translates them (messages/*.json).

create type public.auction_type as enum ('screen', 'fair');
create type public.auction_status as enum ('upcoming', 'live', 'finished');
create type public.lot_category as enum ('calves', 'steers', 'heifers', 'cows');

-- The 19 departments of Uruguay. Proper nouns: stored and shown as-is in every locale.
create domain public.uy_department as text check (
  value in (
    'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 'Flores', 'Florida',
    'Lavalleja', 'Maldonado', 'Montevideo', 'Paysandú', 'Río Negro', 'Rivera', 'Rocha',
    'Salto', 'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
  )
);

create table public.agents (
  id bigint generated always as identity primary key,
  name text not null,
  photo_url text,
  phone text not null,
  -- International format without "+" or spaces, ready for wa.me links (e.g. 59899123456).
  whatsapp text not null check (whatsapp ~ '^[0-9]{8,15}$'),
  created_at timestamptz not null default now()
);

create table public.auctions (
  id bigint generated always as identity primary key,
  -- Public identifier, used in URLs (/es/remates/128).
  number integer not null unique check (number > 0),
  type public.auction_type not null,
  starts_at timestamptz not null,
  venue text not null,
  department public.uy_department not null,
  stream_url text,
  status public.auction_status not null default 'upcoming',
  image_url text,
  notes text,
  created_at timestamptz not null default now()
);

create index auctions_starts_at_idx on public.auctions (starts_at);

create table public.lots (
  id bigint generated always as identity primary key,
  auction_id bigint not null references public.auctions (id) on delete cascade,
  -- Position in the auction catalog, used in URLs (/es/remates/128/lotes/7).
  number integer not null check (number > 0),
  category public.lot_category not null,
  head_count integer not null check (head_count > 0),
  breed text not null,
  avg_weight_kg integer not null check (avg_weight_kg between 50 and 1200),
  department public.uy_department not null,
  latitude double precision check (latitude between -35.1 and -30.0),
  longitude double precision check (longitude between -58.5 and -53.0),
  location_label text,
  description text,
  video_url text,
  agent_id bigint references public.agents (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (auction_id, number)
);

create index lots_auction_id_idx on public.lots (auction_id);
create index lots_agent_id_idx on public.lots (agent_id);

create table public.lot_photos (
  id bigint generated always as identity primary key,
  lot_id bigint not null references public.lots (id) on delete cascade,
  url text not null,
  position smallint not null default 0,
  unique (lot_id, position)
);

create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 120),
  email text check (email is null or email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) between 6 and 30),
  message text not null check (char_length(message) between 5 and 2000),
  created_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);
