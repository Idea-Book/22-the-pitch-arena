import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: "Creator Network — BKL Sharks" },
      { name: "description", content: "Join the BKL Sharks creator network — early footage, reaction-cam slots, revenue share on viral clips." },
      { property: "og:title", content: "BKL Sharks · Creator Network" },
      { property: "og:description", content: "Early footage, reaction-cam slots, revenue share on viral clips." },
    ],
  }),
  component: Creators,
});

const PERKS = [
  { kicker: "Footage", h: "48h early embargo", p: "Get the rough cut, B-roll and full panelist sound bites 48 hours before public drop." },
  { kicker: "Slot", h: "Reaction-cam booking", p: "Reserve a Floor seat with on-camera reaction permissions for any S02 taping." },
  { kicker: "Revenue", h: "Clip rev-share", p: "50/50 on any clip that crosses 100k views across YouTube Shorts, Reels, X." },
  { kicker: "Access", h: "Founder &amp; shark DMs", p: "Verified DMs into our roster of S01 + S02 founders and panelists." },
];

function Creators() {
  return (
    <>
      <PageHero
        eyebrow="Creator Network · Apply"
        title={<>The clips <span className="italic text-[var(--silver)]/70">that broke India</span> got made here.</>}
        lede="200 creators. Early footage. Revenue share. If your audience watches founders, they should be watching ours."
      >
        <a href="mailto:creators@bklsharks.com?subject=Creator Network application" className="inline-block mt-8 bg-[var(--crimson)] text-white px-7 py-3 font-mono text-[11px] uppercase tracking-[0.3em]">Apply to network →</a>
      </PageHero>

      <section className="py-20 px-6 border-b border-border">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-6">
          {PERKS.map((p) => (
            <article key={p.h} className="bg-[var(--surface)] ring-1 ring-border p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)]">{p.kicker}</span>
              <h3 className="font-display text-2xl mt-3">{p.h}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{p.p}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto max-w-6xl mt-14 bg-[var(--surface-2)] ring-1 ring-border p-10 grid md:grid-cols-3 gap-8">
          <Stat n="200" l="Active creators" />
          <Stat n="2.4B" l="Combined reach" />
          <Stat n="₹6.2 Cr" l="Paid out · S01" />
        </div>

        <div className="mx-auto max-w-3xl mt-14 text-center">
          <p className="text-muted-foreground">Already in the network? <Link to="/community" className="text-foreground underline">Hit the community feed</Link> for this week's drop calendar.</p>
        </div>
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-5xl">{n}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">{l}</div>
    </div>
  );
}
