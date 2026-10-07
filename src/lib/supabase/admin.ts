import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Privileged client (secret key, bypasses RLS). Only for trusted server code such as the daily
 * cron; never import it from components. SUPABASE_SECRET_KEY must not be NEXT_PUBLIC_.
 */
export function createSupabaseAdminClient() {
  // SUPABASE_URL (server-only, read at runtime) overrides the public URL inlined at build time.
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
