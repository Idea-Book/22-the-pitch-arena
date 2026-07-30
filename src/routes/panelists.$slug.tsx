import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPanelist } from "@/lib/content.functions";
import { panelistImage, episodeImage } from "@/lib/asset-map";

export const Route = createFileRoute("/panelists/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Shark ${params.slug} — BKL Sharks` },
      { name: "description", content: `Bio, verdict stats and episode match history for BKL Sharks panelist ${params.slug}.` },
    ],
  }),
  loader: async ({ params, context }) => {
    const d = await context.queryClient.fetchQuery({
      queryKey: ["panelist", params.slug],
      queryFn: () => getPanelist({ data: { slug: params.slug } }),
    });
    if (!d) throw notFound();
    return d;
  },
  component: PanelistDetail,
});

function PanelistDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({ queryKey: ["panelist", slug], queryFn: () => getPanelist({ data: { slug } }) });
  if (!data) return null;
  const { panelist: p, matches } = data;
  const verdictCounts = matches.reduce<Record<string, number>>((acc, m: any) => {
    const v = (m.verdict ?? "—").toUpperCase(); acc[v] = (acc[v] ?? 0) + 1; return acc;
  }, {});
  const totalDeployed = matches.reduce((sum: number, m: any) => sum + (Number(m.investment_amount) || 0), 0);

  return (
    <section className="pt-24 pb-24">
      <div className="relative h-[60vh] min-h-[440px] overflow-hidden border-b border-border">
        <img src={panelistImage(p.slug, (p as any).headshot)} alt="" className="absolute inset-0 size-full object-cover grayscale opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">The Council · Shark Profile</span>
          <h1 className="font-display text-6xl md:text-8xl tracking-tight mt-3">{p.name}</h1>
          <div className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{p.firm} · {p.city}</div>
          {p.quote && <blockquote className="mt-6 font-display italic text-2xl text-[var(--silver)] max-w-2xl">"{p.quote}"</blockquote>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.5fr_1fr] gap-12 pt-14">
        <div>
          <h2 className="font-display text-3xl mb-4">Bio</h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">{p.bio || "No bio published."}</p>

          <h2 className="font-display text-3xl mt-12 mb-5">Episode match history</h2>
          {matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appearances logged.</p>
          ) : (
            <ul className="divide-y divide-border ring-1 ring-border">
              {matches.map((m: any, i: number) => {
                const e = m.episodes; if (!e) return null;
                return (
                  <li key={i} className="flex items-center gap-4 p-4 bg-background hover:bg-[var(--surface)] transition-colors">
                    <img src={episodeImage(e.slug, (e as any).hero_img)} alt="" className="size-14 object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{e.round_code} · {e.city}</div>
                      <Link to="/episodes/$slug" params={{ slug: e.slug }} className="font-display text-lg hover:text-[var(--crimson)] truncate block">{e.title}</Link>
                    </div>
                    <div className="text-right">
                      {m.verdict && <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--crimson)]">{m.verdict}</div>}
                      {m.investment_amount != null && <div className="font-mono text-xs text-[var(--gold)]">₹{Number(m.investment_amount).toLocaleString("en-IN")}</div>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-[var(--surface)] ring-1 ring-border p-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Record</h3>
            <div className="grid grid-cols-2 gap-px bg-border">
              <div className="bg-background p-4"><div className="font-display text-3xl text-[var(--gold)]">{p.record_wins}</div><div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Wins</div></div>
              <div className="bg-background p-4"><div className="font-display text-3xl text-[var(--crimson)]">{p.record_kos}</div><div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">KOs</div></div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground font-mono">
              <Row k="AUM" v={p.aum ?? "—"} />
              <Row k="Years" v={String(p.years ?? "—")} />
              <Row k="Deals" v={String(p.deals ?? "—")} />
              <Row k="Appetite" v={p.appetite ?? "—"} />
            </div>
          </div>

          <div className="bg-[var(--surface)] ring-1 ring-border p-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Verdict breakdown</h3>
            {Object.keys(verdictCounts).length === 0 ? (
              <p className="text-xs text-muted-foreground">No verdicts yet.</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(verdictCounts).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] w-32 text-muted-foreground">{k}</span>
                    <div className="flex-1 h-px bg-border"><div className="h-full bg-[var(--crimson)]" style={{ width: `${Math.min(100, (v / matches.length) * 100)}%` }} /></div>
                    <span className="font-mono text-xs w-8 text-right">{v}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 pt-4 border-t border-border flex justify-between font-mono text-xs">
              <span className="text-muted-foreground uppercase tracking-[0.25em] text-[10px]">Capital deployed</span>
              <span className="text-[var(--gold)]">₹{totalDeployed.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="bg-[var(--surface)] ring-1 ring-border p-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Roast meter</h3>
            <div className="flex items-baseline justify-between"><span className="font-display text-4xl text-[var(--crimson)]">{p.roast_meter}</span><span className="font-mono text-xs text-muted-foreground">/ 100</span></div>
            <div className="mt-3 h-1 bg-border overflow-hidden"><div className="h-full bg-[var(--crimson)]" style={{ width: `${p.roast_meter}%` }} /></div>
          </div>
        </aside>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-14">
        <Link to="/panelists" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← All sharks</Link>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3"><span className="uppercase tracking-[0.25em] text-[10px]">{k}</span><span className="text-foreground">{v}</span></div>;
}