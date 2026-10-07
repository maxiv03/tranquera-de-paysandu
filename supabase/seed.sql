-- Demo data for Tranquera de Paysandú. All names and lots are fictional; every agent shares the
-- team demo WhatsApp number.
--
-- Safe to run again at any time: it empties the catalog tables and reloads them in a single
-- transaction (npm run db:seed). contact_messages is never touched.
-- Dates are relative to now(), so after a reset the demo has finished, live and upcoming auctions.

begin;

truncate table public.lot_photos, public.lots, public.auctions, public.agents
  restart identity cascade;

-- Agents ----------------------------------------------------------------------------------------

insert into public.agents (name, photo_url, phone, whatsapp) values
  ('Martín Olivera',  '/images/agents/martin-olivera.svg', '+598 99 338 710', '59899338710'),
  ('Lucía Pereyra',   '/images/agents/lucia-pereyra.svg',  '+598 99 338 710', '59899338710'),
  ('Federico Sosa',   '/images/agents/federico-sosa.svg',  '+598 99 338 710', '59899338710');

-- Auctions --------------------------------------------------------------------------------------
-- local(days, time): a day relative to today at a given local time in Montevideo.

create function pg_temp.local(days integer, at_time time) returns timestamptz
language sql stable as $$
  select ((now() at time zone 'America/Montevideo')::date + days + at_time)
    at time zone 'America/Montevideo'
$$;

insert into public.auctions
  (number, type, starts_at, venue, department, status, image_url, notes)
values
  (118, 'fair', pg_temp.local(-38, '09:30'),
   'Local de Ferias Tranquera, Ruta 3 km 372', 'Paysandú', 'finished',
   '/images/auctions/fair-1.svg',
   'Feria mensual de reposición. Plazo: contado o 30 días. Comisión 3 % + IVA.'),

  (119, 'screen', pg_temp.local(-10, '14:00'),
   'Salón Los Ceibos, Salto', 'Salto', 'finished',
   '/images/auctions/screen-2.svg',
   'Remate por pantalla del norte. Plazo: 60 días con garantía bancaria.'),

  (120, 'screen', now() - interval '25 minutes',
   'Estudio Tranquera, Paysandú', 'Paysandú', 'live',
   '/images/auctions/screen-1.svg',
   'Transmisión en vivo. Ofertas telefónicas a través de los agentes.'),

  (121, 'screen', pg_temp.local(6, '10:00'),
   'Estudio Tranquera, Paysandú', 'Paysandú', 'upcoming',
   '/images/auctions/screen-2.svg',
   'Gran remate de primavera. Plazo: 30, 60 o 90 días. Fletes coordinados por la empresa.'),

  (122, 'fair', pg_temp.local(20, '09:30'),
   'Local de Ferias de Young', 'Río Negro', 'upcoming',
   null,
   'Feria de reposición del sur del litoral. Plazo: contado o 30 días.');

-- Lots ------------------------------------------------------------------------------------------

insert into public.lots
  (auction_id, number, category, head_count, breed, avg_weight_kg, department,
   latitude, longitude, location_label, description, agent_id)
select a.id, v.number, v.category::public.lot_category, v.head_count, v.breed, v.avg_weight_kg,
  v.department, v.latitude, v.longitude, v.location_label, v.description, g.id
from (values
  -- 118 · Feria · Paysandú (finished)
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

  -- 119 · Pantalla · Salto (finished)
  (119,  1, 'steers',  85, 'Hereford',         410, 'Salto',      -31.102, -57.031, 'Colonia Lavalleja',   'Novillos Hereford de 2 años, terminados en campo mejorado.',                'Lucía Pereyra'),
  (119,  2, 'calves', 120, 'Cruza británica',  175, 'Salto',      -30.795, -57.762, 'Belén',               'Ternerada de destete, machos y hembras apartados por sexo.',                'Lucía Pereyra'),
  (119,  3, 'heifers', 60, 'Hereford',         310, 'Salto',      -31.288, -57.121, 'Laureles',            'Vaquillonas preñadas de 3 meses con toro Hereford.',                        'Lucía Pereyra'),
  (119,  4, 'cows',    45, 'Aberdeen Angus',   470, 'Salto',      -30.968, -57.521, 'Sarandí de Arapey',   'Vacas de cría con ternero al pie, en buen estado.',                         'Lucía Pereyra'),
  (119,  5, 'steers',  70, 'Braford',          380, 'Artigas',    -30.452, -56.948, 'Sequeira',            'Novillos Braford adaptados a los campos del norte.',                        'Lucía Pereyra'),
  (119,  6, 'calves',  95, 'Hereford',         190, 'Paysandú',   -31.871, -56.301, 'Tambores',            'Terneros Hereford pesados, desparasitados y vacunados.',                    'Martín Olivera'),
  (119,  7, 'heifers', 50, 'Brangus',          280, 'Tacuarembó', -31.721, -55.948, 'Tacuarembó',          'Vaquillonas Brangus de muy buena genética.',                                'Federico Sosa'),
  (119,  8, 'steers',  65, 'Aberdeen Angus',   455, 'Paysandú',   -32.351, -57.152, 'Guichón',             'Novillos Angus listos para embarque a frigorífico.',                        'Martín Olivera'),
  (119,  9, 'cows',    40, 'Hereford',         495, 'Río Negro',  -32.951, -58.033, 'Nuevo Berlín',        'Vacas gordas, aptas para cuota de exportación.',                            'Federico Sosa'),

  -- 120 · Pantalla · Paysandú (live)
  (120,  1, 'steers', 110, 'Hereford',         430, 'Paysandú',   -32.402, -56.904, 'Merinos',             'Novillos Hereford de exportación, de peso muy parejo.',                     'Martín Olivera'),
  (120,  2, 'calves', 150, 'Cruza británica',  185, 'Río Negro',  -32.421, -57.392, 'Algorta',             'Ternerada de primavera, mansa y bien criada.',                              'Federico Sosa'),
  (120,  3, 'heifers', 70, 'Aberdeen Angus',   300, 'Soriano',    -33.871, -57.372, 'Cardona',             'Vaquillonas Angus de sobreaño, coloradas y negras.',                        'Federico Sosa'),
  (120,  4, 'cows',    55, 'Hereford',         440, 'Soriano',    -33.512, -57.812, 'Palmitas',            'Vacas de invernada para recuperar en verdeo.',                              'Federico Sosa'),
  (120,  5, 'steers',  80, 'Braford',          370, 'Salto',      -31.348, -57.452, 'Ruta 31, Salto',      'Novillos Braford de 2 años con buena terminación.',                         'Lucía Pereyra'),
  (120,  6, 'calves', 100, 'Hereford',         200, 'Tacuarembó', -32.612, -55.831, 'San Gregorio de Polanco', 'Terneros Hereford de campo, destete precoz.',                          'Federico Sosa'),
  (120,  7, 'heifers', 45, 'Hereford',         345, 'Durazno',    -33.343, -55.632, 'Sarandí del Yí',      'Vaquillonas para entore, con diagnóstico de aptitud reproductiva.',         'Federico Sosa'),
  (120,  8, 'steers',  60, 'Aberdeen Angus',   480, 'Paysandú',   -31.942, -57.893, 'Quebracho',           'Novillos pesados, terminados a grano en los últimos 60 días.',              'Martín Olivera'),

  -- 121 · Pantalla · Paysandú (upcoming, featured)
  (121,  1, 'steers', 120, 'Hereford',         420, 'Paysandú',   -32.364, -57.182, 'Guichón',             'Novillos Hereford de 2 a 3 años, muy parejos, para embarque.',              'Martín Olivera'),
  (121,  2, 'steers',  90, 'Aberdeen Angus',   400, 'Río Negro',  -32.662, -58.121, 'San Javier',          'Novillos Angus negros criados en campo mejorado.',                          'Federico Sosa'),
  (121,  3, 'calves', 140, 'Hereford',         180, 'Paysandú',   -32.383, -57.968, 'Porvenir',            'Terneros Hereford machos, destete de otoño, descornados.',                  'Martín Olivera'),
  (121,  4, 'calves', 110, 'Cruza británica',  170, 'Tacuarembó', -32.151, -56.121, 'Curtina',             'Terneros cruza británica, vacunados contra aftosa y clostridiosis.',        'Federico Sosa'),
  (121,  5, 'heifers', 75, 'Hereford',         295, 'Salto',      -31.078, -57.842, 'Constitución',        'Vaquillonas Hereford de sobreaño, aptas para entorar.',                     'Lucía Pereyra'),
  (121,  6, 'heifers', 60, 'Braford',          320, 'Salto',      -31.302, -57.301, 'Ruta 4, Salto',       'Vaquillonas Braford de buena estructura y temperamento manso.',             'Lucía Pereyra'),
  (121,  7, 'cows',    50, 'Hereford',         460, 'Soriano',    -33.253, -58.004, 'Mercedes',            'Vacas de invernada de buen frame, sanas.',                                  'Federico Sosa'),
  (121,  8, 'cows',    40, 'Aberdeen Angus',   485, 'Paysandú',   -31.662, -57.902, 'Chapicuy',            'Vacas preñadas de 5 meses con toro Angus.',                                 'Martín Olivera'),
  (121,  9, 'steers',  85, 'Braford',          365, 'Tacuarembó', -32.812, -56.512, 'Paso de los Toros',   'Novillos Braford de sobreaño, para recría o invernada.',                    'Federico Sosa'),
  (121, 10, 'calves', 130, 'Aberdeen Angus',   195, 'Río Negro',  -32.688, -57.632, 'Young',               'Terneros Angus pesados y parejos.',                                         'Federico Sosa'),
  (121, 11, 'heifers', 55, 'Brangus',          305, 'Cerro Largo',-32.512, -54.521, 'Fraile Muerto',       'Vaquillonas Brangus con buena adaptación a los campos del este.',           'Federico Sosa'),
  (121, 12, 'steers',  70, 'Hereford',         445, 'Florida',    -33.731, -56.331, 'Sarandí Grande',      'Novillos gordos, listos para frigorífico.',                                 'Martín Olivera'),

  -- 122 · Feria · Río Negro (upcoming, no cover image: shows the branded default)
  (122,  1, 'calves',  30, 'Hereford',         165, 'Río Negro',  -32.704, -57.652, 'Young',               'Terneros Hereford de destete con buena sanidad.',                           'Federico Sosa'),
  (122,  2, 'calves',  25, 'Aberdeen Angus',   175, 'Río Negro',  -32.982, -58.051, 'Nuevo Berlín',        'Terneros Angus negros, mansos y parejos.',                                  'Federico Sosa'),
  (122,  3, 'heifers', 20, 'Hereford',         270, 'Soriano',    -33.692, -57.562, 'José Enrique Rodó',   'Vaquillonas de sobreaño en muy buen estado.',                               'Federico Sosa'),
  (122,  4, 'steers',  22, 'Cruza británica',  360, 'Paysandú',   -32.398, -56.912, 'Merinos',             'Novillos cruza británica para invernada corta.',                            'Martín Olivera'),
  (122,  5, 'cows',    18, 'Hereford',         430, 'Río Negro',  -32.612, -57.512, 'Menafra',             'Vacas de invernada, vacías, con buena dentición.',                          'Federico Sosa'),
  (122,  6, 'heifers', 24, 'Braford',          285, 'Paysandú',   -32.098, -57.398, 'Lorenzo Geyres',      'Vaquillonas Braford, aptas para entorar este año.',                         'Martín Olivera'),
  (122,  7, 'steers',  28, 'Hereford',         375, 'Flores',     -33.962, -57.102, 'Ismael Cortinas',     'Novillos Hereford de 2 años, criados a campo.',                             'Federico Sosa'),
  (122,  8, 'calves',  35, 'Cruza británica',  180, 'Soriano',    -33.502, -57.798, 'Palmitas',            'Terneros cruza británica de destete, sin descornar.',                       'Federico Sosa')
) as v (auction_number, number, category, head_count, breed, avg_weight_kg, department,
        latitude, longitude, location_label, description, agent_name)
join public.auctions a on a.number = v.auction_number
join public.agents g on g.name = v.agent_name;

-- Lot photos ------------------------------------------------------------------------------------
-- 1 to 3 placeholders per lot, rotating through the category's images.
-- Two lots are left without photos on purpose, to show the branded fallback cover.

insert into public.lot_photos (lot_id, url, position)
select l.id,
  format('/images/lots/%s-%s.svg', l.category, (l.number + k) % 3 + 1),
  k
from public.lots l
join public.auctions a on a.id = l.auction_id
cross join lateral generate_series(0, l.number % 3) as k
where (a.number, l.number) not in ((119, 4), (122, 8));

commit;

-- Quick sanity check printed after the seed runs.
select
  (select count(*) from public.auctions) as auctions,
  (select count(*) from public.lots) as lots,
  (select sum(head_count) from public.lots) as heads,
  (select count(*) from public.lot_photos) as photos,
  (select count(*) from public.agents) as agents;
