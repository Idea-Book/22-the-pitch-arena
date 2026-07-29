import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageHero } from "@/components/page-hero";
import { listFounders } from "@/lib/content.functions";

const foundersQuery = queryOptions({
  queryKey: ["foundersAll"],
  queryFn: () => listFounders(),
});

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "Grid Standings — BKL Sharks Founders Leaderboard" },
      { name: "description", content: "Live leaderboard of every founder who has walked the BKL Sharks arena. Position changes, verdicts, deployed capital and audience heat." },
      { property: "og:title", content: "Grid Standings — BKL Sharks" },
      { property: "og:description", content: "Live founder leaderboard." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(foundersQuery),
  component: FoundersPage,
  errorComponent: () => <div className="pt-32 pb-24 text-center text-sm text-muted-foreground">The grid didn't load. Refresh to try again.</div>,
});

function verdictColor(v: string) {
  if (v === "TERMINATED" || v === "WALK-OFF") return "text-[var(--crimson)]";
  if (v === "TERM SHEET" || v === "OVATION") return "text-[var(--gold)]";
  if (v === "VIRAL") return "text-foreground";
  return "text-muted-foreground";
}
function deltaColor(d: string) {
  if (d.startsWith("▲")) return "text-[var(--gold)]";
  if (d.startsWith("▼")) return "text-[var(--crimson)]";
  return "text-muted-foreground";
}

function FoundersPage() {
  const { data } = useSuspenseQuery(foundersQuery);
  const founders = ((data ?? []) as any[])
    .slice()
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
  const podium = founders.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Grid Standings · Live"
        title={<>The ones who <span className="italic text-[var(--silver)]/70">walked in.</span></>}
        lede="Live grid of every founder who has crossed the start line. Position changes update after every round — audience vote, panel verdict, and post-show traction combined."
      >
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link to="/apply" className="inline-flex items-center bg-[var(--crimson)] text-white px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[var(--crimson)]/90 transition-colors glow-crimson">
            <span className="size-1.5 rounded-full bg-white live-blink mr-3" />
            Apply to be Ranked
          </Link>
          <Link to="/episodes" className="inline-flex items-center border border-border px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[var(--surface)] transition-colors">
            Watch the Vault
          </Link>
        </div>
      </PageHero>

      {podium.length > 0 && (
        <section className="border-b border-border py-16 px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-3xl md:text-4xl mb-8">Podium · Season 01</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {podium.map((h, i) => (
                <div key={h.id} className={`p-8 ring-1 ${i === 0 ? "bg-[var(--surface-2)] ring-[var(--gold)]/40 md:order-2 md:-translate-y-4" : i === 1 ? "bg-[var(--surface)] ring-border md:order-1" : "bg-[var(--surface)] ring-border md:order-3"}`}>
                  <div className={`font-display text-7xl mb-3 ${i === 0 ? "text-[var(--gold)]" : "text-muted-foreground"}`}>P{i + 1}</div>
                  <Link to="/founders/$slug" params={{ slug: h.slug }} className="font-display text-2xl hover:text-[var(--crimson)]">{h.name}</Link>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{h.startup}</div>
                  <div className="mt-4 text-sm text-foreground">{h.funded_label || h.traction || h.stage || "On the grid"}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h2 className="font-display text-3xl md:text-4xl">Full Grid · {founders.length} founders</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink align-middle mr-2" />
              Live from the database
            </span>
          </div>

          <div className="overflow-x-auto bg-[var(--surface)] ring-1 ring-border">
            <div className="hidden md:grid min-w-[860px] grid-cols-12 gap-4 px-5 py-3 border-b border-border font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              <div className="col-span-1">Pos</div>
              <div className="col-span-1">Δ</div>
              <div className="col-span-3">Founder</div>
              <div className="col-span-2">Sector</div>
              <div className="col-span-1">City</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-1">Raised</div>
              <div className="col-span-1 text-right">Heat</div>
            </div>
            <ul className="min-w-[860px] md:min-w-0">
              {founders.map((f, i) => (
                <li key={f.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border items-center hover:bg-[var(--surface-2)] transition-colors group">
                  <div className="col-span-1 font-display text-2xl text-muted-foreground group-hover:text-foreground transition-colors">{String(f.position ?? i + 1).padStart(2, "0")}</div>
                  <div className={`col-span-1 font-mono text-xs ${deltaColor(f.position_delta ?? "—")}`}>{f.position_delta ?? "—"}</div>
                  <div className="col-span-3">
                    <Link to="/founders/$slug" params={{ slug: f.slug }} className="font-display text-lg leading-tight hover:text-[var(--crimson)]">{f.name}</Link>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{f.startup}</div>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">{f.sector ?? "—"}</div>
                  <div className="col-span-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{f.city ?? "—"}</div>
                  <div className={`col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] ${verdictColor(String(f.funded_label ?? "").toUpperCase())}`}>{f.stage ?? "—"}</div>
                  <div className="col-span-1 font-mono text-xs text-[var(--gold)]">{f.funded_label ?? "—"}</div>
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <div className="h-px w-12 bg-border overflow-hidden">
                      <div className={`h-full ${(f.heat ?? 0) > 60 ? "bg-[var(--gold)]" : "bg-[var(--crimson)]"}`} style={{ width: `${f.heat ?? 0}%` }} />
                    </div>
                    <span className="font-mono text-xs tabular-nums w-6 text-right">{f.heat ?? 0}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span><span className="text-[var(--gold)] mr-2">▲</span>Position gained</span>
            <span><span className="text-[var(--crimson)] mr-2">▼</span>Position lost</span>
            <span><span className="text-muted-foreground mr-2">—</span>No change</span>
            <span className="ml-auto">Heat = audience vote × clip velocity × panel score</span>
          </div>
        </div>
      </section>
    </>
  );
}
