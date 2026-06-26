import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { adminListPosts, adminSetPostStatus, adminUpsertPost, adminDeletePost } from "@/lib/admin.functions";
import { listEpisodes } from "@/lib/content.functions";
import { AdminHeader, Field, inputCls } from "@/components/admin/admin-shell";
import { useRealtime } from "@/hooks/use-realtime";

export const Route = createFileRoute("/admin/posts")({ component: PostsAdmin });

const formSchema = z.object({
  body: z.string().trim().min(2, "Say something").max(1000, "Max 1000 chars"),
  media_url: z.string().url("Must be a URL").optional().or(z.literal("")),
  episode_id: z.string().optional().or(z.literal("")),
  status: z.enum(["live", "pending", "removed"]),
});
const empty = { body: "", media_url: "", episode_id: "", status: "live" as const };

function PostsAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["adminPosts"], queryFn: () => adminListPosts(), staleTime: 15_000 });
  const [editing, setEditing] = useState<any | null>(null);
  const [filter, setFilter] = useState<"pending" | "live" | "removed" | "all">("pending");

  useRealtime("community_posts", [["adminPosts"], ["communityPosts"]]);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["adminPosts"] }); qc.invalidateQueries({ queryKey: ["communityPosts"] }); };
  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: "live" | "removed" | "pending" }) => adminSetPostStatus({ data: v }),
    onSuccess: () => { toast.success("Updated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const save = useMutation({
    mutationFn: (p: any) => adminUpsertPost({ data: p }),
    onSuccess: () => { toast.success("Saved"); invalidate(); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeletePost({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const counts = useMemo(() => ({
    pending: data.filter((p: any) => p.status === "pending").length,
    live: data.filter((p: any) => p.status === "live").length,
    removed: data.filter((p: any) => p.status === "removed").length,
    all: data.length,
  }), [data]);
  const visible = filter === "all" ? data : data.filter((p: any) => p.status === filter);

  return (
    <>
      <AdminHeader title="Community posts" subtitle="Moderation queue — approve, hide or delete user submissions before they go public."
        actions={<button onClick={() => setEditing({ ...empty })} className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em]">+ New post</button>} />

      <div className="flex gap-2 mt-6 font-mono text-[10px] uppercase tracking-[0.25em] flex-wrap">
        {(["pending","live","removed","all"] as const).map(k => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 ring-1 ${filter === k ? "ring-foreground bg-foreground text-background" : "ring-border text-muted-foreground"}`}>
            {k} <span className="ml-1 opacity-60">{counts[k]}</span>
          </button>
        ))}
      </div>

      {editing && <PostForm initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} busy={save.isPending} />}

      {isLoading ? <p className="text-sm text-muted-foreground mt-6">Loading…</p> :
        visible.length === 0 ? <p className="text-sm text-muted-foreground mt-6">Nothing in this queue.</p> :
        <ul className="divide-y divide-border ring-1 ring-border mt-6">
          {visible.map((p: any) => (
            <li key={p.id} className="p-4 bg-background flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.profiles?.handle ?? p.profiles?.display_name ?? "anon"}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-0.5 ${p.status === "live" ? "bg-[var(--gold)]/20 text-[var(--gold)]" : p.status === "removed" ? "bg-[var(--crimson)]/20 text-[var(--crimson)]" : "bg-muted"}`}>{p.status}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">♥ {p.reaction_count} · 💬 {p.comment_count}</span>
                  <span className="font-mono text-[10px] text-muted-foreground ml-auto">{new Date(p.created_at).toLocaleString("en-IN")}</span>
                </div>
                <p className="text-sm leading-relaxed mt-2 whitespace-pre-line">{p.body}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => setEditing({ id: p.id, body: p.body, media_url: "", episode_id: "", status: p.status })} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Edit</button>
                {p.status !== "live" && <button disabled={setStatus.isPending} onClick={() => setStatus.mutate({ id: p.id, status: "live" })} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] hover:bg-[var(--surface)]">Approve</button>}
                {p.status !== "removed" && <button disabled={setStatus.isPending} onClick={() => setStatus.mutate({ id: p.id, status: "removed" })} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Hide</button>}
                <button onClick={() => { if (confirm("Delete this post permanently?")) del.mutate(p.id); }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Delete</button>
              </div>
            </li>
          ))}
        </ul>}
    </>
  );
}

function PostForm({ initial, onCancel, onSave, busy }: { initial: any; onCancel: () => void; onSave: (p: any) => void; busy: boolean }) {
  const [v, setV] = useState<any>(initial);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const { data: episodes = [] } = useQuery({ queryKey: ["episodesAll"], queryFn: () => listEpisodes() });
  function set(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = formSchema.safeParse(v);
    if (!parsed.success) { const x: any = {}; parsed.error.issues.forEach(i => x[i.path[0] as string] = i.message); setErrs(x); toast.error("Fix the highlighted fields"); return; }
    setErrs({});
    onSave({ ...parsed.data, id: v.id });
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4 mt-6">
      <h3 className="md:col-span-2 font-display text-2xl">{v.id ? "Edit post" : "New post"}</h3>
      <div className="md:col-span-2"><Field label="Body" hint={`${(v.body ?? "").length} / 1000`} error={errs.body}><textarea rows={5} className={inputCls} value={v.body} onChange={(e) => set("body", e.target.value)} /></Field></div>
      <Field label="Media URL (optional)" error={errs.media_url}><input className={inputCls} value={v.media_url ?? ""} onChange={(e) => set("media_url", e.target.value)} placeholder="https://" /></Field>
      <Field label="Linked episode (optional)" error={errs.episode_id}>
        <select className={inputCls} value={v.episode_id ?? ""} onChange={(e) => set("episode_id", e.target.value)}>
          <option value="">—</option>
          {episodes.map((ep: any) => <option key={ep.id} value={ep.id}>{ep.round_code} · {ep.title}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select className={inputCls} value={v.status} onChange={(e) => set("status", e.target.value)}>
          <option value="live">live (publish)</option>
          <option value="pending">pending</option>
          <option value="removed">removed (hidden)</option>
        </select>
      </Field>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
        <button disabled={busy} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}
