import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Tickets — Be in the room | The Arena" },
      { name: "description", content: "Floor seats, balcony, and backstage VIP access to the next live taping of The Arena." },
      { property: "og:title", content: "Tickets — Be in the room | The Arena" },
      { property: "og:description", content: "Floor, balcony, and backstage VIP access." },
    ],
  }),
  component: TicketsPage,
});

const TIERS = [
  { name: "Balcony", price: "$45", accent: "text-foreground", featured: false, items: ["Stadium-style seating", "Full venue view", "Audience vote access", "Post-show meme wall entry"], cta: "Book Balcony" },
  { name: "Floor", price: "$120", accent: "text-[var(--crimson)]", featured: true, items: ["On-camera floor seat", "Founder mixer entry", "Reaction-cam feature", "Signed program"], cta: "Book Floor" },
  { name: "Backstage VIP", price: "$480", accent: "text-[var(--gold)]", featured: false, items: ["Backstage tunnel access", "Pre-show panelist meet", "Investor lounge entry", "After-party access"], cta: "Book VIP" },
];

function TicketsPage() {
  return (
    <>
      <PageHero
        eyebrow="Live Taping · NYC · June 14 · 20:00"
        title={<>Be in the room <span className="italic text-[var(--silver)]/70">when it breaks.</span></>}
        lede="Two thousand seats. Twelve hundred released. The room makes the show — your reactions go on camera."
      />
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <article key={t.name} className={`relative p-10 ring-1 flex flex-col ${t.featured ? "bg-[var(--surface-2)] ring-[var(--crimson)]/40" : "bg-[var(--surface)] ring-border"}`}>
              {t.featured && (
                <span className="absolute -top-3 left-10 font-mono text-[9px] uppercase tracking-[0.3em] bg-[var(--crimson)] text-white px-2 py-1">Most Booked</span>
              )}
              <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${t.accent} mb-4`}>{t.name}</span>
              <div className="font-display text-6xl mb-8">{t.price}</div>
              <ul className="space-y-3 text-sm text-muted-foreground mb-10 flex-1">
                {t.items.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 size-1 bg-[var(--crimson)] shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 text-xs uppercase tracking-[0.22em] transition-colors ${t.featured ? "bg-[var(--crimson)] text-white hover:bg-[var(--crimson)]/90" : "bg-foreground text-background hover:bg-[var(--silver)]"}`}>{t.cta}</button>
            </article>
          ))}
        </div>
        <div className="mx-auto max-w-6xl mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {[["2,000", "Seats"], ["62%", "On-camera rate"], ["12", "Cameras live"], ["1", "Stage. One spotlight."]].map(([k, v]) => (
            <div key={v} className="bg-background p-8 text-center">
              <div className="font-display text-4xl mb-2">{k}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}