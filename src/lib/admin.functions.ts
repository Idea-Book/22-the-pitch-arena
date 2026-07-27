import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAppAuth as requireSupabaseAuth } from "./app-auth-middleware";
import { episodeUpsertSchema, panelistUpsertSchema, founderUpsertSchema, sponsorPackageSchema, sponsorPartnerSchema } from "./schemas";

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.from("user_roles").select("role").eq("user_id", ctx.userId);
  const roles = (data ?? []).map((r: any) => r.role);
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    throw new Error("Forbidden: staff only");
  }
  return roles as string[];
}
async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const roles = await assertStaff(ctx);
  if (!roles.includes("admin")) throw new Error("Forbidden: admin only");
}

// ---------- DASHBOARD ----------
export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { getAppAdmin } = await import("./app-admin.server");
    const supabaseAdmin: any = getAppAdmin();
    const tables = ["community_posts", "post_comments", "reports", "applications", "ticket_inquiries", "sponsor_inquiries", "episodes", "panelists", "founders", "profiles"];
    const counts: Record<string, number> = {};
    await Promise.all(tables.map(async (t) => {
      const { count } = await (supabaseAdmin as any).from(t).select("*", { count: "exact", head: true });
      counts[t] = count ?? 0;
    }));
    const { count: openReports } = await supabaseAdmin.from("reports").select("*", { count: "exact", head: true }).eq("status", "open");
    return { counts, openReports: openReports ?? 0 };
  });

// ---------- CONTENT CRUD ----------
export const adminUpsertEpisode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => episodeUpsertSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const payload: any = { ...data, air_date: data.air_date || null, video_url: data.video_url || null };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await context.supabase.from("episodes").upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteEpisode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("episodes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpsertPanelist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => panelistUpsertSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const payload: any = { ...data };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await context.supabase.from("panelists").upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletePanelist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("panelists").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpsertFounder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => founderUpsertSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const payload: any = { ...data };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await context.supabase.from("founders").upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteFounder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("founders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- SPONSOR CONTENT ----------
export const adminListSponsorPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase.from("sponsor_packages").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });
export const adminUpsertSponsorPackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => sponsorPackageSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const payload: any = { ...data };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await context.supabase.from("sponsor_packages").upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });
export const adminDeleteSponsorPackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("sponsor_packages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListSponsorPartners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase.from("sponsor_partners").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });
export const adminUpsertSponsorPartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => sponsorPartnerSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const payload: any = { ...data };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await context.supabase.from("sponsor_partners").upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });
export const adminDeleteSponsorPartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("sponsor_partners").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
export const adminListReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase.from("reports")
      .select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const ids = Array.from(new Set(rows.map((r: any) => r.reporter_id).filter(Boolean)));
    let profilesById = new Map<string, any>();
    if (ids.length) {
      const { data: profs } = await context.supabase.from("profiles").select("id, display_name, handle").in("id", ids);
      profilesById = new Map((profs ?? []).map((p: any) => [p.id, p]));
    }
    return rows.map((r: any) => ({ ...r, profiles: profilesById.get(r.reporter_id) ?? null }));
  });

export const adminResolveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({
    id: z.string().uuid(),
    status: z.enum(["resolved","dismissed"]),
    notes: z.string().trim().max(400).optional().or(z.literal("")),
    remove_target: z.boolean().default(false),
  }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { data: rep } = await context.supabase.from("reports").select("*").eq("id", data.id).maybeSingle();
    if (!rep) throw new Error("Report not found");
    if (data.remove_target) {
      const table = rep.target_type === "post" ? "community_posts" : "post_comments";
      await (context.supabase as any).from(table).update({ status: "removed" }).eq("id", rep.target_id);
    }
    const { error } = await context.supabase.from("reports").update({
      status: data.status,
      resolution_notes: data.notes || null,
      resolved_by: context.userId,
      resolved_at: new Date().toISOString(),
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase.from("community_posts")
      .select("id, body, status, created_at, reaction_count, comment_count, author_id, profiles!community_posts_author_id_fkey(display_name, handle)")
      .order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSetPostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid(), status: z.enum(["live","removed","pending"]) }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("community_posts").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const postUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  body: z.string().trim().min(2, "Say something").max(1000),
  media_url: z.string().url().max(500).optional().or(z.literal("")),
  episode_id: z.string().uuid().optional().nullable().or(z.literal("")),
  status: z.enum(["live", "pending", "removed"]).default("live"),
});

export const adminUpsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => postUpsertSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const payload: any = {
      body: data.body,
      media_url: data.media_url || null,
      episode_id: data.episode_id || null,
      status: data.status,
    };
    if (data.id) {
      const { error } = await context.supabase.from("community_posts").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    payload.author_id = context.userId;
    const { data: row, error } = await context.supabase.from("community_posts").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("community_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
export const adminBanUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({
    user_id: z.string().uuid(),
    reason: z.string().trim().min(2).max(400),
    expires_at: z.string().optional().or(z.literal("")),
  }).parse(v))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("user_bans").insert({
      user_id: data.user_id, reason: data.reason,
      expires_at: data.expires_at || null, created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListBans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase.from("user_bans")
      .select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const ids = Array.from(new Set(rows.map((r: any) => r.user_id).filter(Boolean)));
    let profilesById = new Map<string, any>();
    if (ids.length) {
      const { data: profs } = await context.supabase.from("profiles").select("id, display_name, handle").in("id", ids);
      profilesById = new Map((profs ?? []).map((p: any) => [p.id, p]));
    }
    return rows.map((r: any) => ({ ...r, profiles: profilesById.get(r.user_id) ?? null }));
  });

export const adminLiftBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("user_bans").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- SUBMISSIONS ----------
const listSubInput = z.object({ table: z.enum(["applications","ticket_inquiries","sponsor_inquiries"]) });
export const adminListSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => listSubInput.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { data: rows, error } = await (context.supabase as any).from(data.table).select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminUpdateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({
    table: z.enum(["applications","ticket_inquiries","sponsor_inquiries"]),
    id: z.string().uuid(),
    status: z.enum(["new","reviewing","accepted","rejected","archived"]),
    notes: z.string().trim().max(400).optional().or(z.literal("")),
  }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const patch: any = { status: data.status };
    if (data.table === "applications") {
      patch.reviewed_by = context.userId;
      if (data.notes) patch.reviewer_notes = data.notes;
    }
    const { error } = await (context.supabase as any).from(data.table).update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- USERS & ROLES ----------
export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { getAppAdmin } = await import("./app-admin.server");
    const supabaseAdmin: any = getAppAdmin();
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, display_name, handle, avatar_url, created_at").order("created_at", { ascending: false }).limit(500),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    const rolesByUser = new Map<string, string[]>();
    for (const r of (roles ?? []) as any[]) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role); rolesByUser.set(r.user_id, arr);
    }
    return ((profiles ?? []) as any[]).map((p: any) => ({ ...p, roles: rolesByUser.get(p.id) ?? [] }));

  });

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({
    user_id: z.string().uuid(),
    role: z.enum(["admin","moderator","user"]),
    grant: z.boolean(),
  }).parse(v))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { getAppAdmin } = await import("./app-admin.server");
    const supabaseAdmin: any = getAppAdmin();
    if (data.grant) {
      const { error } = await supabaseAdmin.from("user_roles").upsert({ user_id: data.user_id, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });