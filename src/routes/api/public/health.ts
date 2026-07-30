import { createFileRoute } from "@tanstack/react-router";

/** Deployment smoke endpoint: GET /api/public/health */
export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { runHealthChecks } = await import("@/lib/health.server");
          const result = await runHealthChecks();
          if (!result.ok) {
            console.error(
              "[health] degraded:",
              result.checks.filter((c) => !c.ok).map((c) => `${c.key}: ${c.error}`).join(" | "),
            );
          }
          return new Response(JSON.stringify(result, null, 2), {
            status: result.ok ? 200 : 503,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        } catch (err) {
          console.error("[health] endpoint crashed", err);
          return new Response(
            JSON.stringify({
              ok: false,
              error: err instanceof Error ? err.message : String(err),
              stack: err instanceof Error ? err.stack : undefined,
            }, null, 2),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
