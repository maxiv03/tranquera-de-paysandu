-- Demo data for Tranquera de Paysandú. All names and lots are fictional; every agent shares the
-- team demo WhatsApp number.
--
-- Safe to run again at any time: it empties the catalog tables and reloads them in a single
-- transaction (npm run db:seed). contact_messages is never touched.
-- Dates are relative to now(), so after a reset the demo has finished, live and upcoming auctions.

begin;

truncate table public.lot_photos, public.lots, public.auctions, public.agents
  restart identity cascade;
delete from public.demo_state;

-- Agents ----------------------------------------------------------------------------------------

insert into public.agents (name, photo_url, phone, whatsapp) values
  ('Martín Olivera',  '/images/agents/martin-olivera.svg', '+598 99 338 710', '59899338710'),
  ('Lucía Pereyra',   '/images/agents/lucia-pereyra.svg',  '+598 99 338 710', '59899338710'),
  ('Federico Sosa',   '/images/agents/federico-sosa.svg',  '+598 99 338 710', '59899338710');

-- Auctions --------------------------------------------------------------------------------------
-- Each auction stores where it sits relative to today (demo_day_offset + demo_time) so the daily
-- cron can re-anchor the dates weekly (rotate_demo_dates). Auction 120 is the demo live auction:
-- the app derives its start time from the current time, so it is always on air.
-- local(days, time): a day relative to today at a given local time in Montevideo.

create function pg_temp.local(days integer, at_time time) returns timestamptz
language sql stable as $$
  select ((now() at time zone 'America/Montevideo')::date + days + at_time)
    at time zone 'America/Montevideo'
$$;

insert into public.auctions
  (number, type, title, starts_at, venue, department, status, image_url, notes)
values
  (118, 'fair', 'Feria mensual de reposición', pg_temp.local(-38, '09:30'),
   'Local de Ferias Tranquera, Ruta 3 km 372', 'Paysandú', 'finished',
   '/images/auctions/cover-2.webp',
   'Plazo: contado o 30 días. Comisión 3 % + IVA.'),

  (119, 'screen', 'Remate del norte', pg_temp.local(-10, '14:00'),
   'Salón Los Ceibos', 'Salto', 'finished',
   '/images/auctions/cover-1.webp',
   'Plazo: 60 días con garantía bancaria.'),

  (120, 'screen', 'Remate de invernada',
   date_bin('15 minutes', now() - interval '20 minutes', timestamptz '2000-01-01'),
   'Estudio Tranquera', 'Paysandú', 'live',
   '/images/auctions/cover-4.webp',
   'Transmisión en vivo. Ofertas telefónicas a través de los agentes.'),

  (121, 'screen', 'Gran remate de primavera', pg_temp.local(9, '10:00'),
   'Estudio Tranquera', 'Paysandú', 'upcoming',
   '/images/auctions/cover-5.webp',
   'Plazo: 30, 60 o 90 días. Fletes coordinados por la empresa.'),

  (122, 'fair', 'Especial terneros', pg_temp.local(20, '09:30'),
   'Local de Ferias de Young', 'Río Negro', 'upcoming',
   null,
   'Feria de terneros y vaquillonas de reposición. Plazo: contado o 30 días.');

-- Demo schedule: offsets used by rotate_demo_dates() (keep them in sync with the dates above;
-- upcoming auctions sit more than 7 days ahead so a weekly rotation never lets them start).

update public.auctions a set demo_day_offset = v.days, demo_time = v.at_time
from (values
  (118, -38, time '09:30'), (119, -10, time '14:00'), (121, 9, time '10:00'), (122, 20, time '09:30')
) as v (number, days, at_time)
where a.number = v.number;

update public.auctions set demo_live = true where number = 120;

insert into public.demo_state (key, value) values ('last_rotation', now());

-- Lots ------------------------------------------------------------------------------------------

insert into public.lots
  (auction_id, number, category, head_count, breed, avg_weight_kg, department,
   latitude, longitude, location_label, description, agent_id)
select a.id, v.number, v.category::public.lot_category, v.head_count, v.breed, v.avg_weight_kg,
  v.department, v.latitude, v.longitude, v.location_label, v.description, g.id
from (values
  -- 118 · Feria mensual de reposición · Paysandú (finished)
  (118,  1, 'calves',  32, 'Hereford',         168, 'Paysandú',   -32.362, -57.214, 'Guichón',             'Terneros machos de destete, parejos, sanos y descornados.',                 'Martín Olivera'),
  (118,  2, 'calves',  28, 'Aberdeen Angus',   175, 'Paysandú',   -32.391, -57.583, 'Piedras Coloradas',   'Terneros negros de buena conformación, vacunados contra clostridiosis.',    'Martín Olivera'),
  (118,  3, 'heifers', 18, 'Hereford',         265, 'Paysandú',   -31.934, -57.861, 'Quebracho',           'Vaquillonas de sobreaño, aptas para entorar en primavera.',                 'Martín Olivera'),
  (118,  4, 'steers',  22, 'Braford',          345, 'Paysandú',   -32.334, -57.951, 'Porvenir',            'Novillos de 2 a 3 años con buen estado sanitario.',                         'Martín Olivera'),
  (118,  5, 'cows',    15, 'Hereford',         455, 'Paysandú',   -32.103, -57.402, 'Lorenzo Geyres',      'Vacas de invernada de buen frame, para terminar a campo.',                  'Martín Olivera'),
  (118,  6, 'calves',  40, 'Cruza británica',  182, 'Salto',      -31.081, -57.803, 'Constitución',        'Terneros cruza Hereford × Angus, destetados hace 30 días.',                 'Lucía Pereyra'),
  (118,  7, 'heifers', 20, 'Aberdeen Angus',   290, 'Río Negro',  -32.702, -57.604, 'Young',               'Vaquillonas negras de 2 años, entoradas con toro Angus.',                   'Federico Sosa'),
  (118,  8, 'cows',    12, 'Holando',          510, 'Paysandú',   -32.297, -58.021, 'Chacras de Paysandú', 'Vacas de refugo de tambo, gordas, listas para faena.',                      'Martín Olivera'),
  (118,  9, 'steers',  25, 'Hereford',         390, 'Paysandú',   -31.702, -57.698, 'Chapicuy',            'Novillos de sobreaño muy parejos, criados en campo natural.',               'Martín Olivera'),
  (118, 10, 'calves',  35, 'Braford',          160, 'Artigas',    -30.731, -57.322, 'Baltasar Brum',       'Terneros Braford rústicos, ideales para recría.',                           'Lucía Pereyra'),

  -- 119 · Remate del norte · Salto (finished)
  (119,  1, 'steers',  85, 'Hereford',         410, 'Salto',      -31.102, -57.031, 'Colonia Lavalleja',   'Novillos Hereford de 2 años, terminados en campo mejorado.',                'Lucía Pereyra'),
  (119,  2, 'calves', 120, 'Cruza británica',  175, 'Salto',      -30.795, -57.762, 'Belén',               'Ternerada de destete, machos y hembras apartados por sexo.',                'Lucía Pereyra'),
  (119,  3, 'heifers', 60, 'Hereford',         310, 'Salto',      -31.288, -57.121, 'Laureles',            'Vaquillonas preñadas de 3 meses con toro Hereford.',                        'Lucía Pereyra'),
  (119,  4, 'cows',    45, 'Aberdeen Angus',   470, 'Salto',      -30.968, -57.521, 'Sarandí de Arapey',   'Vacas de cría con ternero al pie, en buen estado.',                         'Lucía Pereyra'),
  (119,  5, 'steers',  70, 'Braford',          380, 'Artigas',    -30.452, -56.948, 'Sequeira',            'Novillos Braford adaptados a los campos del norte.',                        'Lucía Pereyra'),
  (119,  6, 'calves',  95, 'Hereford',         190, 'Paysandú',   -31.871, -56.301, 'Tambores',            'Terneros Hereford pesados, desparasitados y vacunados.',                    'Martín Olivera'),
  (119,  7, 'heifers', 50, 'Brangus',          280, 'Tacuarembó', -31.721, -55.948, 'Tacuarembó',          'Vaquillonas Brangus de muy buena genética.',                                'Federico Sosa'),
  (119,  8, 'steers',  65, 'Aberdeen Angus',   455, 'Paysandú',   -32.351, -57.152, 'Guichón',             'Novillos Angus listos para embarque a frigorífico.',                        'Martín Olivera'),
  (119,  9, 'cows',    40, 'Hereford',         495, 'Río Negro',  -32.951, -58.033, 'Nuevo Berlín',        'Vacas gordas, aptas para cuota de exportación.',                            'Federico Sosa'),

  -- 120 · Remate de invernada · Paysandú (live)
  (120,  1, 'steers', 110, 'Hereford',         430, 'Paysandú',   -32.402, -56.904, 'Merinos',             'Novillos Hereford de exportación, de peso muy parejo.',                     'Martín Olivera'),
  (120,  2, 'calves', 150, 'Cruza británica',  185, 'Río Negro',  -32.421, -57.392, 'Algorta',             'Ternerada de primavera, mansa y bien criada.',                              'Federico Sosa'),
  (120,  3, 'heifers', 70, 'Aberdeen Angus',   300, 'Soriano',    -33.871, -57.372, 'Cardona',             'Vaquillonas Angus de sobreaño, coloradas y negras.',                        'Federico Sosa'),
  (120,  4, 'cows',    55, 'Hereford',         440, 'Soriano',    -33.512, -57.812, 'Palmitas',            'Vacas de invernada para recuperar en verdeo.',                              'Federico Sosa'),
  (120,  5, 'steers',  80, 'Braford',          370, 'Salto',      -31.348, -57.452, 'Ruta 31',             'Novillos Braford de 2 años con buena terminación.',                         'Lucía Pereyra'),
  (120,  6, 'calves', 100, 'Hereford',         200, 'Tacuarembó', -32.612, -55.831, 'San Gregorio de Polanco', 'Terneros Hereford de campo, destete precoz.',                          'Federico Sosa'),
  (120,  7, 'heifers', 45, 'Hereford',         345, 'Durazno',    -33.343, -55.632, 'Sarandí del Yí',      'Vaquillonas para entore, con diagnóstico de aptitud reproductiva.',         'Federico Sosa'),
  (120,  8, 'steers',  60, 'Aberdeen Angus',   480, 'Paysandú',   -31.942, -57.893, 'Quebracho',           'Novillos pesados, terminados a grano en los últimos 60 días.',              'Martín Olivera'),

  -- 121 · Gran remate de primavera · Paysandú (upcoming, featured, 28 lots)
  (121,  1, 'steers', 120, 'Hereford',         420, 'Paysandú',   -32.364, -57.182, 'Guichón',             'Novillos Hereford de 2 a 3 años, muy parejos, para embarque.',              'Martín Olivera'),
  (121,  2, 'steers',  90, 'Aberdeen Angus',   400, 'Río Negro',  -32.662, -58.121, 'San Javier',          'Novillos Angus negros criados en campo mejorado.',                          'Federico Sosa'),
  (121,  3, 'calves', 140, 'Hereford',         180, 'Paysandú',   -32.383, -57.968, 'Porvenir',            'Terneros Hereford machos, destete de otoño, descornados.',                  'Martín Olivera'),
  (121,  4, 'calves', 110, 'Cruza británica',  170, 'Tacuarembó', -32.151, -56.121, 'Curtina',             'Terneros cruza británica, vacunados contra aftosa y clostridiosis.',        'Federico Sosa'),
  (121,  5, 'heifers', 75, 'Hereford',         295, 'Salto',      -31.078, -57.842, 'Constitución',        'Vaquillonas Hereford de sobreaño, aptas para entorar.',                     'Lucía Pereyra'),
  (121,  6, 'heifers', 60, 'Braford',          320, 'Salto',      -31.302, -57.301, 'Ruta 4',              'Vaquillonas Braford de buena estructura y temperamento manso.',             'Lucía Pereyra'),
  (121,  7, 'cows',    50, 'Hereford',         460, 'Soriano',    -33.253, -58.004, 'Mercedes',            'Vacas de invernada de buen frame, sanas.',                                  'Federico Sosa'),
  (121,  8, 'cows',    40, 'Aberdeen Angus',   485, 'Paysandú',   -31.662, -57.902, 'Chapicuy',            'Vacas preñadas de 5 meses con toro Angus.',                                 'Martín Olivera'),
  (121,  9, 'steers',  85, 'Braford',          365, 'Tacuarembó', -32.812, -56.512, 'Paso de los Toros',   'Novillos Braford de sobreaño, para recría o invernada.',                    'Federico Sosa'),
  (121, 10, 'calves', 130, 'Aberdeen Angus',   195, 'Río Negro',  -32.688, -57.632, 'Young',               'Terneros Angus pesados y parejos.',                                         'Federico Sosa'),
  (121, 11, 'heifers', 55, 'Brangus',          305, 'Cerro Largo',-32.512, -54.521, 'Fraile Muerto',       'Vaquillonas Brangus con buena adaptación a los campos del este.',           'Federico Sosa'),
  (121, 12, 'steers',  70, 'Hereford',         445, 'Florida',    -33.731, -56.331, 'Sarandí Grande',      'Novillos gordos, listos para frigorífico.',                                 'Martín Olivera'),
  (121, 13, 'calves',  95, 'Hereford',         185, 'Salto',      -31.152, -57.648, 'Itapebí',             'Terneros Hereford de destete, con sanidad al día.',                         'Lucía Pereyra'),
  (121, 14, 'calves', 120, 'Aberdeen Angus',   190, 'Paysandú',   -32.062, -57.362, 'Cerro Chato',         'Terneros Angus negros, parejos en peso y tamaño.',                          'Martín Olivera'),
  (121, 15, 'steers',  75, 'Braford',          395, 'Río Negro',  -32.831, -57.062, 'Grecco',              'Novillos Braford de 2 años, mansos, para invernada corta.',                 'Federico Sosa'),
  (121, 16, 'heifers', 50, 'Aberdeen Angus',   330, 'Soriano',    -33.532, -57.418, 'Egaña',               'Vaquillonas Angus aptas para entore, con revisación ginecológica.',         'Federico Sosa'),
  (121, 17, 'cows',    35, 'Hereford',         450, 'Tacuarembó', -31.902, -55.471, 'Ansina',              'Vacas de invernada con buena dentición.',                                   'Federico Sosa'),
  (121, 18, 'calves', 160, 'Cruza británica',  175, 'Río Negro',  -32.712, -57.618, 'Young',               'Ternerada cruza británica de primavera, muy pareja.',                       'Federico Sosa'),
  (121, 19, 'steers', 100, 'Hereford',         410, 'Paysandú',   -32.151, -57.702, 'Queguay',             'Novillos Hereford de campo, de buena estructura.',                          'Martín Olivera'),
  (121, 20, 'heifers', 65, 'Hereford',         280, 'Salto',      -31.452, -57.602, 'Ruta 3',              'Vaquillonas Hereford de sobreaño, coloradas, muy parejas.',                 'Lucía Pereyra'),
  (121, 21, 'cows',    45, 'Braford',          470, 'Artigas',    -30.402, -56.471, 'Artigas',             'Vacas Braford de invernada, sanas y en buen estado.',                       'Lucía Pereyra'),
  (121, 22, 'steers',  60, 'Aberdeen Angus',   430, 'Soriano',    -33.531, -58.212, 'Dolores',             'Novillos Angus para terminar en corral.',                                   'Federico Sosa'),
  (121, 23, 'calves',  85, 'Braford',          170, 'Tacuarembó', -31.731, -55.982, 'Tacuarembó',          'Terneros Braford rústicos, ideales para el norte.',                         'Federico Sosa'),
  (121, 24, 'heifers', 40, 'Brangus',          315, 'Rivera',     -31.201, -55.752, 'Tranqueras',          'Vaquillonas Brangus de muy buena conformación.',                            'Federico Sosa'),
  (121, 25, 'cows',    30, 'Aberdeen Angus',   480, 'Río Negro',  -32.552, -57.402, 'Ruta 20',             'Vacas Angus preñadas con toro Angus.',                                      'Federico Sosa'),
  (121, 26, 'steers',  90, 'Hereford',         375, 'Paysandú',   -31.952, -57.402, 'Ruta 26',             'Novillos Hereford de sobreaño para recría.',                                'Martín Olivera'),
  (121, 27, 'calves', 110, 'Hereford',         200, 'Salto',      -31.432, -57.952, 'Colonia 18 de Julio', 'Terneros Hereford pesados, destete de otoño.',                              'Lucía Pereyra'),
  (121, 28, 'heifers', 55, 'Cruza británica',  300, 'Paysandú',   -32.332, -57.202, 'Guichón',             'Vaquillonas cruza británica para entorar en primavera.',                    'Martín Olivera'),

  -- 122 · Especial terneros · Río Negro (upcoming, no cover image: shows the branded default)
  (122,  1, 'calves',  30, 'Hereford',         165, 'Río Negro',  -32.704, -57.652, 'Young',               'Terneros Hereford de destete con buena sanidad.',                           'Federico Sosa'),
  (122,  2, 'calves',  25, 'Aberdeen Angus',   175, 'Río Negro',  -32.982, -58.051, 'Nuevo Berlín',        'Terneros Angus negros, mansos y parejos.',                                  'Federico Sosa'),
  (122,  3, 'heifers', 20, 'Hereford',         270, 'Soriano',    -33.692, -57.562, 'José Enrique Rodó',   'Vaquillonas de sobreaño en muy buen estado.',                               'Federico Sosa'),
  (122,  4, 'calves',  26, 'Cruza británica',  185, 'Paysandú',   -32.398, -56.912, 'Merinos',             'Terneros cruza británica, machos, listos para recría.',                     'Martín Olivera'),
  (122,  5, 'calves',  20, 'Hereford',         190, 'Río Negro',  -32.612, -57.512, 'Menafra',             'Terneros Hereford pesados, con doble vacuna.',                              'Federico Sosa'),
  (122,  6, 'heifers', 24, 'Braford',          285, 'Paysandú',   -32.098, -57.398, 'Lorenzo Geyres',      'Vaquillonas Braford, aptas para entorar este año.',                         'Martín Olivera'),
  (122,  7, 'calves',  28, 'Hereford',         175, 'Flores',     -33.962, -57.102, 'Ismael Cortinas',     'Terneros Hereford de campo, muy mansos.',                                   'Federico Sosa'),
  (122,  8, 'calves',  35, 'Cruza británica',  180, 'Soriano',    -33.502, -57.798, 'Palmitas',            'Terneros cruza británica de destete, sin descornar.',                       'Federico Sosa')
) as v (auction_number, number, category, head_count, breed, avg_weight_kg, department,
        latitude, longitude, location_label, description, agent_name)
join public.auctions a on a.number = v.auction_number
join public.agents g on g.name = v.agent_name;

-- Reference prices ------------------------------------------------------------------------------
-- Finished auctions only: US$ per kg of live weight, in line with recent replacement markets.

update public.lots l set reference_price_usd_per_kg = v.price
from (values
  (118, 1, 3.45), (118, 2, 3.50), (118, 3, 3.05), (118, 4, 2.82), (118, 5, 2.15),
  (118, 6, 3.38), (118, 7, 3.10), (118, 8, 1.95), (118, 9, 2.78), (118, 10, 3.30),
  (119, 1, 2.75), (119, 2, 3.42), (119, 3, 3.00), (119, 4, 2.05), (119, 5, 2.72),
  (119, 6, 3.36), (119, 7, 3.08), (119, 8, 2.60), (119, 9, 2.10)
) as v (auction_number, lot_number, price), public.auctions a
where a.number = v.auction_number and l.auction_id = a.id and l.number = v.lot_number;

-- Lot videos ------------------------------------------------------------------------------------
-- A few lots have a short clip (public/videos, credited in CREDITS.md). Posters follow the
-- naming convention <name>-poster.webp.

update public.lots l set video_url = v.url
from (values
  (121, 1, '/videos/herd-aerial.mp4'),
  (120, 3, '/videos/red-cattle.mp4'),
  (121, 7, '/videos/hereford-cow.mp4')
) as v (auction_number, lot_number, url), public.auctions a
where a.number = v.auction_number and l.auction_id = a.id and l.number = v.lot_number;

-- Lot photos ------------------------------------------------------------------------------------
-- Photos come from per-category pools (public/images/lots/<category>-NN.webp, see CREDITS.md).
-- Each lot gets 1 to 3 consecutive photos of its category, within the pool size, so no photo
-- repeats between lots of the same auction (checked below).
-- Two lots are left without photos on purpose, to show the branded fallback cover.

with pool (category, size) as (
  values ('calves', 12), ('steers', 11), ('heifers', 10), ('cows', 12)
),
lot_counts as (
  select l.id, l.auction_id, l.category::text as category, l.number, a.number as auction_number,
    -- Extra photos wanted beyond the first one.
    case when l.number % 5 = 0 then 2 when l.number % 3 = 0 then 1 else 0 end as wanted_extra,
    count(*) over (partition by l.auction_id, l.category) as lots_in_category
  from public.lots l
  join public.auctions a on a.id = l.auction_id
  where (a.number, l.number) not in ((119, 4), (122, 8))
),
budgeted as (
  -- Every lot gets one photo; extras are handed out in lot order while the pool lasts.
  select lc.*, p.size,
    1 + greatest(0, least(lc.wanted_extra,
      p.size - lc.lots_in_category
        - (sum(lc.wanted_extra) over (partition by lc.auction_id, lc.category order by lc.number)
          - lc.wanted_extra)
    )) as photos
  from lot_counts lc
  join pool p on p.category = lc.category
),
allocated as (
  select *, sum(photos) over (partition by auction_id, category order by number) - photos as start
  from budgeted
)
insert into public.lot_photos (lot_id, url, position)
select al.id,
  format('/images/lots/%s-%s.webp', al.category,
    lpad(((al.start + k + al.auction_number * 5) % al.size + 1)::text, 2, '0')),
  k
from allocated al
cross join lateral generate_series(0, al.photos - 1) as k;

-- Fail the whole seed if a photo repeats between lots of the same auction.
do $$
begin
  if exists (
    select 1 from public.lot_photos ph join public.lots l on l.id = ph.lot_id
    group by l.auction_id, ph.url having count(*) > 1
  ) then
    raise exception 'A lot photo repeats within an auction: enlarge the pool or use fewer photos';
  end if;
end $$;

commit;

-- Quick sanity check printed after the seed runs.
select
  (select count(*) from public.auctions) as auctions,
  (select count(*) from public.lots) as lots,
  (select sum(head_count) from public.lots) as heads,
  (select count(*) from public.lot_photos) as photos,
  (select count(*) from public.lots where video_url is not null) as videos,
  (select count(*) from public.lots where reference_price_usd_per_kg is not null) as priced,
  (select lot_count from public.auction_summaries s join public.auctions a on a.id = s.auction_id
    where a.number = 121) as lots_in_121;
