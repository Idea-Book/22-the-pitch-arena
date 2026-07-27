import { createServerFn } from "@tanstack/react-start";
import { requireAppAuth as requireSupabaseAuth } from "@/lib/app-auth-middleware";
import { postSchema, commentSchema, reactionSchema, reportSchema } from "./schemas";

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => postSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("community_posts")
      .insert({ author_id: context.userId, body: data.body, episode_id: data.episode_id ?? null, media_url: data.media_url ?? null })
      .select("id").single();
    if (error) throw new Error(error.message);
    return row;
  });

export const createComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => commentSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("post_comments")
      .insert({ post_id: data.post_id, author_id: context.userId, body: data.body })
      .select("id").single();
    if (error) throw new Error(error.message);
    return row;
  });

export const toggleReaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => reactionSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("post_reactions").select("post_id").eq("post_id", data.post_id).eq("user_id", context.userId).eq("kind", data.kind).maybeSingle();
    if (existing) {
      const { error } = await context.supabase.from("post_reactions").delete().eq("post_id", data.post_id).eq("user_id", context.userId).eq("kind", data.kind);
      if (error) throw new Error(error.message);
      return { added: false };
    }
    const { error } = await context.supabase.from("post_reactions").insert({ post_id: data.post_id, user_id: context.userId, kind: data.kind });
    if (error) throw new Error(error.message);
    return { added: true };
  });

export const submitReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => reportSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("reports")
      .insert({ target_type: data.target_type, target_id: data.target_id, reporter_id: context.userId, reason: data.reason });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteOwnPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => ({ id: String((v as any).id) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("community_posts").delete().eq("id", data.id).eq("author_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });