import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { AUCTIONS_TAG } from "@/lib/data/auctions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Daily Vercel cron (vercel.json). One job, because Hobby crons run at most once a day:
 * 1. Keep-alive: a real query, so the free Supabase project never pauses for inactivity.
 * 2. Weekly rotation: rotate_demo_dates() re-anchors the demo dates when 7+ days have passed.
 * 3. Marks the catalog cache stale, so the next visit refreshes it (stale-while-revalidate).
 *
 * Vercel sends `Authorization: Bearer <CRON_SECRET>`; any other caller gets 401.
 */
function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const ping = await supabase
    .from("auctions")
    .select("id", { count: "exact", head: true });
  if (ping.error) {
    console.error("Cron keep-alive failed:", ping.error.message);
    return Response.json({ ok: false, error: "database unreachable" }, { status: 503 });
  }

  const rotation = await supabase.rpc("rotate_demo_dates");
  if (rotation.error) {
    console.error("Cron rotation failed:", rotation.error.message);
    return Response.json({ ok: false, error: "rotation failed" }, { status: 500 });
  }

  revalidateTag(AUCTIONS_TAG, "max");

  return Response.json({
    ok: true,
    auctions: ping.count,
    rotated: rotation.data,
    at: new Date().toISOString(),
  });
}
