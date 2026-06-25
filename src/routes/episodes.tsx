import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";

export const Route = createFileRoute("/episodes")({
  head: () => ({
    meta: [
      { title: "Episodes — The Arena" },
      { name: "description", content: "Every breakdown. Every breakthrough. Watch the full archive of The Arena." },
      { property: "og:title", content: "Episodes — The Arena" },
      { property: "og:description", content: "Every breakdown. Every breakthrough." },
    ],
  }),
  component: EpisodesPage,
});

const EPISODES = [
  { img: ep01, ep: "E04", outcome: "Destroyed", color: "text-[var(--crimson)]", title: "The Protocol Breach", desc: "A solo founder defends a $40M infrastructure pivot under interrogation.", runtime: "42 min" },
  { img: ep02, ep: "E07", outcome: "Instant Invest", color: "text-[var(--gold)]", title: "The Silent Pivot", desc: "Twin founders walk in selling enterprise. They walk out with consumer money.", runtime: "38 min" },
  { img: ep03, ep: "E02", outcome: "Viral Moment", color: "text-foreground", title: "The Valuation War", desc: "A 19-year-old pitches a $200M cap. The panel does not laugh — at first.", runtime: "51 min" },
  { img: ep01, ep: "E09", outcome: "Standing Ovation", color: "text-[var(--gold)]", title: "Bare Metal", desc: "A founder reveals her cofounder quit 4 hours before stage call.", runtime: "47 min" },
  { img: ep02, ep: "E11", outcome: "Walk-Off", color: "text-[var(--crimson)]", title: "The Refusal", desc: "A founder walks off stage at minute six. The audience erupts.", runtime: "29 min" },
  { img: ep03, ep: "E13", outcome: "Term Sheet", color: "text-[var(--gold)]", title: "The Finale", desc: "Three survivors. One arena. A live $5M check on the table.", runtime: "78 min" },
];

function EpisodesPage() {
  return (
    <>
      <PageHero
        eyebrow="Season 01 · The Vault"
        title={<>Every breakdown. <span className="italic text-[var(--silver)]/70">Every breakthrough.</span></>}
        lede="Thirteen episodes. Fourteen founders. Three survivors. Watch the unedited tape from the arena floor."
      />
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar">
            {["All", "Destroyed", "Invested", "Viral", "Walk-Off", "Standing Ovation"].map((f, i) => (
              <button key={f} className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.2em] border ${i === 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EPISODES.map((e, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface ring-1 ring-border mb-4">
                  <img src={e.img} alt={e.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${e.color} bg-background/70 backdrop-blur-md px-2 py-1 ring-1 ring-border`}>{e.outcome}</span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-background/70 backdrop-blur-md px-2 py-1 ring-1 ring-border">{e.ep}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-display text-2xl mb-1">{e.title}</h3>
                    <p className="text-xs text-muted-foreground">{e.runtime}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}