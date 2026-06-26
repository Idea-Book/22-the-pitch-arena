import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const slugInput = z.object({ slug: z.string().trim().min(1).max(80) });

const listEpisodesInput = z.object({ all: z.boolean().optional() }).optional();
export const listEpisodes = createServerFn({ method: "GET" })
  .inputValidator((v) => listEpisodesInput.parse(v ?? {}))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    let q = sb.from("episodes").select("*").order("air_date", { ascending: false });
    if (!data?.all) q = q.eq("status", "aired");
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getEpisode = createServerFn({ method: "GET" })
  .inputValidator((v) => slugInput.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { data: ep, error } = await sb.from("episodes").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!ep) return null;
    const [{ data: pans }, { data: fnds }] = await Promise.all([
      sb.from("episode_panelists").select("verdict, investment_amount, equity_pct, notes, panelists(*)").eq("episode_id", ep.id),
      sb.from("episode_founders").select("verdict, feedback, founders(*)").eq("episode_id", ep.id),
    ]);
    return { episode: ep, panelists: pans ?? [], founders: fnds ?? [] };
  });

export const listPanelists = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicSupabase } = await import("./supabase-public.server");
  const sb = getPublicSupabase();
  const { data, error } = await sb.from("panelists").select("*").order("record_wins", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPanelist = createServerFn({ method: "GET" })
  .inputValidator((v) => slugInput.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { data: p, error } = await sb.from("panelists").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!p) return null;
    const { data: matches } = await sb.from("episode_panelists").select("verdict, investment_amount, episodes(slug, title, round_code, city, outcome, air_date)").eq("panelist_id", p.id);
    return { panelist: p, matches: matches ?? [] };
  });

export const listFounders = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicSupabase } = await import("./supabase-public.server");
  const sb = getPublicSupabase();
  const { data, error } = await sb.from("founders").select("*").order("position", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getFounder = createServerFn({ method: "GET" })
  .inputValidator((v) => slugInput.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { data: f, error } = await sb.from("founders").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!f) return null;
    const { data: appearances } = await sb.from("episode_founders").select("verdict, feedback, episodes(slug, title, round_code, city, outcome, air_date)").eq("founder_id", f.id);
    return { founder: f, appearances: appearances ?? [] };
  });

const listPostsInput = z.object({ episode_id: z.string().uuid().optional().nullable(), limit: z.number().int().min(1).max(100).default(50) });

export const listPosts = createServerFn({ method: "GET" })
  .inputValidator((v) => listPostsInput.parse(v ?? {}))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    let q = sb.from("community_posts")
      .select("id, body, media_url, status, reaction_count, comment_count, created_at, episode_id, author_id, profiles!community_posts_author_id_fkey(display_name, handle, avatar_url), episodes(slug, title, round_code)")
      .eq("status", "live")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.episode_id) q = q.eq("episode_id", data.episode_id);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listComments = createServerFn({ method: "GET" })
  .inputValidator((v) => z.object({ post_id: z.string().uuid() }).parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { data: rows, error } = await sb.from("post_comments")
      .select("id, body, created_at, author_id, profiles!post_comments_author_id_fkey(display_name, handle, avatar_url)")
      .eq("post_id", data.post_id).eq("status", "live").order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listSponsorPackages = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicSupabase } = await import("./supabase-public.server");
  const sb = getPublicSupabase();
  const { data, error } = await sb.from("sponsor_packages").select("*").eq("active", true).order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listSponsorPartners = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicSupabase } = await import("./supabase-public.server");
  const sb = getPublicSupabase();
  const { data, error } = await sb.from("sponsor_partners").select("*").eq("active", true).order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});