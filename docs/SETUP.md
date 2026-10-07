# Setup and deployment

How to run the project locally, manage the shared database and deploy to Vercel. For how the
system works, see [ARCHITECTURE.md](./ARCHITECTURE.md).

- [Getting started](#getting-started)
- [Setting up `.env.local`](#setting-up-envlocal)
- [Database](#database)
- [Deploying to Vercel](#deploying-to-vercel)
- [Scripts](#scripts)

## Getting started

Requirements: Node.js 20.9+ (developed on Node 24) and npm.

```bash
npm install
cp .env.example .env.local   # then fill it in: see "Setting up .env.local" below
npm run db:link              # links the Supabase CLI to the team project (once)
npm run dev
```

Open http://localhost:3000 (redirects to `/es`).

See [CLAUDE.md](../CLAUDE.md) for stack, structure and conventions.

## Setting up `.env.local`

The team shares one free Supabase cloud project. `.env.local` is git-ignored: never commit it,
and never paste keys or passwords in chats, issues, commits or screenshots. Ask the project owner
for an invitation to the Supabase organization; shared secrets travel through the team password
manager only.

| Variable                               | Where to get it                                                                                          | Shared?          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase dashboard → Project Settings → API → Project URL                                                | yes (public)     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same page → API keys → publishable key (`sb_publishable_…`). Safe in the browser: RLS protects the data. | yes (public)     |
| `SUPABASE_SECRET_KEY`                  | Same page → API keys → secret key (`sb_secret_…`). Server only: used by the daily cron.                  | yes (secret)     |
| `SUPABASE_ACCESS_TOKEN`                | Your own personal token: supabase.com/dashboard/account/tokens. Give it an expiry; revoke it when done.  | **no, personal** |
| `SUPABASE_DB_PASSWORD`                 | Database password, from the team password manager (or reset in Project Settings → Database).             | yes (secret)     |
| `NEXT_PUBLIC_SITE_URL`                 | `http://localhost:3000` locally                                                                          | —                |
| `CRON_SECRET`                          | Only needed to call the cron endpoint locally; any long random string.                                   | no               |

Two gotchas:

- **Wrap values that contain `$`, `#` or spaces in single quotes**, e.g. `SUPABASE_DB_PASSWORD='pa$$#word'`.
  Unquoted, the env parser silently drops characters and the CLI fails with
  `password authentication failed`.
- The access token and DB password are only used by the `db:*` scripts on your machine. The
  website needs the URL and the publishable key; the cron also needs the secret key.

Check your setup with `npm run db:link`: it should finish without errors.

## Database

Schema changes are SQL migrations in `supabase/migrations/`; sample data lives in
`supabase/seed.sql`. The `db:*` scripts read `.env.local` for you.

```bash
npm run db:push        # apply pending migrations to the shared project
npm run db:seed        # reset the demo data (safe to run any time, see below)
npm run db:reset-demo  # both: migrations, then seed
npm run db:types       # regenerate src/lib/supabase/database.types.ts after a schema change
```

`db:seed` empties the catalog tables (auctions, lots, photos, agents) and reloads them in one
transaction, so running it again never duplicates data. Contact messages are never touched. The
project is shared: a reset affects everyone, so tell the team.

After reseeding, delete `.next/` before a local production build: the build reuses cached data
otherwise.

**The production site reads the same database.** Make schema changes backward compatible (new
columns optional) and apply them with `db:push` _before_ pushing the code that uses them.

### How the demo stays current

- **Always one auction live.** Auction 120 is flagged `demo_live`. The app derives its start from
  the clock: it is on air in the current 2-hour block (Uruguay time) and its 8 lots go through the
  ring every 15 minutes. The "in the ring now" panel computes this in the browser, so it is right
  even when the page comes from cache.
- **Weekly date rotation.** The other auctions store where they sit relative to today
  (`demo_day_offset`, `demo_time`). The daily cron calls `rotate_demo_dates()`, which re-anchors
  them once 7 days have passed, so there are always finished and upcoming auctions.

Details in [ARCHITECTURE.md → Demo mechanics](./ARCHITECTURE.md#demo-mechanics).

## Deploying to Vercel

Production: **https://tranquera-de-paysandu.vercel.app**

The site runs on a personal **Vercel Hobby** account, connected to the GitHub repo
`maxiv03/tranquera-de-paysandu`, where teammates are collaborators.

### 1. Connect the repository

1. On vercel.com, sign in with the owner's GitHub account → **Add New… → Project** → import
   `tranquera-de-paysandu`. Framework preset: **Next.js**; keep the default build settings.
   `vercel.json` pins `"framework": "nextjs"`, so a project created from the CLI (which
   defaults to "Other" and serves only `public/`, every route a 404) still builds correctly.
2. Every push to `main` deploys to production; every other branch or pull request gets a preview
   URL.
3. Teammates are added as collaborators on **GitHub** (repo Settings → Collaborators). Hobby
   accounts cannot add team members on Vercel. If the repo is made private, Vercel Hobby may block
   deployments of commits authored by someone other than the owner; then the owner merges the pull
   requests, or the repo stays public.

### 2. Environment variables

Vercel → Project → Settings → Environment Variables:

| Variable                               | Environments        | Value                                                                    |
| -------------------------------------- | ------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | Production, Preview | Supabase project URL                                                     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production, Preview | publishable key                                                          |
| `SUPABASE_SECRET_KEY`                  | Production          | secret key (mark it **Sensitive**)                                       |
| `CRON_SECRET`                          | Production          | a new long random string (`openssl rand -hex 32`), mark it **Sensitive** |
| `NEXT_PUBLIC_SITE_URL`                 | Production          | the public URL, e.g. `https://tranquera-de-paysandu.vercel.app`          |

`SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` are **not** needed on Vercel: migrations and
seeds run from a developer machine with the CLI.

`NEXT_PUBLIC_*` values are baked into the build: after changing one, **redeploy** (Deployments →
⋯ → Redeploy). Previews without `NEXT_PUBLIC_SITE_URL` fall back to the deployment URL.

### 3. Domain

- **Free Vercel subdomain:** the project gets `https://<project-name>.vercel.app` (rename it in
  Settings → Domains). Use that URL as `NEXT_PUBLIC_SITE_URL` and redeploy.
- **Custom domain:** Settings → Domains → Add, then create the DNS records Vercel shows (an `A`
  record to `76.76.21.21` for the apex domain, a `CNAME` to `cname.vercel-dns.com` for `www`).
  Once it verifies, set `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy, so canonical
  URLs, the sitemap, share links and WhatsApp messages point to it.

### 4. Supabase

No integration is needed: the site talks to Supabase over HTTPS with the variables above. Apply
migrations before deploying code that needs them (`npm run db:push`). The free plan pauses a
project after a week without activity; the daily cron prevents that.

Pages keep working if Supabase is unreachable: data reads are cached (refresh every 5 minutes,
kept for 30 days) and failed reads are never cached, so visitors get the last good copy.

### 5. The daily cron

`vercel.json` schedules one job, `GET /api/cron/daily`, every day at 09:00 UTC (06:00 in Uruguay).
Hobby crons run at most once a day, only on the production deployment, and may fire any time
within that hour. The job:

1. Queries Supabase (keep-alive).
2. Calls `rotate_demo_dates()` (it rotates only when the last rotation is 7+ days old).
3. Marks the catalog cache stale, so the next visit refreshes it.

Vercel calls it with `Authorization: Bearer <CRON_SECRET>`; any other request gets `401`.

**Check that it works:**

- Vercel → Project → Settings → **Cron Jobs**: the job is listed; **Run** triggers it on demand.
- Vercel → **Logs**, filtered by `/api/cron/daily`: each run should return `200`.
- From a terminal (with the production secret):

  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" https://<your-domain>/api/cron/daily
  # {"ok":true,"auctions":5,"rotated":false,"at":"…"}   ← rotated is true once a week
  curl -i https://<your-domain>/api/cron/daily          # 401 without the secret
  ```

- In Supabase → Table Editor → `demo_state`, `last_rotation` should never be older than 7 days.

### 6. After the first deploy

- Open `/es`, `/en`, an auction, a lot and `/es/en-vivo`.
- `https://<your-domain>/sitemap.xml` and `/robots.txt` list the production URLs.
- Share a lot link (WhatsApp, LinkedIn…) or use a social preview tool to see the generated image.

## Scripts

| Script                              | What it does                                                     |
| ----------------------------------- | ---------------------------------------------------------------- |
| `npm run dev` / `build` / `start`   | Next.js dev server, production build, production server          |
| `npm run check`                     | typecheck + lint (including untranslated text) + i18n key parity |
| `npm run format`                    | Prettier with Tailwind class sorting                             |
| `npm run db:*`                      | Supabase CLI through `scripts/supabase.mjs` (see above)          |
| `node scripts/import-photos.mjs`    | downloads and optimizes the photos listed in `photos.json`       |
| `node scripts/optimize-video.mjs`   | compresses a video clip and makes its poster                     |
| `node scripts/generate-avatars.mjs` | regenerates the agents' initials avatars                         |
