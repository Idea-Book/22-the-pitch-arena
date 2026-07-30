import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getEpisode } from "@/lib/content.functions";
import { episodeImage, panelistImage, founderImage } from "@/lib/asset-map";

export const Route = createFileRoute("/episodes/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Episode ${params.slug} — BKL Sharks` },
      { name: "description", content: `Full recap, pitch-control timeline and panelist verdicts for BKL Sharks episode ${params.slug}.` },
    ],
  }),
  loader: async ({ params, context }) => {
    const data = await context.queryClient.fetchQuery({
      queryKey: ["episode", params.slug],
      queryFn: () => getEpisode({ data: { slug: params.slug } }),
    });
    if (!data) throw notFound();
    return data;
  },
  component: EpisodeDetail,
});

function EpisodeDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({
    queryKey: ["episode", slug],
    queryFn: () => getEpisode({ data: { slug } }),
  });
  if (!data) return null;
  const { episode, panelists, founders } = data;
  const hero = episodeImage(episode.slug, (episode as any).hero_img);
  const recap = (episode.recap ?? "").split(/\n+/).filter(Boolean);
  // Pitch-control timeline is synthesized from panelist verdicts + investments
  const timeline = panelists
    .filter((row: any) => row.panelists && (row.verdict || row.investment_amount))
    .map((row: any, i: number) => ({
      t: `Lap ${String((i + 1) * 2).padStart(2, "0")}:00`,
      note: `${row.panelists.name} · ${row.verdict ?? "called it"}${row.investment_amount ? ` · ₹${Number(row.investment_amount).toLocaleString("en-IN")}` : ""}`,
    }));

  return (
    <section className="pt-24 pb-24">
      {/* HERO */}
      <div className="relative h-[68vh] min-h-[480px] overflow-hidden border-b border-border">
        <img src={hero} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-12">
          <div className="flex items-center gap-3 mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)]">
            <span>{episode.round_code}</span><span className="opacity-50">·</span>
            <span>{episode.city}</span><span className="opacity-50">·</span>
            <span>{episode.air_date ? new Date(episode.air_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "TBA"}</span>
            {episode.lap_time && (<><span className="opacity-50">·</span><span>Lap {episode.lap_time}</span></>)}
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl">{episode.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {episode.outcome && <span className="bg-[var(--crimson)] text-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em]">{episode.outcome}</span>}
            {episode.funded_label && <span className="bg-[var(--surface)] ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--gold)]">{episode.funded_label}</span>}
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Status · {episode.status}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.6fr_1fr] gap-12 pt-14">
        {/* RECAP + VIDEO */}
        <div>
          <h2 className="font-display text-3xl mb-5">Recap</h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {recap.length === 0 ? <p>No recap published yet.</p> : recap.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {/* VIDEO */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-3xl">Replay</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Highlight cut</span>
            </div>
            {episode.video_url ? (
              <div className="aspect-video bg-black ring-1 ring-border overflow-hidden">
                <iframe src={episode.video_url} className="size-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen title="Episode replay" />
              </div>
            ) : (
              <div className="aspect-video bg-[var(--surface)] ring-1 ring-border grid place-items-center text-center px-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">No replay uploaded</div>
                  <p className="font-display text-2xl mt-2">Highlight will drop 24 hours after air.</p>
                </div>
              </div>
            )}
          </div>

          {/* FOUNDERS */}
          <div className="mt-12">
            <h2 className="font-display text-3xl mb-5">Founders in the ring</h2>
            {founders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No founders attached.</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-px bg-border ring-1 ring-border">
                {founders.map((row: any) => {
                  const f = row.founders; if (!f) return null;
                  return (
                    <li key={f.id} className="bg-background p-5">
                      <div className="flex gap-4">
                        <img src={founderImage(f.slug, (f as any).headshot)} alt="" className="size-16 object-cover grayscale" />
                        <div className="flex-1">
                          <Link to="/founders/$slug" params={{ slug: f.slug }} className="font-display text-xl hover:text-[var(--crimson)]">{f.name}</Link>
                          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{f.startup} · {f.sector}</div>
                          {row.verdict && <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[var(--crimson)]">{row.verdict}</div>}
                          {row.feedback && <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">{row.feedback}</p>}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* SIDE: PANELISTS + TIMELINE */}
        <aside className="space-y-12">
          <div>
            <h2 className="font-display text-2xl mb-5">Sharks on the panel</h2>
            <ul className="space-y-3">
              {panelists.length === 0 && <li className="text-sm text-muted-foreground">No sharks attached.</li>}
              {panelists.map((row: any) => {
                const p = row.panelists; if (!p) return null;
                return (
                  <li key={p.id} className="bg-[var(--surface)] ring-1 ring-border p-4 flex items-center gap-3">
                    <img src={panelistImage(p.slug, (p as any).headshot)} alt="" className="size-12 object-cover" />
                    <div className="flex-1 min-w-0">
                      <Link to="/panelists/$slug" params={{ slug: p.slug }} className="font-display text-lg hover:text-[var(--crimson)] truncate block">{p.name}</Link>
                      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground truncate">{p.firm}</div>
                    </div>
                    <div className="text-right">
                      {row.verdict && <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--crimson)]">{row.verdict}</div>}
                      {row.investment_amount != null && <div className="font-mono text-xs text-[var(--gold)]">₹{Number(row.investment_amount).toLocaleString("en-IN")}</div>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl mb-5">Pitch-control timeline</h2>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">No timeline cues logged.</p>
            ) : (
              <ol className="relative pl-6 border-l border-border space-y-4">
                {timeline.map((t: any, i: number) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[27px] top-1 size-2 bg-[var(--crimson)]" />
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--crimson)]">{t.t ?? `Lap ${i + 1}`}</div>
                    <div className="text-sm mt-1 leading-relaxed">{t.note ?? t.event ?? t.what}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-14">
        <Link to="/episodes" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← All episodes</Link>
      </div>
    </section>
  );
}