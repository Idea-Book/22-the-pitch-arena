import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertStaffCtx, assertAdminCtx } from "./staff.server";
import { siteSettingsSchema, emailTemplateSchema } from "./settings-schema";

const PUBLIC_FIELDS =
  "site_name, tagline, contact_email, support_email, google_analytics_id, gtm_id, meta_pixel_id, custom_head_scripts, custom_body_scripts, social_instagram, social_x, social_youtube, social_linkedin, maintenance_banner, maintenance_banner_enabled";

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicSupabase } = await import("./supabase-public.server");
  const { data } = await getPublicSupabase().from("site_settings").select(PUBLIC_FIELDS).maybeSingle();
  return (data ?? null) as Record<string, any> | null;
});

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaffCtx(context);
    const { data, error } = await context.supabase.from("site_settings").select("*").maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const adminUpdateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => siteSettingsSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaffCtx(context);
    const patch: Record<string, any> = {};
    for (const [k, val] of Object.entries(data)) patch[k] = val === "" ? null : val;
    const { data: row, error } = await (context.supabase as any)
      .from("site_settings").update(patch).eq("id", true).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminListEmailTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaffCtx(context);
    const { data, error } = await context.supabase.from("email_templates").select("*").order("name");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => emailTemplateSchema.parse(v))
  .handler(async ({ data, context }) => {
    await assertStaffCtx(context);
    const payload: any = { ...data, description: data.description || null };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await context.supabase
      .from("email_templates").upsert(payload, { onConflict: "key" }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertAdminCtx(context);
    const { error } = await context.supabase.from("email_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ days: z.number().int().min(7).max(90).default(30) }).parse(v ?? { days: 30 }))
  .handler(async ({ data, context }) => {
    await assertStaffCtx(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.days * 86400000).toISOString();
    const sb = supabaseAdmin as any;

    const [views, apps, posts, tickets, sponsors, talent, invites, profiles, episodes] = await Promise.all([
      sb.from("page_views").select("path, referrer, session_id, created_at").gte("created_at", since).limit(5000),
      sb.from("applications").select("created_at, status, product_stage, customer_segment, city, sector").gte("created_at", since),
      sb.from("community_posts").select("created_at, status").gte("created_at", since),
      sb.from("ticket_inquiries").select("created_at, tier, seats, status").gte("created_at", since),
      sb.from("sponsor_inquiries").select("created_at, tier, status").gte("created_at", since),
      sb.from("talent_applications").select("created_at, role, status").gte("created_at", since),
      sb.from("panelist_invitations").select("created_at, status").gte("created_at", since),
      sb.from("profiles").select("created_at").gte("created_at", since),
      sb.from("episodes").select("status"),
    ]);

    const dayKeys: string[] = [];
    for (let i = data.days - 1; i >= 0; i--) dayKeys.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
    const bucket = (rows: any[]) => {
      const m = new Map(dayKeys.map((d) => [d, 0]));
      for (const r of rows ?? []) {
        const d = String(r.created_at).slice(0, 10);
        if (m.has(d)) m.set(d, (m.get(d) ?? 0) + 1);
      }
      return dayKeys.map((d) => ({ date: d, value: m.get(d) ?? 0 }));
    };
    const tally = (rows: any[], field: string) => {
      const m = new Map<string, number>();
      for (const r of rows ?? []) {
        const k = r[field] ? String(r[field]) : "—";
        m.set(k, (m.get(k) ?? 0) + 1);
      }
      return [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8);
    };

    const viewRows = views.data ?? [];
    const sessions = new Set(viewRows.map((v: any) => v.session_id).filter(Boolean)).size;
    const ticketSeats = (tickets.data ?? []).reduce((s: number, t: any) => s + (t.seats ?? 0), 0);

    return {
      days: data.days,
      totals: {
        pageViews: viewRows.length,
        sessions,
        applications: (apps.data ?? []).length,
        posts: (posts.data ?? []).length,
        ticketInquiries: (tickets.data ?? []).length,
        ticketSeats,
        sponsorInquiries: (sponsors.data ?? []).length,
        talentApplications: (talent.data ?? []).length,
        panelInvites: (invites.data ?? []).length,
        newUsers: (profiles.data ?? []).length,
        publishedEpisodes: (episodes.data ?? []).filter((e: any) => e.status === "aired").length,
      },
      series: {
        pageViews: bucket(viewRows),
        applications: bucket(apps.data ?? []),
        posts: bucket(posts.data ?? []),
        tickets: bucket(tickets.data ?? []),
        signups: bucket(profiles.data ?? []),
      },
      breakdowns: {
        topPaths: tally(viewRows, "path"),
        referrers: tally(viewRows.filter((v: any) => v.referrer), "referrer"),
        applicationStage: tally(apps.data ?? [], "product_stage"),
        applicationSegment: tally(apps.data ?? [], "customer_segment"),
        applicationStatus: tally(apps.data ?? [], "status"),
        ticketTiers: tally(tickets.data ?? [], "tier"),
        talentRoles: tally(talent.data ?? [], "role"),
        postStatus: tally(posts.data ?? [], "status"),
      },
    };
  });
