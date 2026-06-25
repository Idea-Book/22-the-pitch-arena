import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "Founders — The Arena Leaderboard" },
      { name: "description", content: "The leaderboard of every founder who has walked the arena. Live ranks, verdicts, and aftermath." },
      { property: "og:title", content: "Founders — The Arena Leaderboard" },
      { property: "og:description", content: "The leaderboard of every founder who has walked the arena." },
    ],
  }),
  component: FoundersPage,
});

const FOUNDERS = [
  { rank: 1, name: "Aiden Park", co: "Bare Metal", verdict: "Ovation", funded: "$3.4M", heat: 98 },
  { rank: 2, name: "Mira Okafor", co: "Silent Pivot", verdict: "Instant Invest", funded: "$2.0M", heat: 94 },
  { rank: 3, name: "Leo Vance", co: "Glasswire", verdict: "Term Sheet", funded: "$1.8M", heat: 89 },
  { rank: 4, name: "Sasha Lin", co: "Underwire", verdict: "Viral", funded: "—", heat: 86 },
  { rank: 5, name: "Nico Reyes", co: "Tradewell", verdict: "Term Sheet", funded: "$900K", heat: 81 },
  { rank: 6, name: "Hana Mori", co: "Overcast", verdict: "Standing Ovation", funded: "—", heat: 77 },
  { rank: 7, name: "J. Bauer", co: "Protocol", verdict: "Destroyed", funded: "—", heat: 41 },
  { rank: 8, name: "Rey Marin", co: "Northform", verdict: "Walk-Off", funded: "—", heat: 22 },
];

function FoundersPage() {
  return (
    <>
      <PageHero
        eyebrow="Founder Leaderboard"
        title={<>The ones who <span className="italic text-[var(--silver)]/70">walked in.</span></>}
        lede="Live rankings from audience vote, panel verdict, and post-show traction. Updated in real time after every episode."
      >
        <div className="mt-10">
          <Link to="/apply" className="inline-flex items-center bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[var(--silver)] transition-colors">Apply to be Ranked</Link>
        </div>
      </PageHero>
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Founder</div>
            <div className="col-span-3">Verdict</div>
            <div className="col-span-2">Funded</div>
            <div className="col-span-2 text-right">Heat</div>
          </div>
          <ul>
            {FOUNDERS.map((f) => (
              <li key={f.rank} className="grid grid-cols-12 gap-4 px-5 py-5 border-b border-border items-center hover:bg-[var(--surface)] transition-colors group">
                <div className="col-span-1 font-display text-2xl text-muted-foreground group-hover:text-foreground transition-colors">{String(f.rank).padStart(2, "0")}</div>
                <div className="col-span-4">
                  <div className="font-display text-lg">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.co}</div>
                </div>
                <div className="col-span-3">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${f.verdict === "Destroyed" || f.verdict === "Walk-Off" ? "text-[var(--crimson)]" : "text-[var(--gold)]"}`}>{f.verdict}</span>
                </div>
                <div className="col-span-2 text-sm">{f.funded}</div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <div className="h-px w-20 bg-border overflow-hidden">
                    <div className={`h-full ${f.heat > 60 ? "bg-[var(--gold)]" : "bg-[var(--crimson)]"}`} style={{ width: `${f.heat}%` }} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums w-8 text-right">{f.heat}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}