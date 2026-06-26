import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { adminListSubmissions, adminUpdateSubmissionStatus } from "@/lib/admin.functions";
import { AdminHeader } from "./admin-shell";

const STATUSES = ["new","reviewing","accepted","rejected","archived"] as const;
type Status = typeof STATUSES[number];

export function SubmissionsList({ table, title, subtitle, columns, expand }: {
  table: "applications" | "ticket_inquiries" | "sponsor_inquiries";
  title: string; subtitle?: string;
  columns: { key: string; label: string }[];
  expand?: (row: any) => React.ReactNode;
}) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-sub", table],
    queryFn: () => adminListSubmissions({ data: { table } }),
  });
  const filtered = data.filter((r: any) => filter === "all" || r.status === filter);

  const upd = useMutation({
    mutationFn: (v: { id: string; status: Status; notes?: string }) => adminUpdateSubmissionStatus({ data: { table, ...v } }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-sub", table] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title={title} subtitle={subtitle}
        actions={
          <div className="flex flex-wrap gap-1 font-mono text-[10px] uppercase tracking-[0.25em]">
            {(["all", ...STATUSES] as const).map(f => (
              <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 ring-1 ${filter === f ? "ring-foreground bg-foreground text-background" : "ring-border text-muted-foreground"}`}>{f}</button>
            ))}
          </div>
        } />
      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
        filtered.length === 0 ? <p className="text-sm text-muted-foreground">No entries.</p> :
        <ul className="divide-y divide-border ring-1 ring-border">
          {filtered.map((r: any) => <Row key={r.id} r={r} columns={columns} expand={expand} onStatus={(status: Status) => upd.mutate({ id: r.id, status })} busy={upd.isPending} />)}
        </ul>}
    </>
  );
}

function Row({ r, columns, expand, onStatus, busy }: any) {
  const [open, setOpen] = useState(false);
  return (
    <li className="bg-background p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {columns.map((c: any) => (
            <div key={c.key} className="min-w-0">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{c.label}</div>
              <div className="truncate">{String(r[c.key] ?? "—")}</div>
            </div>
          ))}
        </div>
        <span className={`font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-0.5 ring-1 ring-border ${r.status === "accepted" ? "text-[var(--gold)]" : r.status === "rejected" ? "text-[var(--crimson)]" : ""}`}>{r.status}</span>
        <div className="flex gap-1">
          {["reviewing","accepted","rejected","archived"].map((s) => (
            <button key={s} disabled={busy || r.status === s} onClick={() => onStatus(s)} className="ring-1 ring-border px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] disabled:opacity-30 hover:bg-[var(--surface)]">{s}</button>
          ))}
        </div>
        {expand && <button onClick={() => setOpen(o => !o)} className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">{open ? "Hide" : "Open"}</button>}
      </div>
      {open && expand && <div className="mt-4 pt-4 border-t border-border">{expand(r)}</div>}
      <div className="mt-2 font-mono text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</div>
    </li>
  );
}