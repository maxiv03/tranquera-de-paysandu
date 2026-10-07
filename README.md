# Tranquera de Paysandú

Portfolio demo: bilingual (es/en) website for a fictional cattle auction company from Paysandú,
Uruguay. Built with Next.js, TypeScript, Tailwind CSS, next-intl, Supabase and Leaflet.

All brands, people, texts and images are fictional.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill it in: see "Setting up .env.local" below
npm run db:link              # links the Supabase CLI to the team project (once)
npm run dev
```

Open http://localhost:3000 (redirects to `/es`).

See [CLAUDE.md](./CLAUDE.md) for stack, structure and conventions.

## Setting up `.env.local`

The team shares one free Supabase cloud project. `.env.local` is git-ignored: never commit it,
and never paste keys or passwords in chats, issues, commits or screenshots. Ask the project owner
for an invitation to the Supabase organization; shared secrets travel through the team password
manager only.

| Variable                               | Where to get it                                                                                          | Shared?          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase dashboard → Project Settings → API → Project URL                                                | yes (public)     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same page → API keys → publishable key (`sb_publishable_…`). Safe in the browser: RLS protects the data. | yes (public)     |
| `SUPABASE_ACCESS_TOKEN`                | Your own personal token: supabase.com/dashboard/account/tokens. Give it an expiry; revoke it when done.  | **no, personal** |
| `SUPABASE_DB_PASSWORD`                 | Database password, from the team password manager (or reset in Project Settings → Database).             | yes (secret)     |
| `NEXT_PUBLIC_SITE_URL`                 | `http://localhost:3000` locally                                                                          | —                |
| `CRON_SECRET`                          | Only needed to test the keep-alive cron locally; any long random string.                                 | no               |

Two gotchas:

- **Wrap values that contain `$`, `#` or spaces in single quotes**, e.g. `SUPABASE_DB_PASSWORD='pa$$#word'`.
  Unquoted, the env parser silently drops characters and the CLI fails with
  `password authentication failed`.
- The access token and DB password are only used by the `db:*` scripts on your machine. The
  website itself (locally and on Vercel) only needs the URL and the publishable key.

Check your setup with `npm run db:link`: it should print the project ref without errors.

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
transaction, so running it again never duplicates data. Dates are relative to the moment you run
it, which also refreshes the demo (finished, live and upcoming auctions). Contact messages are
never touched. The project is shared: a reset affects everyone, so tell the team.

Placeholder images are generated with `node scripts/generate-avatars.mjs`.
