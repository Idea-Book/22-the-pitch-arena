import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";

export const Route = createFileRoute("/episodes")({
  head: () => ({
    meta: [
      { title: "Episodes — BKL Sharks Season 01 · Pitch Vault" },
      { name: "description", content: "All 16 rounds from BKL Sharks Season 01. Race vault with verdicts, lap times and viral moments." },
      { property: "og:title", content: "Episodes — BKL Sharks" },
      { property: "og:description", content: "Every breakdown. Every breakthrough." },
    ],
  }),
  component: EpisodesPage,
});

const EPISODES = [
  { img: ep01, ep: "R04", lap: "42:11", outcome: "TERMINATED", color: "text-[var(--crimson)]", city: "MUMBAI", sector: "Quick-Commerce", title: "The 10-Minute Lie", desc: "A solo founder defends ₹40 Cr GMV against three sharks who already pulled his Razorpay statements.", funded: "—" },
  { img: ep02, ep: "R07", lap: "38:02", outcome: "TERM SHEET", color: "text-[var(--gold)]", city: "BENGALURU", sector: "D2C · Bharat", title: "Bharat Bites Goes Global", desc: "Twin co-founders walk in selling tier-3 snacks. Walk out with US distribution money on the table.", funded: "₹3.2 Cr" },
  { img: ep03, ep: "R02", lap: "51:34", outcome: "VIRAL", color: "text-foreground", city: "DELHI", sector: "Fintech", title: "The Valuation Standoff", desc: "A 22-year-old IIT dropout pitches ₹600 Cr cap. The panel does not laugh — at first.", funded: "—" },
  { img: ep01, ep: "R09", lap: "47:18", outcome: "STANDING OVATION", color: "text-[var(--gold)]", city: "MUMBAI", sector: "AgriTech", title: "Bare Soil", desc: "A founder reveals her cofounder walked four hours before stage call. She still pitched solo.", funded: "₹1.8 Cr" },
  { img: ep02, ep: "R11", lap: "29:04", outcome: "WALK-OFF", color: "text-[var(--crimson)]", city: "HYDERABAD", sector: "SaaS", title: "The Refusal", desc: "A founder walks off stage at minute six. Mehra throws his pen. The crowd erupts.", funded: "—" },
  { img: ep03, ep: "R13", lap: "78:22", outcome: "TERM SHEET", color: "text-[var(--gold)]", city: "MUMBAI", sector: "Bharat AI", title: "The Finale", desc: "Three survivors. One arena. A live ₹10 Cr cheque on the table from Peak XV.", funded: "₹10 Cr" },
  { img: ep02, ep: "R05", lap: "44:51", outcome: "VIRAL", color: "text-foreground", city: "PUNE", sector: "EdTech", title: "The Tutor Wars", desc: "A coaching-class founder vs. an AI tutor founder. Both go down. The clip hits 50M views.", funded: "—" },
  { img: ep01, ep: "R12", lap: "33:09", outcome: "TERMINATED", color: "text-[var(--crimson)]", city: "BENGALURU", sector: "Healthtech", title: "The Burn Rate Problem", desc: "₹4 Cr/month burn. Three sharks demand the cofounder list. It does not go well.", funded: "—" },
];

const FILTERS = ["All Rounds", "Termed", "Term Sheet", "Viral", "Walk-Off", "Ovation"];

const STATS: [string, string][] = [
  ["16", "Rounds"],
  ["142", "Founders"],
  ["8", "Term sheets"],
  ["₹47 Cr", "Deployed live"],
  ["41M", "Reels generated"],
];

function EpisodesPage() {
  return (
    <>
      <PageHero
        eyebrow="Season 01 · The Pitch Vault"
        title={<>Every breakdown. <span className="italic text-[var(--silver)]/70">Every breakthrough.</span></>}
        lede="Sixteen rounds. One hundred and forty-two founders. Eight survivors with term sheets. Watch the unedited tape from the arena floor."
      />

      {/* PITCH SUMMARY STRIP */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-5 gap-px bg-border">
          {STATS.map(([k, v]) => (
            <div key={v} className="bg-background p-6">
              <div className="font-display text-4xl md:text-5xl mb-2">{k}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          {/* FILTERS */}
          <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar">
            {FILTERS.map((f, i) => (
              <button key={f} className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.2em] border ${i === 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>

          {/* EPISODE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EPISODES.map((e) => (
              <article key={e.ep + e.title} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface ring-1 ring-border mb-4">
                  <img src={e.img} alt={e.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex justify-between gap-2">
                    <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${e.color} bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border`}>{e.outcome}</span>
                    <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border">{e.ep} · {e.lap}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-2xl mb-1 leading-tight">{e.title}</h3>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground flex gap-2">
                      <span>{e.city}</span>
                      <span className="text-border">·</span>
                      <span>{e.sector}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{e.desc}</p>
                  <span className={`shrink-0 font-mono text-xs ${e.funded === "—" ? "text-muted-foreground" : "text-[var(--gold)]"}`}>{e.funded}</span>
                </div>
              </article>
            ))}
          </div>

          {/* LAP-TIMES TABLE */}
          <div className="mt-24">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <h2 className="font-display text-3xl md:text-4xl">Pitch Vault · Lap-by-lap</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sorted by air date · descending</span>
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
                {EPISODES.map((e, i) => (
                  <li key={i} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border items-center hover:bg-[var(--surface-2)] transition-colors group">
                    <div className="col-span-1 font-mono text-xs text-muted-foreground">{e.ep}</div>
                    <div className="col-span-1 font-mono text-xs">{e.lap}</div>
                    <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{e.city}</div>
                    <div className="col-span-3 text-sm group-hover:text-foreground">{e.title}</div>
                    <div className={`col-span-3 font-mono text-[10px] uppercase tracking-[0.25em] ${e.color}`}>{e.outcome}</div>
                    <div className="col-span-2 text-right font-mono text-xs text-[var(--gold)]">{e.funded}</div>
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