@AGENTS.md

# Tranquera de Paysandú — portfolio demo

Public, bilingual (es/en) website for a **fictional** Uruguayan rural-business company based in
Paysandú whose core business is cattle auctions (screen auctions and saleyard fairs). It is a
portfolio piece: it must look professional, feel useful and stay well organized. Few screens,
fully finished, beat many half-done ones.

Out of scope for this version: admin panel, login, pre-bids.

All brands, texts, people and images are fictional. Never copy content from real auction houses.

## Stack

- Next.js 16 (App Router, Turbopack, `cacheComponents` + `partialPrefetching`) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (tokens in `src/app/globals.css`, no `tailwind.config`)
- next-intl 4 with localized pathnames; locale read via `next/root-params`
- Supabase Postgres (free cloud project, CLI linked) — schema via migrations, data via seed
- Leaflet + OpenStreetMap (client-only)
- Deploy on Vercel (ISR + a cron keep-alive for the free Supabase project)

Next 16 differs from older versions (`proxy.ts` instead of `middleware.ts`, Cache Components,
`next/root-params`). Read `node_modules/next/dist/docs/` before using an unfamiliar API.

## Commands

```bash
npm run dev            # dev server
npm run build          # production build (must pass before closing a phase)
npm run check          # typecheck + lint + i18n key parity
npm run check:i18n     # es/en messages: same keys, no empty values, same ICU args
npm run format         # prettier (with tailwind class sorting)
npm run db:push        # apply migrations to the linked Supabase project
npm run db:seed        # reset demo data (idempotent)
npm run db:types       # regenerate src/lib/supabase/database.types.ts after schema changes
```

The `db:*` scripts go through `scripts/supabase.mjs`, which loads `.env.local` and runs the
Supabase CLI without a shell. Never print or log values from `.env.local`.

## Structure

```
messages/{es,en}.json        UI strings. es is the reference locale.
scripts/                     repo tooling (check-i18n, supabase CLI wrapper, placeholder generator)
supabase/migrations/         SQL migrations (schema, RLS, views)
supabase/seed.sql            sample data (dates relative to now())
public/images/               all images (placeholders, covers, agents). No Supabase Storage.
src/
  proxy.ts                   next-intl locale routing
  i18n/                      routing (locales + pathnames), navigation, request config, formats
  app/[locale]/              routes; folder names are the INTERNAL English paths
  components/ui/             generic building blocks (Button, Badge, Card, CoverImage...)
  components/<domain>/       auctions/, lots/, layout/, contact/ ...
  lib/data/                  server-only data access (the only place that queries Supabase)
  lib/supabase/              client + generated database types (do not edit the types by hand)
  lib/domain.ts              enums, departments and type guards shared by UI and data
  lib/                       helpers (format, whatsapp, etc.)
```

## Conventions

- Code, identifiers, DB tables/columns, file names and commit messages in **English**.
- Conventional commits (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `docs:`), small and focused.
- Server Components by default. `"use client"` only for interactivity (switcher, countdown,
  filters UI, map, gallery, share). Keep client components small and leaf-level.
- Pages never query Supabase directly: they call functions in `src/lib/data/`.
- Filters live in the URL search params (shareable, server-rendered, back button works).
- Reuse components: auction/lot cards, status badges, filters and buttons must look identical
  everywhere. Extend an existing component before creating a similar one.
- Use semantic color tokens (`bg-primary`, `text-ink-muted`, `border-line`...), never raw hex.
- Mobile-first: design for 375px, then add `sm:`/`lg:` enhancements.
- Missing image → `CoverImage` falls back to the branded default cover.

## Components

Reuse before creating. Current building blocks:

- `ui/`: `buttonStyles()` (one look for buttons, links and anchors: primary, secondary, ghost,
  accent, whatsapp, live), `Badge`, `DateBlock`, `SectionHeading`, `Stat` (inside a `<dl>`),
  `EmptyState`, `FilterChips` (URL-driven link chips), `CoverImage` + `BrandCover` (fallback).
- `brand/`: `Logo`, `LogoMark`.
- `auctions/`: `AuctionCard`, `StatusBadge` (+ `LiveDot`), `AuctionTypeBadge`.
- `lots/`: `LotCard` (horizontal on phones), `CategoryBadge`, `LotCatalog`, `LotGallery`,
  `AgentCard`, `ShareButton`, `LotNavigation`.
- `map/LocationMap`: Leaflet + OSM, lazy; `approximate` draws the area circle (lots).
- `home/`: `HomeHero` (featured live/next auction), `Countdown` (client, renders after mount).
- `services/`: `ServiceGrid`, `ServiceIcon` (services config in `src/lib/services.ts`).
- `contact/`: `ContactSection` (home + contact page), `ContactForm` → server action
  `src/app/actions/contact.ts` (validates like the DB constraints, honeypot field).
- `live/LiveLotTracker`: simulated lot in the ring (`lotIndexAt` in `src/lib/live.ts`).
- `ui/FilterSheet`: phone-only bottom sheet (native `<dialog>`) behind a fixed "Filter" button.
- `layout/`: `SiteHeader`, `SiteFooter`, `MobileMenu`, `LanguageSwitcher`, `ContactList`,
  `WhatsAppButton` / `WhatsAppFab`.

Rules:

- Anything that depends on the current time renders after mount on the client (countdown,
  lot in the ring) or is computed inside the cached data read (`startsToday`, `status`).

- Cards are fully clickable through a stretched title link (`after:absolute after:inset-0`);
  secondary actions inside a card need `relative z-10`.
- Images go through `CoverImage` with a real `sizes`; only above-the-fold images use `eager`.
- Icons come from `lucide-react`, always `aria-hidden` next to visible or sr-only text.
- **Every WhatsApp link starts with the demo prefix** (`whatsapp.prefix` in messages). Use
  `WhatsAppButton` or `whatsappUrl()` with `${t("whatsapp.prefix")} …`, never a bare wa.me link.
- Company contact data lives in `src/lib/company.ts`; all agents share the demo WhatsApp number.
- Phone catalog pages show `CATALOG_PAGE_SIZE` lots plus a "show more" link (`show` param);
  larger screens show every lot. Floating buttons sit at the bottom corners: keep the footer's
  extra bottom padding on phones.
- Share links and WhatsApp messages use absolute URLs from `absoluteUrl()` (`src/lib/site.ts`),
  so `NEXT_PUBLIC_SITE_URL` must be set per environment.
- Maps use the public OpenStreetMap tiles with attribution, lazy-loaded; fine for a demo, switch
  to a tile provider with a key if traffic grows.
- Never import plain values (constants, helpers) from a `"use client"` module into a server
  component: they arrive as client references. Put shared values in `src/lib/` (e.g. `live.ts`).
- In-page WhatsApp buttons carry `data-whatsapp-cta` (added by `WhatsAppButton`); the floating
  button hides while one is visible. Prefilled messages go through `demoMessage()`.
- Anything `position: fixed` rendered inside the header must be portaled to `<body>` (the
  header's backdrop-filter becomes its containing block).

## Routes and URL state

| Internal path                      | es                        | en                        |
| ---------------------------------- | ------------------------- | ------------------------- |
| `/auctions`                        | `/es/remates`             | `/en/auctions`            |
| `/auctions/[auction]`              | `/es/remates/121`         | `/en/auctions/121`        |
| `/auctions/[auction]/lots/[lot]`   | `/es/remates/121/lotes/3` | `/en/auctions/121/lots/3` |
| `/live`                            | `/es/en-vivo`             | `/en/live`                |
| `/services`, `/services/[service]` | `/es/servicios`           | `/en/services`            |
| `/contact`                         | `/es/contacto`            | `/en/contact`             |

- Query params are language-neutral (same keys and values in both locales) so the switcher can
  copy them: auction list `view=finished`, `type=screen|fair`; catalog `category`,
  `department`, `weight=under200|200to300|300to400|over400`, `show` (phone paging). Parsing and facet counts live in
  `src/lib/catalog-filters.ts`; defaults stay out of the URL.
- **App Shell rule (Partial Prefetching):** any `params`/`searchParams` read _and any cached
  data read_ (`"use cache"` under the `[locale]` root param counts as URL data) must sit inside
  `<Suspense>` with a skeleton from `components/ui/Skeleton.tsx` that mirrors the real layout.
  Pages stay sync; data lives in async child components. Check `next dev` for the
  "URL data outside of Suspense" insight after touching a page. Never use `instant = false`.
- Unknown auction numbers render the localized not-found page with `noindex` but HTTP 200: with
  partial prerendering the response streams before `notFound()` runs (documented Next behavior).

## Media

- All images and videos live in `public/` and every third-party file is listed in
  `CREDITS.md` (source, author, license, processing).
- Videos: muted MP4 + `-poster.webp`, made with `scripts/optimize-video.mjs`; play them with
  `LoopVideo` (lazy, pauses off-screen, no autoplay with reduced motion). `posterFor()` and
  `LIVE_VIDEO` are in `src/lib/media.ts`.
- After reseeding, `rm -rf .next` before a local build: the build reuses cached data otherwise.

## Language rules

- Routes: `/es/...` and `/en/...`, Spanish is the default. Public paths are translated
  (`/es/remates` ↔ `/en/auctions`); add every new route to `pathnames` in `src/i18n/routing.ts`
  and link with `Link` from `@/i18n/navigation` using the internal path.
- The language switcher keeps the current page (same route + params).
- **Only the interface is translated**: menus, buttons, labels, headings, metadata and list
  values (auction type, status, lot category). **Sample content stays in Spanish** (auction
  venue, lot descriptions, breeds, agent names).
- Enum values are stored as English keys in the DB (`screen`, `fair`, `upcoming`, `steers`...)
  and displayed through messages (`t("lotCategory.steers")`). Never display a raw enum.
- **No hardcoded UI text.** ESLint enforces it (`react/jsx-no-literals` + a rule for `alt`,
  `title`, `placeholder`, `aria-label`). Only symbols like `·` or `US$` are allowed inline.
- Every key added to `es.json` must exist in `en.json` (`npm run check:i18n`).
- Dates and numbers are formatted with next-intl (`useFormatter`/`getFormatter`) using the named
  formats in `src/i18n/formats.ts`. Time zone is fixed to `America/Montevideo`.
- Prices are always shown in US$.

## Data

Tables: `agents`, `auctions`, `lots`, `lot_photos`, `contact_messages`, plus the view
`auction_summaries` (lot and head counts per auction). Public roles get least privilege on top of
RLS: `SELECT` on the catalog, column-level `INSERT` on `contact_messages` (no read). New tables
start closed: grant explicitly in their migration. Services are not in the DB: they live in code
(`src/lib/services.ts`) with their texts in messages.

- Auctions and lots are addressed by **number** in URLs (`/es/remates/121/lotes/3`), never by id:
  numbers are stable across seed resets.
- `status` shown to visitors comes from `effectiveStatus()` (`src/lib/data/status.ts`): a stored
  "finished" wins; otherwise the start time decides (live for 5 h after start), so an
  unattended demo never shows a past auction as upcoming.
- Agent `whatsapp` is digits only in international format (`598…`), ready for `wa.me` links.

Sample data is concentrated on the Uruguay River coast (Paysandú, Salto, Río Negro, Soriano,
Tacuarembó) with a few lots from other departments. `supabase/seed.sql` is idempotent (truncate +
reload in one transaction, `contact_messages` untouched) and its dates are relative to `now()`.

Credentials live in `.env.local` (never committed); `.env.example` and the README document them.

### Caching and resilience

Every Supabase read in `src/lib/data/` is a `"use cache"` function with `cacheLife("catalog")`
(defined in `next.config.ts`: revalidate 5 min, expire 30 days) and the `auctions` tag. Data
functions **throw** on query errors instead of returning empty data, so a failure is never cached
and the last good copy keeps being served while Supabase is paused or unreachable. Listings are
derived in memory from one cached read (the dataset is small); keep it that way unless it grows.

## Definition of done (every phase)

1. `npm run build` and `npm run check` pass.
2. No untranslated text: lint clean, i18n keys in sync, pages reviewed in both locales.
3. Reviewed at 375px width (and desktop) — no horizontal scroll, readable hierarchy.
4. Small commits with clear messages.

## Backlog for Phase 7

- Dynamic Open Graph images in both locales: per lot (photo, heads, category, average weight)
  and per auction (date, type, number of lots).
- Keep-alive endpoint + Vercel cron for the free Supabase project, which also rotates the demo
  dates weekly so there are always upcoming auctions. Pages must keep serving if the DB is down.
