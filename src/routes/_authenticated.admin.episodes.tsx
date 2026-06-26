import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listEpisodes } from "@/lib/content.functions";
import { adminUpsertEpisode, adminDeleteEpisode } from "@/lib/admin.functions";
import { AdminHeader, Field, inputCls } from "@/components/admin/admin-shell";
import { episodeUpsertSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/admin/episodes")({ component: EpisodesAdmin });

const OUTCOMES = ["TERMINATED","TERM SHEET","VIRAL","STANDING OVATION","WALK-OFF"];
const STATUSES = ["draft","scheduled","aired"];
const empty = { slug: "", round_code: "", title: "", city: "", sector: "", air_date: "", lap_time: "", outcome: "", recap: "", hero_img: "", video_url: "", funded_label: "", status: "aired" };

function EpisodesAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["episodesAll"], queryFn: () => listEpisodes() });
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: (payload: any) => adminUpsertEpisode({ data: payload }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["episodesAll"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteEpisode({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["episodesAll"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title="Episodes" subtitle="Create, edit and delete race vault entries."
        actions={<button onClick={() => setEditing({ ...empty })} className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em]">+ New episode</button>} />

      {editing && <EpisodeForm initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} busy={save.isPending} />}

      <ul className="divide-y divide-border ring-1 ring-border mt-6">
        {data.map((e: any) => (
          <li key={e.id} className="p-4 bg-background flex items-center gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)] w-14">{e.round_code}</div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{e.title}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{e.city} · {e.outcome ?? "—"} · {e.status}</div>
            </div>
            <button onClick={() => setEditing(e)} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${e.title}"?`)) del.mutate(e.id); }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function EpisodeForm({ initial, onCancel, onSave, busy }: { initial: any; onCancel: () => void; onSave: (p: any) => void; busy: boolean }) {
  const [v, setV] = useState<any>(initial);
  const [errs, setErrs] = useState<Record<string, string>>({});
  function set(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = { ...v };
    if (!cleaned.outcome) delete cleaned.outcome;
    const parsed = episodeUpsertSchema.safeParse(cleaned);
    if (!parsed.success) {
      const e2: any = {}; parsed.error.issues.forEach(i => { e2[i.path[0] as string] = i.message; });
      setErrs(e2); toast.error("Fix the highlighted fields"); return;
    }
    setErrs({}); onSave(parsed.data);
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4">
      <h3 className="md:col-span-2 font-display text-2xl">{v.id ? "Edit episode" : "New episode"}</h3>
      <Field label="Slug" error={errs.slug}><input className={inputCls} value={v.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
      <Field label="Round code" error={errs.round_code}><input className={inputCls} value={v.round_code} onChange={(e) => set("round_code", e.target.value)} /></Field>
      <Field label="Title" error={errs.title}><input className={inputCls} value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="City" error={errs.city}><input className={inputCls} value={v.city} onChange={(e) => set("city", e.target.value)} /></Field>
      <Field label="Sector"><input className={inputCls} value={v.sector ?? ""} onChange={(e) => set("sector", e.target.value)} /></Field>
      <Field label="Air date"><input type="date" className={inputCls} value={v.air_date ?? ""} onChange={(e) => set("air_date", e.target.value)} /></Field>
      <Field label="Lap time"><input className={inputCls} value={v.lap_time ?? ""} onChange={(e) => set("lap_time", e.target.value)} /></Field>
      <Field label="Funded label"><input className={inputCls} value={v.funded_label ?? ""} onChange={(e) => set("funded_label", e.target.value)} /></Field>
      <Field label="Outcome">
        <select className={inputCls} value={v.outcome ?? ""} onChange={(e) => set("outcome", e.target.value)}>
          <option value="">—</option>
          {OUTCOMES.map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select className={inputCls} value={v.status} onChange={(e) => set("status", e.target.value)}>
          {STATUSES.map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Video URL (embed)" error={errs.video_url}><input className={inputCls} value={v.video_url ?? ""} onChange={(e) => set("video_url", e.target.value)} /></Field>
      <Field label="Hero image URL"><input className={inputCls} value={v.hero_img ?? ""} onChange={(e) => set("hero_img", e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="Recap" error={errs.recap}><textarea rows={5} className={inputCls} value={v.recap ?? ""} onChange={(e) => set("recap", e.target.value)} /></Field>
      </div>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
        <button disabled={busy} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}