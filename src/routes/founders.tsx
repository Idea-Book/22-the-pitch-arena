import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "Grid Standings — BKL Sharks Founders Leaderboard" },
      { name: "description", content: "Live leaderboard of every founder who has walked the BKL Sharks arena. Position changes, verdicts, deployed capital and audience heat." },
      { property: "og:title", content: "Grid Standings — BKL Sharks" },
      { property: "og:description", content: "Live founder leaderboard." },
    ],
  }),
  component: FoundersPage,
});

const FOUNDERS = [
  { rank: 1, delta: "▲2", name: "Aarav Iyer", co: "GridSpark", sector: "Climate", city: "BLR", verdict: "OVATION", funded: "₹3.4 Cr", heat: 98 },
  { rank: 2, delta: "▲5", name: "Meera Nair", co: "Bharat Bites", sector: "D2C", city: "MUM", verdict: "TERM SHEET", funded: "₹2.0 Cr", heat: 94 },
  { rank: 3, delta: "—", name: "Rohit Singh", co: "Lattice Labs", sector: "Deep Tech", city: "PUN", verdict: "TERM SHEET", funded: "₹1.8 Cr", heat: 89 },
  { rank: 4, delta: "▼1", name: "Anaya Reddy", co: "KrishiOS", sector: "AgriTech", city: "HYD", verdict: "VIRAL", funded: "—", heat: 86 },
  { rank: 5, delta: "▲3", name: "Tara Joshi", co: "Hinglish.ai", sector: "AI", city: "BLR", verdict: "TERM SHEET", funded: "₹90 L", heat: 81 },
  { rank: 6, delta: "▲1", name: "Devansh Patel", co: "10x Tutor", sector: "EdTech", city: "AMD", verdict: "OVATION", funded: "—", heat: 77 },
  { rank: 7, delta: "▼4", name: "Sneha Bose", co: "NovaCare", sector: "Healthtech", city: "KOL", verdict: "OVATION", funded: "₹60 L", heat: 72 },
  { rank: 8, delta: "▲2", name: "Ishaan Malhotra", co: "RouteOne", sector: "Logistics", city: "DEL", verdict: "TERM SHEET", funded: "₹1.2 Cr", heat: 68 },
  { rank: 9, delta: "▼2", name: "Priya Sen", co: "Mehndi Studio", sector: "Creator", city: "MUM", verdict: "VIRAL", funded: "—", heat: 61 },
  { rank: 10, delta: "—", name: "Yuvraj Khanna", co: "Slate Audio", sector: "Consumer", city: "BLR", verdict: "—", funded: "—", heat: 54 },
  { rank: 11, delta: "▼3", name: "Jaya Bauer", co: "Protocol", sector: "Crypto", city: "MUM", verdict: "TERMINATED", funded: "—", heat: 41 },
  { rank: 12, delta: "▼7", name: "Kabir Verma", co: "DropPay", sector: "Fintech", city: "DEL", verdict: "WALK-OFF", funded: "—", heat: 22 },
];

const HALL = [
  { name: "Aarav Iyer", co: "GridSpark", note: "S01 Champion · ₹3.4 Cr at ₹40 Cr cap", img: "1" },
  { name: "Meera Nair", co: "Bharat Bites", note: "Fastest close · 4 min 11 sec", img: "2" },
  { name: "Rohit Singh", co: "Lattice Labs", note: "Highest panel vote · 5/5", img: "3" },
];

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

      {/* HALL OF FAME */}
      <section className="border-b border-border py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl md:text-4xl mb-8">Podium · Season 01</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HALL.map((h, i) => (
              <div key={h.name} className={`p-8 ring-1 ${i === 0 ? "bg-[var(--surface-2)] ring-[var(--gold)]/40 md:order-2 md:-translate-y-4" : i === 1 ? "bg-[var(--surface)] ring-border md:order-1" : "bg-[var(--surface)] ring-border md:order-3"}`}>
                <div className={`font-display text-7xl mb-3 ${i === 0 ? "text-[var(--gold)]" : "text-muted-foreground"}`}>P{i + 1}</div>
                <div className="font-display text-2xl">{h.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{h.co}</div>
                <div className="mt-4 text-sm text-foreground">{h.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL LEADERBOARD */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h2 className="font-display text-3xl md:text-4xl">Full Grid · 12 of 142</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink align-middle mr-2" />
              Updated 14 minutes ago
            </span>
          </div>

          <div className="overflow-x-auto bg-[var(--surface)] ring-1 ring-border">
            <div className="hidden md:grid min-w-[860px] grid-cols-12 gap-4 px-5 py-3 border-b border-border font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              <div className="col-span-1">Pos</div>
              <div className="col-span-1">Δ</div>
              <div className="col-span-3">Founder</div>
              <div className="col-span-2">Sector</div>
              <div className="col-span-1">City</div>
              <div className="col-span-2">Verdict</div>
              <div className="col-span-1">Raised</div>
              <div className="col-span-1 text-right">Heat</div>
            </div>
            <ul className="min-w-[860px] md:min-w-0">
              {FOUNDERS.map((f) => (
                <li key={f.rank} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border items-center hover:bg-[var(--surface-2)] transition-colors group">
                  <div className="col-span-1 font-display text-2xl text-muted-foreground group-hover:text-foreground transition-colors">{String(f.rank).padStart(2, "0")}</div>
                  <div className={`col-span-1 font-mono text-xs ${deltaColor(f.delta)}`}>{f.delta}</div>
                  <div className="col-span-3">
                    <div className="font-display text-lg leading-tight">{f.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{f.co}</div>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">{f.sector}</div>
                  <div className="col-span-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{f.city}</div>
                  <div className={`col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] ${verdictColor(f.verdict)}`}>{f.verdict}</div>
                  <div className="col-span-1 font-mono text-xs text-[var(--gold)]">{f.funded}</div>
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <div className="h-px w-12 bg-border overflow-hidden">
                      <div className={`h-full ${f.heat > 60 ? "bg-[var(--gold)]" : "bg-[var(--crimson)]"}`} style={{ width: `${f.heat}%` }} />
                    </div>
                    <span className="font-mono text-xs tabular-nums w-6 text-right">{f.heat}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGEND */}
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