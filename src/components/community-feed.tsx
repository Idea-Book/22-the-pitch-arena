import { useState, useMemo } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useRealtime } from "@/hooks/use-realtime";
import { listPostsPaged, listComments, listEpisodes } from "@/lib/content.functions";
import { createPost, createComment, toggleReaction, submitReport, deleteOwnPost } from "@/lib/community.functions";
import { postSchema } from "@/lib/schemas";

export function CommunityFeed() {
  const { user, loading } = useAuth();
  const [episodeId, setEpisodeId] = useState<string | "">("");
  const qc = useQueryClient();
  const { data: episodes = [] } = useQuery({
    queryKey: ["episodesPublic"],
    queryFn: () => listEpisodes(),
    staleTime: 5 * 60_000,
  });
  const feed = useInfiniteQuery({
    queryKey: ["communityPosts", episodeId],
    queryFn: ({ pageParam }) =>
      listPostsPaged({ data: { episode_id: episodeId || null, cursor: pageParam ?? null, limit: 15 } }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    staleTime: 30_000,
  });
  const posts = useMemo(() => feed.data?.pages.flatMap((p) => p.items) ?? [], [feed.data]);
  useRealtime("community_posts", [["communityPosts"], ["adminPosts"]]);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["communityPosts"] });

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-10">
      <div className="min-w-0">
        {user ? <Composer episodes={episodes} onPosted={invalidate} /> :
          <div className="bg-[var(--surface)] ring-1 ring-border p-6 mb-8">
            <p className="text-sm">Sign in to post, react, comment and report.</p>
            <Link to="/auth" className="inline-block mt-3 bg-[var(--crimson)] text-white px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em]">Sign in</Link>
          </div>}

        <div className="flex gap-2 mb-5 font-mono text-[10px] uppercase tracking-[0.25em] flex-wrap">
          <button onClick={() => setEpisodeId("")} className={`px-3 py-1.5 ring-1 ${episodeId === "" ? "ring-foreground bg-foreground text-background" : "ring-border text-muted-foreground"}`}>All</button>
          {episodes.slice(0, 6).map((e: any) => (
            <button key={e.id} onClick={() => setEpisodeId(e.id)} className={`px-3 py-1.5 ring-1 ${episodeId === e.id ? "ring-foreground bg-foreground text-background" : "ring-border text-muted-foreground"}`}>{e.round_code}</button>
          ))}
        </div>

        {loading || feed.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
          posts.length === 0 ? <p className="text-sm text-muted-foreground">No posts yet. Be the first.</p> :
          <>
            <ul className="space-y-4">{posts.map((p: any) => <PostCard key={p.id} p={p} currentUserId={user?.id} onChange={invalidate} />)}</ul>
            {feed.hasNextPage && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => feed.fetchNextPage()}
                  disabled={feed.isFetchingNextPage}
                  className="px-5 py-2.5 ring-1 ring-border hover:bg-background font-mono text-[10px] uppercase tracking-[0.3em] disabled:opacity-50"
                >
                  {feed.isFetchingNextPage ? "Loading…" : "Load more posts"}
                </button>
              </div>
            )}
          </>}
      </div>
      <aside className="text-sm text-muted-foreground space-y-4">
        <div className="bg-[var(--surface)] ring-1 ring-border p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)] mb-2">Mod queue</div>
          <p className="text-xs leading-relaxed">New posts land in the moderation queue. A mod approves them before they appear in the public feed. Reports notify mods instantly.</p>
        </div>
      </aside>
    </div>
  );
}


function Composer({ episodes, onPosted }: { episodes: any[]; onPosted: () => void }) {
  const [body, setBody] = useState("");
  const [episode_id, setEp] = useState<string>("");
  const [err, setErr] = useState("");
  const m = useMutation({
    mutationFn: (d: any) => createPost({ data: d }),
    onSuccess: () => { setBody(""); toast.success("Submitted — pending mod review"); onPosted(); },
    onError: (e: Error) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = postSchema.safeParse({ body, episode_id: episode_id || undefined });
    if (!p.success) { setErr(p.error.issues[0].message); return; }
    setErr(""); m.mutate(p.data);
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-5 mb-8">
      <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} placeholder="Drop your hot take…" className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
      {err && <p className="text-[10px] text-[var(--crimson)] font-mono mt-1">{err}</p>}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <select value={episode_id} onChange={(e) => setEp(e.target.value)} className="bg-background border border-border px-2 py-1.5 text-xs">
          <option value="">No episode</option>
          {episodes.map((e: any) => <option key={e.id} value={e.id}>{e.round_code} · {e.title.slice(0, 40)}</option>)}
        </select>
        <span className="font-mono text-[10px] text-muted-foreground">{body.length}/1000</span>
        <button disabled={m.isPending || body.length < 2} className="ml-auto bg-[var(--crimson)] text-white px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] disabled:opacity-40">{m.isPending ? "Posting…" : "Post"}</button>
      </div>
    </form>
  );
}

function PostCard({ p, currentUserId, onChange }: { p: any; currentUserId?: string; onChange: () => void }) {
  const [showComments, setShow] = useState(false);
  const react = useMutation({
    mutationFn: (kind: "fire" | "roast" | "clap") => toggleReaction({ data: { post_id: p.id, kind } }),
    onSuccess: onChange,
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: () => deleteOwnPost({ data: { id: p.id } }),
    onSuccess: () => { toast.success("Deleted"); onChange(); },
    onError: (e: Error) => toast.error(e.message),
  });
  function report() {
    const reason = prompt("Report this post. Reason (4-400 chars):");
    if (reason && reason.length >= 4) {
      submitReport({ data: { target_type: "post", target_id: p.id, reason } })
        .then(() => toast.success("Reported. Mods notified.")).catch((e: Error) => toast.error(e.message));
    }
  }
  return (
    <li className="bg-[var(--surface)] ring-1 ring-border p-5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-display text-base">{p.profiles?.display_name ?? "anon"}</span>
        <span className="font-mono text-[10px] text-muted-foreground">@{p.profiles?.handle ?? "—"}</span>
        {p.episodes && <Link to="/episodes/$slug" params={{ slug: p.episodes.slug }} className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--crimson)] hover:underline">↳ {p.episodes.round_code}</Link>}
        <span className="font-mono text-[10px] text-muted-foreground ml-auto">{new Date(p.created_at).toLocaleString("en-IN")}</span>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line mt-2">{p.body}</p>
      <div className="flex items-center gap-2 mt-4 flex-wrap font-mono text-[10px] uppercase tracking-[0.22em]">
        <button disabled={!currentUserId || react.isPending} onClick={() => react.mutate("fire")} className="px-2 py-1 ring-1 ring-border hover:bg-background disabled:opacity-40">🔥 Fire</button>
        <button disabled={!currentUserId || react.isPending} onClick={() => react.mutate("roast")} className="px-2 py-1 ring-1 ring-border hover:bg-background disabled:opacity-40">💀 Roast</button>
        <button disabled={!currentUserId || react.isPending} onClick={() => react.mutate("clap")} className="px-2 py-1 ring-1 ring-border hover:bg-background disabled:opacity-40">👏 Clap</button>
        <span className="text-muted-foreground">{p.reaction_count} reactions · {p.comment_count} comments</span>
        <button onClick={() => setShow((s) => !s)} className="ml-auto text-muted-foreground hover:text-foreground">{showComments ? "Hide" : "Comments"}</button>
        {currentUserId && currentUserId !== p.author_id && <button onClick={report} className="text-[var(--crimson)]">Report</button>}
        {currentUserId === p.author_id && <button onClick={() => { if (confirm("Delete?")) del.mutate(); }} className="text-[var(--crimson)]">Delete</button>}
      </div>
      {showComments && <Comments postId={p.id} currentUserId={currentUserId} onChange={onChange} />}
    </li>
  );
}

function Comments({ postId, currentUserId, onChange }: { postId: string; currentUserId?: string; onChange: () => void }) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["comments", postId], queryFn: () => listComments({ data: { post_id: postId } }) });
  const [body, setBody] = useState("");
  const m = useMutation({
    mutationFn: () => createComment({ data: { post_id: postId, body } }),
    onSuccess: () => { setBody(""); qc.invalidateQueries({ queryKey: ["comments", postId] }); onChange(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      {data.map((c: any) => (
        <div key={c.id} className="text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mr-2">{c.profiles?.handle ?? c.profiles?.display_name ?? "anon"}</span>{c.body}
        </div>
      ))}
      {currentUserId ? (
        <div className="flex gap-2">
          <input value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} placeholder="Reply…" className="flex-1 bg-background border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
          <button disabled={m.isPending || body.length < 1} onClick={() => m.mutate()} className="bg-foreground text-background px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] disabled:opacity-40">Reply</button>
        </div>
      ) : <p className="text-xs text-muted-foreground">Sign in to comment.</p>}
    </div>
  );
}