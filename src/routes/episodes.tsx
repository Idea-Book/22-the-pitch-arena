import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { PageHero } from "@/components/page-hero";
import { listEpisodes } from "@/lib/content.functions";
import { useRealtime } from "@/hooks/use-realtime";
import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";

export const Route = createFileRoute("/episodes")({
  head: () => ({
    meta: [
      { title: "Episodes — BKL Sharks Season 01 · Pitch Vault" },
      { name: "description", content: "All 16 rounds from BKL Sharks Season 01. Pitch vault with verdicts, lap times and viral moments." },
      { property: "og:title", content: "Episodes — BKL Sharks" },
      { property: "og:description", content: "Every breakdown. Every breakthrough." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["episodesPublic"],
      queryFn: () => listEpisodes(),
      staleTime: 60_000,
    }),
  component: EpisodesPage,
});

const FALLBACK_IMGS = [ep01, ep02, ep03];

const FILTERS: { label: string; match?: string }[] = [
  { label: "All Rounds" },
  { label: "Termed", match: "TERMINATED" },
  { label: "Term Sheet", match: "TERM SHEET" },
  { label: "Viral", match: "VIRAL" },
  { label: "Walk-Off", match: "WALK-OFF" },
  { label: "Ovation", match: "STANDING OVATION" },
];

const COLOR: Record<string, string> = {
  TERMINATED: "text-[var(--crimson)]",
  "TERM SHEET": "text-[var(--gold)]",
  VIRAL: "text-foreground",
  "STANDING OVATION": "text-[var(--gold)]",
  "WALK-OFF": "text-[var(--crimson)]",
};

function EpisodesPage() {
  const { data = [] } = useQuery({
    queryKey: ["episodesPublic"],
    queryFn: () => listEpisodes(),
    staleTime: 60_000,
  });
  useRealtime("episodes", [["episodesPublic"], ["episodesAdminAll"]]);

  const [active, setActive] = useState<string>("All Rounds");
  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.label === active);
    if (!f?.match) return data;
    return data.filter((e: any) => e.outcome === f.match);
  }, [active, data]);

  const stats = useMemo<[string, string][]>(() => {
    const total = data.length;
    const termSheets = data.filter((e: any) => e.outcome === "TERM SHEET").length;
    return [
      [String(total), "Rounds"],
      [String(termSheets), "Term sheets"],
      [String(data.filter((e: any) => e.outcome === "VIRAL").length), "Viral cuts"],
      [String(data.filter((e: any) => e.outcome === "WALK-OFF").length), "Walk-offs"],
      [String(data.filter((e: any) => e.outcome === "STANDING OVATION").length), "Ovations"],
    ];
  }, [data]);

  return (
    <>
      <PageHero
        eyebrow="Season 01 · The Pitch Vault"
        title={<>Every breakdown. <span className="italic text-[var(--silver)]/70">Every breakthrough.</span></>}
        lede="Live pitch vault — published episodes only. Drafts and previews stay hidden until the admin hits publish."
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-5 gap-px bg-border">
          {stats.map(([k, v]) => (
            <div key={v} className="bg-background p-6">
              <div className="font-display text-4xl md:text-5xl mb-2">{k}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                onClick={() => setActive(f.label)}
                className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.2em] border ${active === f.label ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">No published episodes match that filter yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((e: any, i: number) => {
                const img = e.hero_img || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                const color = COLOR[e.outcome] ?? "text-foreground";
                const funded = e.funded_label || "—";
                return (
                  <Link to="/episodes/$slug" params={{ slug: e.slug }} key={e.id} className="group cursor-pointer block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface ring-1 ring-border mb-4">
                      <img src={img} alt={e.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex justify-between gap-2">
                        <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${color} bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border`}>{e.outcome ?? "—"}</span>
                        <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border">{e.round_code} · {e.lap_time ?? "—"}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-2xl mb-1 leading-tight">{e.title}</h3>
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground flex gap-2">
                          <span>{e.city}</span>
                          {e.sector && <><span className="text-border">·</span><span>{e.sector}</span></>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{e.recap}</p>
                      <span className={`shrink-0 font-mono text-xs ${funded === "—" ? "text-muted-foreground" : "text-[var(--gold)]"}`}>{funded}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-24">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <h2 className="font-display text-3xl md:text-4xl">Pitch Vault · Lap-by-lap</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink mr-2 align-middle" />Live · auto-updates
              </span>
            </div>
            <div className="bg-[var(--surface)] ring-1 ring-border">
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                <div className="col-span-1">Rnd</div>
                <div className="col-span-1">Lap</div>
                <div className="col-span-2">City</div>
                <div className="col-span-3">Founder</div>
                <div className="col-span-3">Verdict</div>
                <div className="col-span-2 text-right">Deployed</div>
              </div>
              <ul>
                {data.map((e: any) => (
                  <li key={e.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border items-center hover:bg-[var(--surface-2)] transition-colors group">
                    <div className="col-span-1 font-mono text-xs text-muted-foreground">{e.round_code}</div>
                    <div className="col-span-1 font-mono text-xs">{e.lap_time ?? "—"}</div>
                    <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{e.city}</div>
                    <div className="col-span-3 text-sm group-hover:text-foreground">{e.title}</div>
                    <div className={`col-span-3 font-mono text-[10px] uppercase tracking-[0.25em] ${COLOR[e.outcome] ?? "text-foreground"}`}>{e.outcome ?? "—"}</div>
                    <div className="col-span-2 text-right font-mono text-xs text-[var(--gold)]">{e.funded_label ?? "—"}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
