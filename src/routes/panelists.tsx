import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import panel01 from "@/assets/panel-01.jpg";
import panel02 from "@/assets/panel-02.jpg";
import panel03 from "@/assets/panel-03.jpg";

export const Route = createFileRoute("/panelists")({
  head: () => ({
    meta: [
      { title: "The Council — Panelists | The Arena" },
      { name: "description", content: "Meet the operators, investors and internet personalities who decide founder fates on The Arena." },
      { property: "og:title", content: "The Council — Panelists | The Arena" },
      { property: "og:description", content: "The operators who decide founder fates." },
    ],
  }),
  component: PanelistsPage,
});

const PANELISTS = [
  { img: panel01, name: "Marcus Vane", tag: "The Executioner", quote: "Profitability is not a strategy. It is the only requirement for existence.", roast: 95, appetite: "B2B Infra", record: "12 wins / 4 destroyed" },
  { img: panel02, name: "Elena Ross", tag: "The Architect", quote: "I don't invest in products. I invest in founders who have survived a near-death experience.", roast: 62, appetite: "Vertical SaaS", record: "9 wins / 2 destroyed" },
  { img: panel03, name: "Jax Thorne", tag: "The Hype Engine", quote: "If it doesn't trend, it doesn't exist. Sell me the dream.", roast: 88, appetite: "Consumer Social", record: "6 wins / 8 destroyed" },
  { img: panel01, name: "V. Volkov", tag: "The Exit Assassin", quote: "Show me the door you walk through when the round closes.", roast: 91, appetite: "Fintech", record: "11 wins / 5 destroyed" },
  { img: panel02, name: "Dr. Silva", tag: "The Algorithm", quote: "Every founder lies. The math doesn't.", roast: 74, appetite: "Deep Tech", record: "7 wins / 3 destroyed" },
];

function PanelistsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Council"
        title={<>Five operators. <span className="italic text-[var(--silver)]/70">Zero patience.</span></>}
        lede="They have built, broken, and sold empires. They are not here to be your mentor. They are here to decide."
      />
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl space-y-24">
          {PANELISTS.map((p, i) => (
            <article key={p.name + i} className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="md:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface ring-1 ring-border group">
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>
              <div className="md:col-span-7 md:px-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-4 block">{p.tag}</span>
                <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">{p.name}</h2>
                <blockquote className="font-display italic text-2xl text-[var(--silver)]/80 mb-8 max-w-lg leading-snug">"{p.quote}"</blockquote>
                <dl className="grid grid-cols-3 gap-6 border-t border-border pt-6 max-w-md">
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Roast</dt>
                    <dd className="font-display text-2xl text-[var(--crimson)]">{p.roast}%</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Appetite</dt>
                    <dd className="text-sm">{p.appetite}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Record</dt>
                    <dd className="text-sm">{p.record}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}