// Static-host safe: direct Supabase client reads for public content.
// Used as a fallback when server functions aren't available (e.g. Hostinger static hosting).
import { supabase } from "@/integrations/supabase/client";

export async function fetchEpisodesClient(opts: { all?: boolean } = {}) {
  let q = supabase.from("episodes").select("*").order("air_date", { ascending: false });
  if (!opts.all) q = q.eq("status", "aired");
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchEpisodesPagedClient(opts: { cursor?: string | null; limit?: number } = {}) {
  const limit = opts.limit ?? 12;
  let q = supabase
    .from("episodes")
    .select("*")
    .eq("status", "aired")
    .order("air_date", { ascending: false, nullsFirst: false })
    .limit(limit + 1);
  if (opts.cursor) q = q.lt("air_date", opts.cursor);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  const items = data ?? [];
  const hasMore = items.length > limit;
  const sliced = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? (sliced[sliced.length - 1] as any).air_date : null;
  return { items: sliced, nextCursor };
}
