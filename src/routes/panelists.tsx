import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageHero } from "@/components/page-hero";
import { listPanelists } from "@/lib/content.functions";
import { panelistImage } from "@/lib/asset-map";

const panelistsQuery = queryOptions({
  queryKey: ["panelistsAll"],
  queryFn: () => listPanelists(),
});

export const Route = createFileRoute("/panelists")({
  head: () => ({
    meta: [
      { title: "The Council — Sharks | BKL Sharks" },
      { name: "description", content: "Meet the operators, investors and unicorn founders who decide founder fates on BKL Sharks." },
      { property: "og:title", content: "The Council — BKL Sharks" },
      { property: "og:description", content: "The operators who decide founder fates in India's sharkest arena." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(panelistsQuery),
  component: PanelistsPage,
  errorComponent: () => <div className="pt-32 pb-24 text-center text-sm text-muted-foreground">The Council roster didn't load. Refresh to try again.</div>,
});

function killRate(p: any) {
  const total = (p.record_wins ?? 0) + (p.record_kos ?? 0);
  return total ? Math.round(((p.record_kos ?? 0) / total) * 100) : 0;
}

function PanelistsPage() {
  const { data } = useSuspenseQuery(panelistsQuery);
  const panelists = (data ?? []) as any[];

  return (
    <>
      <PageHero
        eyebrow={`The Council · ${panelists.length} Sharks`}
        title={<>Operators. <span className="italic text-[var(--silver)]/70">Zero patience.</span></>}
        lede="Thousands of crores deployed across the table. They have built, broken, and exited Indian empires. They are not here to mentor you. They are here to decide."
      />

      <section className="border-b border-border py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <h2 className="font-display text-2xl">Shark Standings · S01</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink align-middle mr-2" />
              Live · Delhi · Sept
            </span>
          </div>
          <div className="bg-[var(--surface)] ring-1 ring-border overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  <th className="text-left px-5 py-3 w-12">Pos</th>
                  <th className="text-left px-5 py-3">Shark</th>
                  <th className="text-left px-5 py-3">Tag</th>
                  <th className="text-left px-5 py-3">Record</th>
                  <th className="text-left px-5 py-3">AUM</th>
                  <th className="text-right px-5 py-3">Kill Rate</th>
                </tr>
              </thead>
              <tbody>
                {panelists.map((p, i) => (
                  <tr key={p.id} className="border-b border-border hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-5 py-4 font-display text-2xl text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-5 py-4">
                      <Link to="/panelists/$slug" params={{ slug: p.slug }} className="font-display text-lg hover:text-[var(--crimson)]">{p.name}</Link>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.aka ?? p.city}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--crimson)]">{p.tag}</td>
                    <td className="px-5 py-4 font-mono text-xs">{p.record_wins}W / {p.record_kos} KO</td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--gold)]">{p.aum ?? "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-px w-20 bg-border"><div className="h-full bg-[var(--crimson)]" style={{ width: `${killRate(p)}%` }} /></div>
                        <span className="font-mono text-xs tabular-nums w-8 text-right">{killRate(p)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl space-y-24">
          {panelists.map((p, i) => (
            <article key={p.id} className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="md:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface ring-1 ring-border group">
                  <img src={p.headshot || panelistImage(p.slug)} alt={p.name} loading="lazy" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.3em] bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border">{p.aka ?? p.city}</div>
                  <div className="absolute bottom-4 right-4 font-display text-7xl text-white/90 leading-none drop-shadow-lg">{String(i + 1).padStart(2, "0")}</div>
                </div>
              </div>
              <div className="md:col-span-7 md:px-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-4 block">{p.tag}</span>
                <Link to="/panelists/$slug" params={{ slug: p.slug }} className="font-display text-5xl md:text-6xl leading-[0.95] mb-6 block hover:text-[var(--crimson)] transition-colors">{p.name}</Link>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">{p.bio}</p>
                {p.quote && (
                  <blockquote className="font-display italic text-2xl text-[var(--silver)]/80 mb-8 max-w-lg leading-snug border-l-2 border-[var(--crimson)] pl-5">
                    "{p.quote}"
                  </blockquote>
                )}
                <dl className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border ring-1 ring-border max-w-2xl">
                  {([
                    ["Roast", `${p.roast_meter ?? 0}`, "text-[var(--crimson)]"],
                    ["Record", `${p.record_wins}W/${p.record_kos}`, "text-foreground"],
                    ["AUM", p.aum ?? "—", "text-[var(--gold)]"],
                    ["Years", String(p.years ?? "—"), "text-foreground"],
                    ["Deals", String(p.deals ?? "—"), "text-foreground"],
                  ] as [string, string, string][]).map(([label, value, color]) => (
                    <div key={label} className="bg-background p-4">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</dt>
                      <dd className={`font-display text-2xl ${color}`}>{value}</dd>
                    </div>
                  ))}
                </dl>
                {p.appetite && (
                  <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Appetite · {p.appetite}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-16 px-6 bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)]">Panel referrals</div>
            <h2 className="font-display text-4xl mt-2 max-w-[20ch]">Know someone sharper? Nominate them.</h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-lg">
              Panelists and industry insiders can put forward the next shark. Four guest chairs remain for S01 EP01.
            </p>
          </div>
          <Link
            to="/invite-panelist"
            className="bg-[var(--crimson)] text-white px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors"
          >
            Nominate a shark →
          </Link>
        </div>
      </section>
    </>
  );
}
