import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { adminListUsers, adminSetRole, adminListBans, adminBanUser, adminLiftBan } from "@/lib/admin.functions";
import { AdminHeader } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin/users")({ component: UsersPage });

function UsersPage() {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ["adminUsers"], queryFn: () => adminListUsers() });
  const { data: bans = [] } = useQuery({ queryKey: ["adminBans"], queryFn: () => adminListBans() });
  const [filter, setFilter] = useState("");

  const role = useMutation({
    mutationFn: (v: { user_id: string; role: "admin" | "moderator" | "user"; grant: boolean }) => adminSetRole({ data: v }),
    onSuccess: () => { toast.success("Role updated"); qc.invalidateQueries({ queryKey: ["adminUsers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const ban = useMutation({
    mutationFn: (v: { user_id: string; reason: string; expires_at?: string }) => adminBanUser({ data: v }),
    onSuccess: () => { toast.success("User banned"); qc.invalidateQueries({ queryKey: ["adminBans"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const lift = useMutation({
    mutationFn: (id: string) => adminLiftBan({ data: { id } }),
    onSuccess: () => { toast.success("Ban lifted"); qc.invalidateQueries({ queryKey: ["adminBans"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const visible = users.filter((u: any) =>
    !filter || (u.display_name ?? "").toLowerCase().includes(filter.toLowerCase()) || (u.handle ?? "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="Users & roles" subtitle="Promote moderators, grant admin access, manage bans." />
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name or handle" className="w-full bg-background border border-border px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
      <ul className="divide-y divide-border ring-1 ring-border mb-10">
        {visible.map((u: any) => (
          <li key={u.id} className="p-4 bg-background flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{u.display_name ?? "—"}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{u.handle ?? u.id}</div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {(["admin","moderator"] as const).map(rl => {
                const has = u.roles.includes(rl);
                return (
                  <button key={rl} disabled={role.isPending}
                    onClick={() => role.mutate({ user_id: u.id, role: rl, grant: !has })}
                    className={`ring-1 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] ${has ? "ring-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10" : "ring-border text-muted-foreground"}`}>
                    {has ? "✓ " : "+ "}{rl}
                  </button>
                );
              })}
              <button onClick={() => {
                const reason = prompt(`Ban ${u.display_name}? Enter reason (min 2 chars):`);
                if (reason && reason.trim().length >= 2) ban.mutate({ user_id: u.id, reason: reason.trim() });
              }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Ban</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="font-display text-2xl mt-10 mb-3">Active bans</h2>
      {bans.length === 0 ? <p className="text-sm text-muted-foreground">None.</p> :
        <ul className="divide-y divide-border ring-1 ring-border">
          {bans.map((b: any) => (
            <li key={b.id} className="p-4 bg-background flex items-center gap-4">
              <div className="flex-1">
                <div className="font-display text-lg">{b.profiles?.display_name ?? b.user_id}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{b.reason}</div>
              </div>
              <button onClick={() => { if (confirm("Lift this ban?")) lift.mutate(b.id); }} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Lift</button>
            </li>
          ))}
        </ul>}
    </>
  );
}