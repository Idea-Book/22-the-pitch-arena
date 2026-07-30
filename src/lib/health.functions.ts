import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertStaffCtx } from "./staff.server";

export type HealthCheck = {
  key: string;
  label: string;
  ok: boolean;
  ms: number;
  detail: string;
  error?: string;
};

async function timed(key: string, label: string, fn: () => Promise<string>): Promise<HealthCheck> {
  const t0 = Date.now();
  try {
    const detail = await fn();
    return { key, label, ok: true, ms: Date.now() - t0, detail };
  } catch (err) {
    const error = err instanceof Error ? `${err.message}\n${err.stack ?? ""}`.trim() : String(err);
    console.error(`[health] ${key} FAILED`, err);
    return { key, label, ok: false, ms: Date.now() - t0, detail: "Check failed", error };
  }
}

/** Runs every deployment-critical check. Shared by the API route and admin UI. */
export async function runHealthChecks(): Promise<{ ok: boolean; at: string; checks: HealthCheck[] }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const sb = supabaseAdmin as any;

  const checks = await Promise.all([
    timed("database", "Database connection", async () => {
      const { error, count } = await sb.from("episodes").select("id", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return `Reachable · ${count ?? 0} episode rows`;
    }),
    timed("episodes_public", "/episodes returns data", async () => {
      const { data, error } = await sb
        .from("episodes")
        .select("id, slug, title, status, hero_img")
        .eq("status", "aired")
        .order("air_date", { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      const rows = data ?? [];
      if (rows.length === 0) throw new Error("No published (aired) episodes — /episodes would render empty");
      const missingImg = rows.filter((r: any) => !r.hero_img).length;
      return `${rows.length} published · ${missingImg} without hero image`;
    }),
    timed("episode_detail", "/episodes/$slug resolves", async () => {
      const { data, error } = await sb
        .from("episodes").select("slug").eq("status", "aired").limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data?.slug) throw new Error("No aired episode to resolve a detail route");
      return `Sample route /episodes/${data.slug}`;
    }),
    timed("auth_admin", "Admin login (roles)", async () => {
      const { data, error } = await sb.from("user_roles").select("user_id, role").eq("role", "admin");
      if (error) throw new Error(error.message);
      if ((data ?? []).length === 0) throw new Error("No user holds the admin role — admin login will be denied");
      return `${data.length} admin account(s) provisioned`;
    }),
    timed("auth_service", "Auth service", async () => {
      const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1 });
      if (error) throw new Error(error.message);
      return `Reachable · ${data?.users?.length ?? 0} user sampled`;
    }),
    timed("content", "Panelists & founders", async () => {
      const [p, f] = await Promise.all([
        sb.from("panelists").select("id", { count: "exact", head: true }),
        sb.from("founders").select("id", { count: "exact", head: true }),
      ]);
      if (p.error) throw new Error(p.error.message);
      if (f.error) throw new Error(f.error.message);
      if (!p.count) throw new Error("No panelists — /panelists renders empty");
      return `${p.count} panelists · ${f.count ?? 0} founders`;
    }),
    timed("media", "Media storage bucket", async () => {
      const { data, error } = await sb.storage.from("media").list("", { limit: 100 });
      if (error) throw new Error(error.message);
      return `Bucket reachable · ${(data ?? []).length} object(s) at root`;
    }),
    timed("settings", "Site configuration", async () => {
      const { data, error } = await sb.from("site_settings").select("site_name").maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw new Error("site_settings row missing — public config falls back to defaults");
      return `Loaded "${data.site_name ?? "untitled"}"`;
    }),
    timed("analytics", "Pageview tracking", async () => {
      const since = new Date(Date.now() - 7 * 86400000).toISOString();
      const { count, error } = await sb
        .from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since);
      if (error) throw new Error(error.message);
      return `${count ?? 0} views in last 7 days`;
    }),
  ]);

  return { ok: checks.every((c) => c.ok), at: new Date().toISOString(), checks };
}

export const adminHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaffCtx(context);
    return runHealthChecks();
  });
