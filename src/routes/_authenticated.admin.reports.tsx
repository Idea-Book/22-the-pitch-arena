import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { adminListReports, adminResolveReport } from "@/lib/admin.functions";
import { AdminHeader } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["adminReports"], queryFn: () => adminListReports() });
  const [filter, setFilter] = useState<"open" | "all">("open");
  const filtered = data.filter((r: any) => filter === "all" || r.status === "open");

  const resolve = useMutation({
    mutationFn: (input: any) => adminResolveReport({ data: input }),
    onSuccess: () => { toast.success("Report updated"); qc.invalidateQueries({ queryKey: ["adminReports"] }); qc.invalidateQueries({ queryKey: ["adminStats"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title="Reports queue" subtitle="Review reported posts and comments. Resolve, dismiss or remove the target."
        actions={
          <div className="flex gap-1 font-mono text-[10px] uppercase tracking-[0.25em]">
            {(["open", "all"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 ring-1 ${filter === f ? "ring-foreground bg-foreground text-background" : "ring-border text-muted-foreground hover:text-foreground"}`}>{f}</button>
            ))}
          </div>
        }
      />
      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
        filtered.length === 0 ? <p className="text-sm text-muted-foreground">No reports.</p> :
        <ul className="space-y-3">
          {filtered.map((r: any) => <ReportRow key={r.id} r={r} onResolve={(input) => resolve.mutate({ id: r.id, ...input })} busy={resolve.isPending} />)}
        </ul>}
    </>
  );
}

function ReportRow({ r, onResolve, busy }: { r: any; onResolve: (i: any) => void; busy: boolean }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [remove, setRemove] = useState(false);
  return (
    <li className="bg-[var(--surface)] ring-1 ring-border p-5">
      <div className="flex items-start gap-3">
        <span className={`mt-1 size-2 rounded-full ${r.status === "open" ? "bg-[var(--crimson)] live-blink" : "bg-muted-foreground"}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)]">{r.target_type}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Status · {r.status}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</span>
            <span className="font-mono text-[10px] text-muted-foreground ml-auto">by {r.profiles?.display_name ?? "anonymous"}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed">{r.reason}</p>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">Target id · {r.target_id}</p>
          {r.status === "open" && (
            <div className="mt-4">
              {!open ? (
                <button onClick={() => setOpen(true)} className="px-3 py-1.5 ring-1 ring-border text-[11px] font-mono uppercase tracking-[0.25em] hover:bg-background">Review</button>
              ) : (
                <div className="space-y-3 border-t border-border pt-4">
                  <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Resolution notes (optional, max 400)" maxLength={400}
                    className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
                  <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={remove} onChange={(e) => setRemove(e.target.checked)} />Remove target content</label>
                  <div className="flex gap-2 flex-wrap">
                    <button disabled={busy} onClick={() => onResolve({ status: "resolved", notes, remove_target: remove })} className="bg-[var(--crimson)] text-white px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">Resolve</button>
                    <button disabled={busy} onClick={() => onResolve({ status: "dismissed", notes, remove_target: false })} className="ring-1 ring-border px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">Dismiss</button>
                    <button disabled={busy} onClick={() => setOpen(false)} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {r.resolution_notes && <p className="mt-3 text-[11px] text-muted-foreground italic">"{r.resolution_notes}"</p>}
        </div>
      </div>
    </li>
  );
}