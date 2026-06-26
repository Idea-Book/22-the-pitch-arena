import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminListPosts, adminSetPostStatus } from "@/lib/admin.functions";
import { AdminHeader } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin/posts")({
  component: PostsAdmin,
});

function PostsAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["adminPosts"], queryFn: () => adminListPosts() });
  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: "live" | "removed" | "pending" }) => adminSetPostStatus({ data: v }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["adminPosts"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title="Community posts" subtitle="Approve, hide or restore feed posts." />
      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
        <ul className="divide-y divide-border ring-1 ring-border">
          {data.map((p: any) => (
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
              <div className="flex flex-col gap-1">
                {p.status !== "live" && <button disabled={setStatus.isPending} onClick={() => setStatus.mutate({ id: p.id, status: "live" })} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] hover:bg-[var(--surface)]">Approve</button>}
                {p.status !== "removed" && <button disabled={setStatus.isPending} onClick={() => setStatus.mutate({ id: p.id, status: "removed" })} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Hide</button>}
              </div>
            </li>
          ))}
        </ul>}
    </>
  );
}