// Runs the Supabase CLI with the credentials from .env.local, so nobody has to export them by hand.
// Usage: node scripts/supabase.mjs <cli args...>   (see the db:* scripts in package.json)
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

if (!existsSync(".env.local")) {
  console.error("Missing .env.local — copy .env.example and fill it in (see README).");
  process.exit(1);
}
process.loadEnvFile(".env.local");

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_ACCESS_TOKEN",
  "SUPABASE_DB_PASSWORD",
];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing in .env.local: ${missing.join(", ")}`);
  process.exit(1);
}

// https://<project-ref>.supabase.co
const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const args = process.argv.slice(2).map((arg) => arg.replace("{ref}", projectRef));

const result = spawnSync("npx", ["supabase", ...args], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});
process.exit(result.status ?? 1);
