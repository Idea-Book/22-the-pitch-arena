import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/press-kit")({
  head: () => ({
    meta: [
      { title: "Press Kit — BKL Sharks Delhi · Premiere Episode" },
      { name: "description", content: "Download logos, founder photos, episode stills, fact sheet and brand guidelines for BKL Sharks." },
      { property: "og:title", content: "BKL Sharks · Press Kit" },
      { property: "og:description", content: "Logos, episode stills, fact sheet and brand guidelines." },
    ],
  }),
  component: PressKit,
});

const ASSETS = [
  { kind: "Logos", items: ["Wordmark · SVG · light", "Wordmark · SVG · dark", "Avatar mark · PNG · 2048"] },
  { kind: "Photography", items: ["Shark headshots · 12 files", "Episode 01 stills · 84 files", "Venue beauty shots · Siri Fort, Delhi · 28 files"] },
  { kind: "Fact sheet", items: ["Episode 01 production booklet · PDF", "Founder funnel stats · PDF", "Audience demographics · PDF"] },
  { kind: "Brand guide", items: ["Colour tokens · JSON", "Typography spec · PDF", "Voice &amp; tone · PDF"] },
];

function PressKit() {
  return (
    <>
      <PageHero
        eyebrow="Press &amp; Media · Episode 01 Premiere"
        title={<>The kit. <span className="italic text-[var(--silver)]/70">No watermarks.</span></>}
        lede="Everything you need to write the story. Free to use with attribution. Embargo windows noted per asset."
      />

      <section className="py-20 px-6 border-b border-border">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-6">
          {ASSETS.map((a) => (
            <article key={a.kind} className="bg-[var(--surface)] ring-1 ring-border p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)]">{a.kind}</span>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {a.items.map((i) => (
                  <li key={i} className="flex justify-between gap-4 border-b border-border pb-3">
                    <span>{i}</span>
                    <a href="mailto:press@bklsharks.com?subject=Press kit request" className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground">Request →</a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mx-auto max-w-6xl mt-14 bg-[var(--surface-2)] ring-1 ring-border p-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">Press contact</div>
          <h2 className="font-display text-3xl mt-3">Apoorva Menon · Head of Comms</h2>
          <p className="text-muted-foreground mt-2">press@bklsharks.com · +91 22 4002 1100</p>
          <p className="text-xs text-muted-foreground mt-4">Response within 4 hours on show weeks, 1 business day otherwise.</p>
        </div>
      </section>
    </>
  );
}
