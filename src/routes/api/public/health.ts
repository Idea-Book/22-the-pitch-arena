import { createFileRoute } from "@tanstack/react-router";

type Check = { name: string; ok: boolean; detail: string };

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const checks: Check[] = [];
        const { appSupabaseUrl } = await import("@/lib/app-backend");
        const url = appSupabaseUrl();

        // 1. Public read (episodes) through the anon/publishable key
        try {
          const { getPublicSupabase } = await import("@/lib/supabase-public.server");
          const { count, error } = await getPublicSupabase()
            .from("episodes")
            .select("*", { count: "exact", head: true });
          checks.push({
            name: "episodes_read",
            ok: !error,
            detail: error ? error.message : `${count ?? 0} episodes readable`,
          });
        } catch (e: any) {
          checks.push({ name: "episodes_read", ok: false, detail: e?.message ?? "failed" });
        }

        // 2. Auth endpoint reachable
        try {
          const res = await fetch(`${url}/auth/v1/settings`, {
            headers: { apikey: (await import("@/lib/app-backend")).appSupabasePublishableKey() },
          });
          const body: any = res.ok ? await res.json() : null;
          checks.push({
            name: "auth_service",
            ok: res.ok,
            detail: res.ok
              ? `google=${body?.external?.google ? "enabled" : "disabled"}, email=${body?.external?.email ? "enabled" : "disabled"}`
              : `HTTP ${res.status}`,
          });
        } catch (e: any) {
          checks.push({ name: "auth_service", ok: false, detail: e?.message ?? "failed" });
        }

        // 3. Admin write path (service role key present + usable)
        try {
          const { hasServiceKey, getAppAdmin } = await import("@/lib/app-admin.server");
          if (!hasServiceKey()) {
            checks.push({
              name: "admin_service_role",
              ok: false,
              detail: "EXTERNAL_SUPABASE_SERVICE_ROLE_KEY not set",
            });
          } else {
            const { error } = await getAppAdmin()
              .from("user_roles")
              .select("role", { count: "exact", head: true });
            checks.push({
              name: "admin_service_role",
              ok: !error,
              detail: error ? error.message : "service role reachable",
            });
          }
        } catch (e: any) {
          checks.push({ name: "admin_service_role", ok: false, detail: e?.message ?? "failed" });
        }

        const ok = checks.every((c) => c.ok);
        return Response.json(
          { ok, project: url, checkedAt: new Date().toISOString(), checks },
          { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
