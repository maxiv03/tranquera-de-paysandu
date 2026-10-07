# Development process

How **Tranquera de Paysandú** was built: the workflow, what each phase delivered, the product
decisions that came out of reviews, and the problems found along the way. For the resulting
system, see [ARCHITECTURE.md](./ARCHITECTURE.md).

- [Workflow](#workflow)
- [Phases](#phases)
- [Decisions from screenshot reviews](#decisions-from-screenshot-reviews)
- [Problems and fixes](#problems-and-fixes)

## Workflow

The site was built with **AI-assisted development using Claude Code**, with the team acting as
product owner and reviewer. Claude Code wrote the code, migrations, seed and docs; the team set
the brief, approved the plan, answered design questions, reviewed every phase from screenshots
and decided on the changes. The whole history is in about 70 small conventional commits
(`feat:`, `fix:`, `docs:`...) over two days.

**1. Brief.** The brief described a public, bilingual demo for a fictional auction company,
inspired by Uruguayan cattle auction websites but with no copied content. It fixed the stack,
the pages, the data model and the out-of-scope items (admin, login, pre-bids).

**2. Plan before code.** Before writing any code, Claude Code proposed a phased plan:

- architecture decisions;
- the database schema;
- eight phases (0–7) with their deliverables;
- open questions.

No code was written until the team approved it. The answers changed the plan before work
started:

- the brand name;
- a free **Supabase cloud** project instead of local Supabase, to avoid installing Docker, with a
  keep-alive added to the deploy phase;
- translated URLs (`/es/remates` ↔ `/en/auctions`);
- services kept in code.

**3. `CLAUDE.md` as the source of conventions.** Written in Phase 0 and updated whenever a rule
emerged, it holds:

- the stack and commands;
- the folder structure and the component inventory;
- the route table and URL-state params;
- the language rules and data rules;
- the caching rules and the definition of done.

Rules learned the hard way were added there so they would not be broken again, for example "never
import plain values from a `"use client"` module into a server component" or "cached reads go
inside `<Suspense>`". Each session reads it first, so new work follows the same patterns.

**4. One phase at a time.** Each phase ended with a short report and a set of screenshots
(desktop and 375 px) saved to a git-ignored `screenshots/` folder. The team reviewed them and
replied with adjustments, which were applied before the next phase began.

**5. Definition of done**, checked at the end of every phase:

1. `tsc` (strict), ESLint (including the untranslated-text rules) and `npm run check:i18n` pass.
2. `npm run build` passes.
3. Pages reviewed in both locales, at 375 px and desktop, with no horizontal scroll.
4. Small commits with clear messages.

Screenshots and Lighthouse runs were scripted with puppeteer-core and Lighthouse from a scratch
folder. They are not project dependencies.

**Working with a shared production database.** Once the site was live, the team set an order for
any schema change: apply the migration first, with optional columns so the published site keeps
working, then run the seed, and only then push the code to `main`. The English content columns
went in that way.

## Phases

| Phase | Scope                   | What was built                                                                                                                                                                                                                                                                                                                                |
| ----- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Project base            | Next.js 16 + TypeScript + Tailwind v4 scaffold, Prettier, ESLint rules against hardcoded text, `check:i18n`, design tokens, fonts and brand icon, next-intl with localized pathnames, `CLAUDE.md`, README and `.env.example`.                                                                                                                 |
| 1     | Data                    | Supabase CLI wrapper reading `.env.local`, schema migration (enums, department domain, constraints), RLS and the `auction_summaries` view, least-privilege grants, idempotent seed with relative dates, generated types, cached `server-only` data layer, and `.env.local` setup docs for teammates.                                          |
| 2     | Layout and components   | Base UI (buttons, badges, date block, section heading, stats, empty state, cover image with branded fallback), auction and lot cards with status/type/category badges, header with mobile menu and language switcher, footer, WhatsApp button with the demo prefix. Seed switched to the demo WhatsApp number; external stream links dropped. |
| 3     | Schedule, auction, live | Credited Pexels videos and a lazy looping player, breadcrumbs, tabs and skeletons, the auction schedule (upcoming/finished, type filter), the auction page with a lot catalog filtered by category, department and weight, and the site's own live page.                                                                                      |
| 4     | Lot page                | Phone catalog paging ("show more") and bottom filter sheet (from the Phase 3 review), lazy Leaflet map with approximate location, gallery with video, agent card with call and prefilled WhatsApp, share button, previous/next navigation.                                                                                                    |
| 5     | Home                    | Real Pexels photos replacing placeholders, auction titles and reference prices in the seed, "Sold" badge, Today date block, simulated "in the ring now" tracker (all from the Phase 4 review). Then services config and grid, contact form with Server Action and office map, home hero with featured auction and countdown.                  |
| 6     | Services and contact    | Suspense streaming fix for the App Shell (see problems), localized service slugs, services index and one page per service (process, next dates of that type, contact), contact page with opening hours.                                                                                                                                       |
| 7     | Polish and deploy       | Always-live demo auction and weekly date rotation, daily cron (keep-alive + rotation) protected by `CRON_SECRET`, translated error boundary, canonical/hreflang, sitemap and robots, dynamic Open Graph images per auction and lot, accessibility and performance fixes for Lighthouse, Vercel deploy and deploy guide.                       |
| —     | Final adjustments       | Optional English columns for sample content with Spanish fallback, English price format, audit confirming the secret key stays on the server. Then this documentation.                                                                                                                                                                        |

## Decisions from screenshot reviews

These changes did not come from the original brief. They came from looking at the result.

- **Phone catalog with "show more" and a filter sheet.** A 28-lot catalog was a very long scroll on
  a phone, with the filters at the top. Phones now show 12 lots and a "Ver más" link that keeps
  the active filters in the URL (`show` param), plus a fixed "Filtrar" button that opens the
  filters in a bottom sheet (native `<dialog>`). Larger screens still show every lot.
- **Floating WhatsApp button steps aside.** On lot and live pages the floating button duplicated
  the agent's or the auction's own WhatsApp button. Any in-page WhatsApp button now carries
  `data-whatsapp-cta`, and the floating one hides while one of them is on screen
  (`IntersectionObserver` plus a `MutationObserver` for streamed sections). Phones also get extra
  bottom padding so floating buttons never cover the last content.
- **Demo prefix on WhatsApp messages.** Every prefilled message starts with
  `[Demo] Tranquera de Paysandú` on its own line, the same in both languages, so a message sent
  from the demo can't be mistaken for a real inquiry.
- **An in-site live page instead of an external stream link.** The page shows a looping video, the
  live indicator, the lots, and later the simulated "in the ring now" lot, highlighted in the grid.
- **Real photos, with no repeats within an auction.** Placeholder SVGs were replaced by credited
  Pexels photos. The seed allocates them from per-category pools and raises an error if a photo
  repeats inside an auction. The default cover for missing images was lightened.
- **Richer sample data.** Every auction got a name ("Gran remate de primavera"). One auction got
  28 lots so the phone paging is visible. Finished auctions show a "Sold" badge and a reference
  price in US$/kg.
- **Small UI details.**
  - a "HOY" (today) label in the date block;
  - a 350 px tall lot map on desktop;
  - single-line buttons;
  - a dedicated badge tone for "Sold".
- **Always one live auction.** A visitor arriving at any hour should see the live experience
  working. Solved with a clock-derived demo auction rather than the daily cron (see
  [ARCHITECTURE.md → Demo mechanics](./ARCHITECTURE.md#demo-mechanics)).
- **Translated service URLs** (`/es/servicios/remates-por-pantalla` ↔
  `/en/services/screen-auctions`), with the language switcher landing on the equivalent page.
- **Translated sample content.** After the deploy, the English version still showed Spanish auction
  names and lot descriptions. Optional `*_en` columns with a Spanish fallback fixed it, and English
  prices switched to `US$3.45/kg`.

## Problems and fixes

| Problem                                                                                                | Cause                                                                                                                                                                                                                                                         | Fix                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Only `/` was redirected to a locale; other paths skipped locale routing.                               | The proxy matcher was written as `".*\..*"` in a TypeScript string, where `\.` is just `.`, so the exclusion matched almost every path.                                                                                                                       | Escaped it as `\\.` (`src/proxy.ts`). Unknown locales now return 404.                                                                                                                      |
| `next dev` reported **"URL data outside of Suspense"** on the home, auction, lot and live pages.       | With Partial Prefetching, any `"use cache"` read under the `[locale]` root param counts as URL data, because the locale is part of its cache key. Test pages showed that reading the root param alone did not trigger it; even a trivial cached function did. | Streaming: pages stay synchronous, and data sections are async children inside `<Suspense>` with skeletons that mirror the cards. No `instant = false`. The rule was added to `CLAUDE.md`. |
| The public roles could `INSERT`, `UPDATE`, `DELETE` and `TRUNCATE` every table, held back only by RLS. | Supabase's default privileges grant `anon`/`authenticated` all table privileges.                                                                                                                                                                              | A least-privilege migration: revoke all, grant `SELECT` on the catalog and column-level `INSERT` on `contact_messages`, and close default privileges for future tables.                    |
| The Supabase CLI failed with `password authentication failed` although the password was right.         | The database password contained `$` and `#`; unquoted in `.env.local`, the env parser dropped part of it.                                                                                                                                                     | Single quotes around the value, documented in [SETUP.md](./SETUP.md).                                                                                                                      |
| The first Vercel deploy returned 404 on every route.                                                   | The project was created from the CLI, which picked the "Other" framework preset and served only `public/`.                                                                                                                                                    | `"framework": "nextjs"` in `vercel.json`, so the preset no longer depends on how the project was created.                                                                                  |
| `vercel link` silently re-ignored `.env.example`.                                                      | It appended `.env*` to `.gitignore` after the `!.env.example` exception.                                                                                                                                                                                      | Removed the added line; `.vercel` is ignored explicitly.                                                                                                                                   |
| `npx supabase login` failed when run from a non-interactive terminal.                                  | It needs an interactive TTY.                                                                                                                                                                                                                                  | A personal access token (`SUPABASE_ACCESS_TOKEN`) in `.env.local`, read by the CLI wrapper.                                                                                                |
| SQL passed to the Supabase CLI arrived split into pieces on Windows.                                   | `npx` with `shell: true` re-tokenized the arguments.                                                                                                                                                                                                          | `scripts/supabase.mjs` resolves the CLI's JS entry point and runs it with `node`, without a shell.                                                                                         |
| Constants used by the live page arrived on the server as opaque client references.                     | They were exported from a `"use client"` module.                                                                                                                                                                                                              | Moved shared values to `src/lib/live.ts`; added the rule to `CLAUDE.md`.                                                                                                                   |
| The mobile menu panel was clipped to the header's height.                                              | The header's `backdrop-filter` makes it the containing block for `position: fixed` children.                                                                                                                                                                  | The panel is portaled to `<body>`; rule added to `CLAUDE.md`.                                                                                                                              |
| The live tracker sat on the last lot for most of the broadcast.                                        | Lots advanced at a fixed 6 minutes per lot, so 8 lots ran out long before the 5-hour live window ended.                                                                                                                                                       | `lotIndexAt()` spreads the lots over the whole broadcast window (later, the demo's 2-hour block).                                                                                          |
| The seed's "no repeated photo within an auction" guard failed.                                         | Extra gallery photos per lot, on top of each lot's main photo, used up a category's pool in the larger auctions.                                                                                                                                              | Extras are budgeted per category pool; the guard stays as a safety check.                                                                                                                  |
| Pages showed old data after reseeding locally.                                                         | The production build reused cached data in `.next/`.                                                                                                                                                                                                          | Delete `.next/` before a local build after a reseed (documented).                                                                                                                          |
| Open Graph images were 1–1.5 MB, too heavy for WhatsApp previews.                                      | `next/og` only outputs PNG, and the images have photo backgrounds. next/og also cannot decode WebP and does not support `inset`.                                                                                                                              | Photos are converted to JPEG with `sharp` before rendering; the PNG is re-encoded to JPEG (about 60 KB); positioning uses explicit offsets.                                                |
| Lighthouse flagged contrast, heading order, an invalid `<dl>` and slow LCP.                            | A muted text color below AA, a skipped heading level, icons and wrappers inside `<dl>` groups, render-blocking CSS.                                                                                                                                           | See [ARCHITECTURE.md → Performance and accessibility](./ARCHITECTURE.md#performance-and-accessibility).                                                                                    |
