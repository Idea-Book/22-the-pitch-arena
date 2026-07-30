import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminHealth } from "@/lib/health.functions";
import { AdminHeader } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/admin/status")({ component: StatusAdmin });

type Check = { key: string; label: string; ok: boolean; ms: number; detail: string; error?: string };

function StatusAdmin() {
  const { data, isFetching, refetch, error } = useQuery({
    queryKey: ["adminHealth"],
    queryFn: () => adminHealth(),
    refetchInterval: 60_000,
    staleTime: 0,
  });

  const checks: Check[] = data?.checks ?? [];
  const failing = checks.filter((c) => !c.ok);

  return (
    <>
      <AdminHeader
        title="System status"
        subtitle="Route-level health checks for the public site, admin login and media pipeline."
        actions={
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50"
          >
            {isFetching ? "Checking…" : "Re-run checks"}
          </button>
        }
      />

      {error && (
        <div className="ring-1 ring-[var(--crimson)] p-5 mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)] mb-2">Checks could not run</div>
          <pre className="text-[11px] whitespace-pre-wrap font-mono">{(error as Error).message}</pre>
        </div>
      )}

      {data && (
        <div className={`p-5 mb-6 ring-1 ${data.ok ? "ring-border bg-[var(--surface)]" : "ring-[var(--crimson)]"}`}>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Overall</div>
              <div className={`font-display text-4xl ${data.ok ? "" : "text-[var(--crimson)]"}`}>
                {data.ok ? "All systems nominal" : `${failing.length} check(s) failing`}
              </div>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {new Date(data.at).toLocaleString("en-IN")}
            </div>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mt-3">
            Public endpoint for uptime monitors: <span className="text-foreground">GET /api/public/health</span> (200 healthy, 503 degraded)
          </p>
        </div>
      )}

      <ul className="divide-y divide-border ring-1 ring-border">
        {(isFetching && checks.length === 0 ? Array.from({ length: 6 }) : checks).map((c: any, i: number) => (
          <li key={c?.key ?? i} className="bg-background p-4">
            {!c ? (
              <div className="h-10 animate-pulse bg-[var(--surface)]" />
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <span
                    className="size-2 shrink-0"
                    style={{ background: c.ok ? "var(--electric)" : "var(--crimson)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg">{c.label}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate">
                      {c.detail}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tabular-nums">{c.ms} ms</div>
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: c.ok ? "var(--electric)" : "var(--crimson)" }}
                  >
                    {c.ok ? "Pass" : "Fail"}
                  </div>
                </div>
                {c.error && (
                  <pre className="mt-3 bg-[var(--surface)] ring-1 ring-[var(--crimson)] p-3 text-[10px] font-mono whitespace-pre-wrap overflow-x-auto">
                    {c.error}
                  </pre>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
