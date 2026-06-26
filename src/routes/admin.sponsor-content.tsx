import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminListSponsorPackages, adminUpsertSponsorPackage, adminDeleteSponsorPackage,
  adminListSponsorPartners, adminUpsertSponsorPartner, adminDeleteSponsorPartner,
} from "@/lib/admin.functions";
import { AdminHeader, Field, inputCls } from "@/components/admin/admin-shell";
import { sponsorPackageSchema, sponsorPartnerSchema } from "@/lib/schemas";

export const Route = createFileRoute("/admin/sponsor-content")({ component: SponsorContentAdmin });

const emptyPkg = { tier: "", name: "", scope: "", price: "", units: "", color: "text-foreground", sort_order: 100, active: true };
const emptyPartner = { name: "", logo_url: "", website: "", sort_order: 100, active: true };

function SponsorContentAdmin() {
  return (
    <>
      <AdminHeader title="Sponsor information" subtitle="Manage public sponsorship packages and the S01 partner wall shown on /sponsors." />
      <Packages />
      <div className="h-12" />
      <Partners />
    </>
  );
}

function Packages() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["adminSponsorPackages"], queryFn: () => adminListSponsorPackages() });
  const [editing, setEditing] = useState<any | null>(null);
  const save = useMutation({
    mutationFn: (p: any) => adminUpsertSponsorPackage({ data: p }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["adminSponsorPackages"] }); qc.invalidateQueries({ queryKey: ["sponsorPackages"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteSponsorPackage({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["adminSponsorPackages"] }); qc.invalidateQueries({ queryKey: ["sponsorPackages"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <h2 className="font-display text-2xl">Packages</h2>
        <button onClick={() => setEditing({ ...emptyPkg })} className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em]">+ New package</button>
      </div>
      {editing && <PackageForm initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} busy={save.isPending} />}
      <ul className="divide-y divide-border ring-1 ring-border mt-4">
        {data.map((p: any) => (
          <li key={p.id} className="p-4 bg-background flex items-center gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)] w-10">{p.tier}</div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{p.name} {!p.active && <span className="text-xs text-muted-foreground">(hidden)</span>}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.price} · {p.units || "—"}</div>
            </div>
            <button onClick={() => setEditing(p)} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id); }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PackageForm({ initial, onCancel, onSave, busy }: { initial: any; onCancel: () => void; onSave: (p: any) => void; busy: boolean }) {
  const [v, setV] = useState<any>(initial);
  const [errs, setErrs] = useState<Record<string, string>>({});
  function set(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = sponsorPackageSchema.safeParse(v);
    if (!parsed.success) { const x: any = {}; parsed.error.issues.forEach(i => x[i.path[0] as string] = i.message); setErrs(x); toast.error("Fix the highlighted fields"); return; }
    setErrs({}); onSave(parsed.data);
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4 mt-4">
      <h3 className="md:col-span-2 font-display text-xl">{v.id ? "Edit package" : "New package"}</h3>
      <Field label="Tier code" error={errs.tier}><input className={inputCls} value={v.tier} onChange={(e) => set("tier", e.target.value)} placeholder="T1" /></Field>
      <Field label="Name" error={errs.name}><input className={inputCls} value={v.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Price" error={errs.price}><input className={inputCls} value={v.price} onChange={(e) => set("price", e.target.value)} placeholder="₹5.5 Cr" /></Field>
      <Field label="Units / availability"><input className={inputCls} value={v.units ?? ""} onChange={(e) => set("units", e.target.value)} placeholder="4 slots" /></Field>
      <Field label="Color accent class" hint="tailwind class, e.g. text-[var(--gold)]"><input className={inputCls} value={v.color ?? ""} onChange={(e) => set("color", e.target.value)} /></Field>
      <Field label="Sort order"><input type="number" className={inputCls} value={v.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></Field>
      <div className="md:col-span-2"><Field label="Scope" error={errs.scope}><textarea rows={3} className={inputCls} value={v.scope} onChange={(e) => set("scope", e.target.value)} /></Field></div>
      <label className="md:col-span-2 flex items-center gap-2 text-xs font-mono"><input type="checkbox" checked={!!v.active} onChange={(e) => set("active", e.target.checked)} /> Active (visible on site)</label>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
        <button disabled={busy} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}

function Partners() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["adminSponsorPartners"], queryFn: () => adminListSponsorPartners() });
  const [editing, setEditing] = useState<any | null>(null);
  const save = useMutation({
    mutationFn: (p: any) => adminUpsertSponsorPartner({ data: p }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["adminSponsorPartners"] }); qc.invalidateQueries({ queryKey: ["sponsorPartners"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteSponsorPartner({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["adminSponsorPartners"] }); qc.invalidateQueries({ queryKey: ["sponsorPartners"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <h2 className="font-display text-2xl">Partner wall</h2>
        <button onClick={() => setEditing({ ...emptyPartner })} className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em]">+ New partner</button>
      </div>
      {editing && <PartnerForm initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} busy={save.isPending} />}
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border ring-1 ring-border mt-4">
        {data.map((p: any) => (
          <li key={p.id} className="bg-background p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-display text-base truncate">{p.name} {!p.active && <span className="text-xs text-muted-foreground">(hidden)</span>}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">sort {p.sort_order}</div>
            </div>
            <button onClick={() => setEditing(p)} className="ring-1 ring-border px-2 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id); }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-2 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">×</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PartnerForm({ initial, onCancel, onSave, busy }: { initial: any; onCancel: () => void; onSave: (p: any) => void; busy: boolean }) {
  const [v, setV] = useState<any>(initial);
  const [errs, setErrs] = useState<Record<string, string>>({});
  function set(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = sponsorPartnerSchema.safeParse(v);
    if (!parsed.success) { const x: any = {}; parsed.error.issues.forEach(i => x[i.path[0] as string] = i.message); setErrs(x); toast.error("Fix the highlighted fields"); return; }
    setErrs({}); onSave(parsed.data);
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4 mt-4">
      <h3 className="md:col-span-2 font-display text-xl">{v.id ? "Edit partner" : "New partner"}</h3>
      <Field label="Name" error={errs.name}><input className={inputCls} value={v.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Sort order"><input type="number" className={inputCls} value={v.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></Field>
      <Field label="Logo URL (optional)" error={errs.logo_url}><input className={inputCls} value={v.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://" /></Field>
      <Field label="Website (optional)" error={errs.website}><input className={inputCls} value={v.website ?? ""} onChange={(e) => set("website", e.target.value)} placeholder="https://" /></Field>
      <label className="md:col-span-2 flex items-center gap-2 text-xs font-mono"><input type="checkbox" checked={!!v.active} onChange={(e) => set("active", e.target.checked)} /> Active</label>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
        <button disabled={busy} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}
