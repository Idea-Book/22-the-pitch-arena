import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getFounder } from "@/lib/content.functions";
import { founderImage, episodeImage } from "@/lib/asset-map";

export const Route = createFileRoute("/founders/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Founder ${params.slug} — BKL Sharks` },
      { name: "description", content: `Pitch history, investor feedback and leaderboard position for BKL Sharks founder ${params.slug}.` },
    ],
  }),
  loader: async ({ params, context }) => {
    const d = await context.queryClient.fetchQuery({
      queryKey: ["founder", params.slug],
      queryFn: () => getFounder({ data: { slug: params.slug } }),
    });
    if (!d) throw notFound();
    return d;
  },
  component: FounderDetail,
});

function FounderDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({ queryKey: ["founder", slug], queryFn: () => getFounder({ data: { slug } }) });
  if (!data) return null;
  const { founder: f, appearances } = data;
  const tags = (f.sector ?? "").split(/[,/]/).map((s: string) => s.trim()).filter(Boolean);
  const feedback = appearances.filter((a: any) => a.feedback).map((a: any) => ({ ep: a.episodes, text: a.feedback }));

  return (
    <section className="pt-24 pb-24">
      <div className="relative h-[58vh] min-h-[420px] overflow-hidden border-b border-border">
        <img src={founderImage(f.slug)} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">Founder profile · Grid {f.position ?? "—"}</span>
          <h1 className="font-display text-6xl md:text-8xl tracking-tight mt-3">{f.name}</h1>
          <div className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{f.startup} · {f.city}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t: string) => <span key={t} className="bg-[var(--surface)] ring-1 ring-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">{t}</span>)}
            {f.stage && <span className="bg-[var(--crimson)] text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">{f.stage}</span>}
            {f.funded_label && <span className="bg-[var(--gold)] text-black px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">{f.funded_label}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.6fr_1fr] gap-12 pt-14">
        <div>
          <h2 className="font-display text-3xl mb-4">About the build</h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">{f.bio || "No bio published."}</p>
          {f.traction && (
            <div className="mt-6 bg-[var(--surface)] ring-1 ring-border p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Live traction snapshot</div>
              <p className="text-sm text-foreground">{f.traction}</p>
            </div>
          )}

          <h2 className="font-display text-3xl mt-12 mb-5">Pitch history</h2>
          {appearances.length === 0 ? (
            <p className="text-sm text-muted-foreground">Not yet on the grid.</p>
          ) : (
            <ul className="divide-y divide-border ring-1 ring-border">
              {appearances.map((a: any, i: number) => {
                const e = a.episodes; if (!e) return null;
                return (
                  <li key={i} className="flex items-center gap-4 p-4 bg-background">
                    <img src={episodeImage(e.slug)} alt="" className="size-14 object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{e.round_code} · {e.city}{e.air_date ? ` · ${new Date(e.air_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}` : ""}</div>
                      <Link to="/episodes/$slug" params={{ slug: e.slug }} className="font-display text-lg hover:text-[var(--crimson)] truncate block">{e.title}</Link>
                    </div>
                    {a.verdict && <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--crimson)]">{a.verdict}</div>}
                  </li>
                );
              })}
            </ul>
          )}

          <h2 className="font-display text-3xl mt-12 mb-5">Investor feedback summary</h2>
          {feedback.length === 0 ? (
            <p className="text-sm text-muted-foreground">No panel feedback yet.</p>
          ) : (
            <ul className="space-y-3">
              {feedback.map((fb, i) => (
                <li key={i} className="bg-[var(--surface)] ring-1 ring-border p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">From · {fb.ep?.title ?? "Episode"}</div>
                  <p className="text-sm leading-relaxed">{fb.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-[var(--surface)] ring-1 ring-border p-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Leaderboard</h3>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-7xl tabular-nums">{String(f.position ?? "—").padStart(2, "0")}</span>
              <span className="font-mono text-sm text-[var(--gold)]">{f.position_delta}</span>
            </div>
            <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Audience heat</div>
            <div className="mt-2 h-1 bg-border overflow-hidden"><div className="h-full bg-[var(--crimson)]" style={{ width: `${f.heat}%` }} /></div>
            <div className="font-mono text-xs mt-1">{f.heat}/100</div>
          </div>
          <div className="bg-[var(--surface)] ring-1 ring-border p-6 space-y-2 font-mono text-xs">
            <Row k="Stage" v={f.stage ?? "—"} />
            <Row k="Ask" v={f.ask ?? "—"} />
            <Row k="Valuation" v={f.valuation ?? "—"} />
            <Row k="Status" v={f.status} />
          </div>
        </aside>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-14">
        <Link to="/founders" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← Grid standings</Link>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3"><span className="uppercase tracking-[0.25em] text-[10px] text-muted-foreground">{k}</span><span className="text-foreground">{v}</span></div>;
}