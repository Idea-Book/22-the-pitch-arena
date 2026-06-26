import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listPanelists } from "@/lib/content.functions";
import { adminUpsertPanelist, adminDeletePanelist } from "@/lib/admin.functions";
import { AdminHeader, Field, inputCls } from "@/components/admin/admin-shell";
import { panelistUpsertSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/admin/panelists")({ component: PanelistsAdmin });

const empty = { slug: "", name: "", tag: "", aka: "", firm: "", city: "", bio: "", quote: "", headshot: "", roast_meter: 50, appetite: "", record_wins: 0, record_kos: 0, aum: "", years: 0, deals: 0 };

function PanelistsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["panelistsAll"], queryFn: () => listPanelists() });
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: (payload: any) => adminUpsertPanelist({ data: payload }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["panelistsAll"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeletePanelist({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["panelistsAll"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title="Panelists" subtitle="Manage The Council roster."
        actions={<button onClick={() => setEditing({ ...empty })} className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em]">+ New shark</button>} />

      {editing && <Form initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} busy={save.isPending} />}

      <ul className="divide-y divide-border ring-1 ring-border mt-6">
        {data.map((p: any) => (
          <li key={p.id} className="p-4 bg-background flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{p.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.firm} · W {p.record_wins} / KO {p.record_kos}</div>
            </div>
            <button onClick={() => setEditing(p)} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id); }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Form({ initial, onCancel, onSave, busy }: { initial: any; onCancel: () => void; onSave: (p: any) => void; busy: boolean }) {
  const [v, setV] = useState<any>(initial);
  const [errs, setErrs] = useState<Record<string, string>>({});
  function set(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = panelistUpsertSchema.safeParse(v);
    if (!parsed.success) {
      const e2: any = {}; parsed.error.issues.forEach(i => { e2[i.path[0] as string] = i.message; });
      setErrs(e2); toast.error("Fix the highlighted fields"); return;
    }
    setErrs({}); onSave(parsed.data);
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4">
      <h3 className="md:col-span-2 font-display text-2xl">{v.id ? "Edit shark" : "New shark"}</h3>
      <Field label="Slug" error={errs.slug}><input className={inputCls} value={v.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
      <Field label="Name" error={errs.name}><input className={inputCls} value={v.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Tag"><input className={inputCls} value={v.tag ?? ""} onChange={(e) => set("tag", e.target.value)} /></Field>
      <Field label="Aka"><input className={inputCls} value={v.aka ?? ""} onChange={(e) => set("aka", e.target.value)} /></Field>
      <Field label="Firm"><input className={inputCls} value={v.firm ?? ""} onChange={(e) => set("firm", e.target.value)} /></Field>
      <Field label="City"><input className={inputCls} value={v.city ?? ""} onChange={(e) => set("city", e.target.value)} /></Field>
      <Field label="AUM"><input className={inputCls} value={v.aum ?? ""} onChange={(e) => set("aum", e.target.value)} /></Field>
      <Field label="Appetite"><input className={inputCls} value={v.appetite ?? ""} onChange={(e) => set("appetite", e.target.value)} /></Field>
      <Field label="Roast meter (0-100)"><input type="number" min={0} max={100} className={inputCls} value={v.roast_meter} onChange={(e) => set("roast_meter", Number(e.target.value))} /></Field>
      <Field label="Years"><input type="number" min={0} className={inputCls} value={v.years ?? 0} onChange={(e) => set("years", Number(e.target.value))} /></Field>
      <Field label="Deals"><input type="number" min={0} className={inputCls} value={v.deals ?? 0} onChange={(e) => set("deals", Number(e.target.value))} /></Field>
      <Field label="Wins"><input type="number" min={0} className={inputCls} value={v.record_wins} onChange={(e) => set("record_wins", Number(e.target.value))} /></Field>
      <Field label="KOs"><input type="number" min={0} className={inputCls} value={v.record_kos} onChange={(e) => set("record_kos", Number(e.target.value))} /></Field>
      <Field label="Headshot URL"><input className={inputCls} value={v.headshot ?? ""} onChange={(e) => set("headshot", e.target.value)} /></Field>
      <div className="md:col-span-2"><Field label="Quote"><input className={inputCls} value={v.quote ?? ""} onChange={(e) => set("quote", e.target.value)} /></Field></div>
      <div className="md:col-span-2"><Field label="Bio"><textarea rows={4} className={inputCls} value={v.bio ?? ""} onChange={(e) => set("bio", e.target.value)} /></Field></div>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
        <button disabled={busy} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}