import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-shell";
import {
  adminListPanelistInvitations,
  adminUpdatePanelistInvitation,
  adminPromoteInvitationToPanelist,
  adminDeletePanelistInvitation,
} from "@/lib/invitations.functions";

export const Route = createFileRoute("/admin/invitations")({
  component: InvitationsAdmin,
});

const STATUSES = ["new", "reviewing", "accepted", "rejected", "archived"] as const;
type Status = (typeof STATUSES)[number];

function InvitationsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-panelist-invites"],
    queryFn: () => adminListPanelistInvitations(),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-panelist-invites"] });

  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: Status }) => adminUpdatePanelistInvitation({ data: v }),
    onSuccess: () => { toast.success("Updated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const promote = useMutation({
    mutationFn: (id: string) => adminPromoteInvitationToPanelist({ data: { id } }),
    onSuccess: () => { toast.success("Panelist created from nomination"); invalidate(); qc.invalidateQueries({ queryKey: ["panelists"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeletePanelistInvitation({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data.filter((r: any) => filter === "all" || r.status === filter);

  return (
    <>
      <AdminHeader
        title="Panelist invitations"
        subtitle="Nominations submitted via /invite-panelist. Accept to create a live panelist record."
        actions={
          <div className="flex flex-wrap gap-1 font-mono text-[10px] uppercase tracking-[0.25em]">
            {(["all", ...STATUSES] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 ring-1 ${filter === f ? "ring-foreground bg-foreground text-background" : "ring-border text-muted-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />
      {isLoading ? (
        <div className="space-y-px">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 bg-[var(--surface)] animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No nominations yet.</p>
      ) : (
        <ul className="divide-y divide-border ring-1 ring-border">
          {rows.map((r: any) => (
            <Row
              key={r.id}
              r={r}
              busy={setStatus.isPending || promote.isPending || del.isPending}
              onStatus={(status: Status) => setStatus.mutate({ id: r.id, status })}
              onPromote={() => promote.mutate(r.id)}
              onDelete={() => { if (confirm(`Delete nomination for ${r.nominee_name}?`)) del.mutate(r.id); }}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function Row({ r, busy, onStatus, onPromote, onDelete }: {
  r: any; busy: boolean; onStatus: (s: Status) => void; onPromote: () => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="bg-background p-4">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <Cell label="Nominee" value={r.nominee_name} />
          <Cell label="Firm" value={r.firm} />
          <Cell label="City" value={r.city} />
          <Cell label="Nominated by" value={`${r.nominator_name}${r.nominator_is_panelist ? " · panelist" : ""}`} />
          <Cell label="Status" value={r.status} />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
          <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 ring-1 ring-border text-muted-foreground">
            {open ? "Hide" : "View"}
          </button>
          <button disabled={busy || !!r.created_panelist_id} onClick={onPromote}
            className="px-3 py-1.5 bg-[var(--crimson)] text-white disabled:opacity-40">
            {r.created_panelist_id ? "Added" : "Accept → panelist"}
          </button>
          <select
            value={r.status}
            disabled={busy}
            onChange={(e) => onStatus(e.target.value as Status)}
            className="bg-background border border-border px-2 py-1.5 text-[10px] uppercase tracking-[0.2em]"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button disabled={busy} onClick={onDelete} className="px-3 py-1.5 ring-1 ring-border text-[var(--crimson)]">
            Delete
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-5 grid md:grid-cols-2 gap-6 text-sm border-t border-border pt-5">
          <div className="space-y-2">
            <Detail label="Nominee email" value={r.nominee_email} />
            <Detail label="Phone" value={r.nominee_phone} />
            <Detail label="Title" value={r.title} />
            <Detail label="Expertise" value={r.expertise} />
            <Detail label="Sectors" value={r.sectors} />
            <Detail label="Ticket size" value={r.ticket_size} />
            <Detail label="AUM" value={r.aum} />
            <Detail label="Years" value={r.years_experience} />
            <Detail label="Availability" value={r.availability} />
          </div>
          <div className="space-y-2">
            <Detail label="Referrer email" value={r.nominator_email} />
            <Detail label="Referrer role" value={r.nominator_role} />
            <Detail label="Relationship" value={r.relationship} />
            <Detail label="LinkedIn" value={r.linkedin_url} link />
            <Detail label="Website" value={r.website_url} link />
            <Detail label="Headshot" value={r.headshot_url} link />
            <Detail label="Quote" value={r.quote} />
            <Detail label="Notable deals" value={r.notable_deals} />
          </div>
          <div className="md:col-span-2 space-y-3">
            <Detail label="Bio" value={r.bio} />
            <Detail label="Why they fit" value={r.why_fit} />
          </div>
        </div>
      )}
    </li>
  );
}

function Cell({ label, value }: { label: string; value: any }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="truncate">{value ? String(value) : "—"}</div>
    </div>
  );
}

function Detail({ label, value, link }: { label: string; value: any; link?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      {link && value ? (
        <a href={String(value)} target="_blank" rel="noreferrer" className="text-[var(--electric)] underline break-all">
          {String(value)}
        </a>
      ) : (
        <div className="leading-relaxed whitespace-pre-wrap">{value ? String(value) : "—"}</div>
      )}
    </div>
  );
}
