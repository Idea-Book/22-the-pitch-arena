import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listFounders } from "@/lib/content.functions";
import { adminUpsertFounder, adminDeleteFounder } from "@/lib/admin.functions";
import { AdminHeader, Field, inputCls } from "@/components/admin/admin-shell";
import { founderUpsertSchema } from "@/lib/schemas";

export const Route = createFileRoute("/admin/founders")({ component: FoundersAdmin });

const STATUS = ["active","eliminated","champion","withdrew"];
const empty = { slug: "", name: "", startup: "", sector: "", city: "", stage: "", ask: "", valuation: "", traction: "", bio: "", headshot: "", position: 0, position_delta: "—", heat: 50, funded_label: "", status: "active" };

function FoundersAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["foundersAll"], queryFn: () => listFounders() });
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: (p: any) => adminUpsertFounder({ data: p }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["foundersAll"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteFounder({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["foundersAll"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title="Founders" subtitle="Manage the grid roster."
        actions={<button onClick={() => setEditing({ ...empty })} className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em]">+ New founder</button>} />

      {editing && <Form initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} busy={save.isPending} />}

      <ul className="divide-y divide-border ring-1 ring-border mt-6">
        {data.map((f: any) => (
          <li key={f.id} className="p-4 bg-background flex items-center gap-4">
            <div className="font-display text-2xl tabular-nums w-12 text-[var(--gold)]">{String(f.position ?? "—").padStart(2, "0")}</div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{f.name} · <span className="text-muted-foreground">{f.startup}</span></div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{f.sector} · {f.city} · {f.status}</div>
            </div>
            <button onClick={() => setEditing(f)} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${f.name}"?`)) del.mutate(f.id); }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Delete</button>
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
    const parsed = founderUpsertSchema.safeParse(v);
    if (!parsed.success) {
      const e2: any = {}; parsed.error.issues.forEach(i => { e2[i.path[0] as string] = i.message; });
      setErrs(e2); toast.error("Fix the highlighted fields"); return;
    }
    setErrs({}); onSave(parsed.data);
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4">
      <h3 className="md:col-span-2 font-display text-2xl">{v.id ? "Edit founder" : "New founder"}</h3>
      <Field label="Slug" error={errs.slug}><input className={inputCls} value={v.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
      <Field label="Name" error={errs.name}><input className={inputCls} value={v.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Startup" error={errs.startup}><input className={inputCls} value={v.startup} onChange={(e) => set("startup", e.target.value)} /></Field>
      <Field label="Sector tags (comma)"><input className={inputCls} value={v.sector ?? ""} onChange={(e) => set("sector", e.target.value)} /></Field>
      <Field label="City"><input className={inputCls} value={v.city ?? ""} onChange={(e) => set("city", e.target.value)} /></Field>
      <Field label="Stage"><input className={inputCls} value={v.stage ?? ""} onChange={(e) => set("stage", e.target.value)} /></Field>
      <Field label="Ask"><input className={inputCls} value={v.ask ?? ""} onChange={(e) => set("ask", e.target.value)} /></Field>
      <Field label="Valuation"><input className={inputCls} value={v.valuation ?? ""} onChange={(e) => set("valuation", e.target.value)} /></Field>
      <Field label="Position"><input type="number" min={1} className={inputCls} value={v.position ?? 0} onChange={(e) => set("position", Number(e.target.value))} /></Field>
      <Field label="Position delta"><input className={inputCls} value={v.position_delta} onChange={(e) => set("position_delta", e.target.value)} /></Field>
      <Field label="Heat (0-100)"><input type="number" min={0} max={100} className={inputCls} value={v.heat} onChange={(e) => set("heat", Number(e.target.value))} /></Field>
      <Field label="Status"><select className={inputCls} value={v.status} onChange={(e) => set("status", e.target.value)}>{STATUS.map(s => <option key={s}>{s}</option>)}</select></Field>
      <Field label="Funded label"><input className={inputCls} value={v.funded_label ?? ""} onChange={(e) => set("funded_label", e.target.value)} /></Field>
      <Field label="Headshot URL"><input className={inputCls} value={v.headshot ?? ""} onChange={(e) => set("headshot", e.target.value)} /></Field>
      <div className="md:col-span-2"><Field label="Traction"><input className={inputCls} value={v.traction ?? ""} onChange={(e) => set("traction", e.target.value)} /></Field></div>
      <div className="md:col-span-2"><Field label="Bio"><textarea rows={4} className={inputCls} value={v.bio ?? ""} onChange={(e) => set("bio", e.target.value)} /></Field></div>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
        <button disabled={busy} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}