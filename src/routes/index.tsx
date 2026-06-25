import { createFileRoute, Link } from "@tanstack/react-router";
import heroStage from "@/assets/hero-stage.jpg";
import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";
import panel01 from "@/assets/panel-01.jpg";
import panel02 from "@/assets/panel-02.jpg";
import panel03 from "@/assets/panel-03.jpg";
import journey from "@/assets/journey.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Arena — Build. Pitch. Survive." },
      {
        name: "description",
        content:
          "The internet's most brutal startup reality show. Founders pitch under live pressure. No safety nets.",
      },
      { property: "og:title", content: "The Arena — Build. Pitch. Survive." },
      {
        property: "og:description",
        content: "The internet's most brutal startup reality show.",
      },
    ],
  }),
  component: Home,
});

const EPISODES = [
  {
    img: ep01,
    badge: "Destroyed by Panel",
    badgeColor: "text-[var(--crimson)]",
    title: "The Protocol Breach",
    meta: "S01 · E04 · 42 min · Infrastructure",
  },
  {
    img: ep02,
    badge: "Instant Investment",
    badgeColor: "text-[var(--gold)]",
    title: "The Silent Pivot",
    meta: "S01 · E07 · 38 min · Consumer",
  },
  {
    img: ep03,
    badge: "Viral Moment",
    badgeColor: "text-foreground",
    title: "The Valuation War",
    meta: "S01 · E02 · 51 min · Fintech",
  },
];

const PANELISTS = [
  {
    img: panel01,
    name: "Marcus Vane",
    tag: "The Executioner",
    quote:
      "Profitability is not a strategy. It is the only requirement for existence.",
    roast: 95,
  },
  {
    img: panel02,
    name: "Elena Ross",
    tag: "The Architect",
    quote:
      "I don't invest in products. I invest in founders who have survived a near-death experience.",
    roast: 62,
  },
  {
    img: panel03,
    name: "Jax Thorne",
    tag: "The Hype Engine",
    quote: "If it doesn't trend, it doesn't exist. Sell me the dream.",
    roast: 88,
  },
];

const PHASES = [
  {
    n: "01",
    title: "Application",
    body:
      "Only the top 1% pass our psychological screen and traction verification. The deck is the easy part.",
  },
  {
    n: "02",
    title: "The Waiting Room",
    body:
      "48 hours of complete isolation before stage call. No devices. Just you and the pitch while cameras roll.",
  },
  {
    n: "03",
    title: "The Arena",
    body:
      "Ten minutes under the lights. Brutal feedback from the panel while the live internet audience votes in real time.",
  },
  {
    n: "04",
    title: "The Verdict",
    body:
      "Investment wired on the spot, or immediate walk of shame. No follow-up meetings. No middle ground.",
  },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[720px] flex items-center justify-center overflow-hidden">
        <img
          src={heroStage}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div
          aria-hidden
          className="absolute inset-0 cinematic-vignette"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.13 0 0 / 0.4) 0%, transparent 30%, transparent 60%, oklch(0.13 0 0) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center reveal-up">
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--crimson)] mb-6 block">
            Season 02 · Premieres Fall 2026
          </span>
          <h1 className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.92] tracking-tight text-balance">
            Build. Pitch.
            <span className="block italic text-[var(--silver)]/80">Survive.</span>
          </h1>
          <p className="mt-8 mx-auto max-w-xl text-muted-foreground text-pretty leading-relaxed">
            The internet's most brutal startup reality show. One stage, five
            operators, ten minutes to justify your existence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/apply"
              className="inline-flex items-center justify-center bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background hover:bg-[var(--silver)] transition-colors"
            >
              Apply to Pitch
            </Link>
            <Link
              to="/tickets"
              className="inline-flex items-center justify-center border border-border bg-background/30 backdrop-blur-md px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] hover:bg-background/60 transition-colors"
            >
              Audience Tickets
            </Link>
            <Link
              to="/episodes"
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Watch Season 1 →
            </Link>
          </div>
        </div>

        {/* Live ticker */}
        <div className="absolute bottom-0 left-0 right-0 border-y border-border bg-background/40 backdrop-blur-md py-3 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap ticker font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12 shrink-0">
                <span className="text-[var(--crimson)] flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[var(--crimson)] pulse-dot" />
                  Live · Next Show June 14 · 20:00 EST
                </span>
                <span>$4.2M Allocated Last Season</span>
                <span>14 Founders Entered · 3 Survived</span>
                <span>Audience Vote Margin · 62%</span>
                <span className="text-[var(--gold)]">Apply Window Closing in 4 Days</span>
                <span>Streaming on YouTube & X</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="border-b border-border py-32 px-6">
        <div className="mx-auto max-w-4xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8 block">
            The Premise
          </span>
          <p className="font-display text-3xl md:text-5xl leading-[1.1] tracking-tight text-balance">
            This is not Shark Tank. This is not a corporate pitch event.
            It is the breath before a founder walks out under one spotlight,
            in front of a live audience that came to see something{" "}
            <span className="italic text-[var(--silver)]/80">break</span> — or{" "}
            <span className="italic text-[var(--gold)]">become legend.</span>
          </p>
        </div>
      </section>

      {/* EPISODE SHOWCASE */}
      <section className="py-28 px-6 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">
                Season 01 · The Vault
              </span>
              <h2 className="font-display text-4xl md:text-5xl">Last Season's Carnage</h2>
            </div>
            <Link
              to="/episodes"
              className="hidden md:inline-flex items-center text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
            >
              All Episodes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EPISODES.map((e) => (
              <article key={e.title} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface ring-1 ring-border">
                  <img
                    src={e.img}
                    alt={e.title}
                    loading="lazy"
                    width={800}
                    height={1200}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`font-mono text-[9px] font-semibold uppercase tracking-[0.25em] ${e.badgeColor} bg-background/70 backdrop-blur-md px-2 py-1 ring-1 ring-border`}
                    >
                      {e.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-display text-2xl mb-1">{e.title}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {e.meta}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PANELISTS */}
      <section className="py-28 px-6 border-b border-border bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">
              The Council
            </span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
              Five people who have built, broken, and sold empires.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              They don't want your deck. They want your soul. And they have zero patience
              for theater.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {PANELISTS.map((p, i) => (
              <article key={p.name} className={`group ${i === 1 ? "md:mt-12" : ""} ${i === 2 ? "md:mt-24" : ""}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-surface ring-1 ring-border mb-5">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-2xl">{p.name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--crimson)] mt-1">
                      {p.tag}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-5">
                  "{p.quote}"
                </p>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Roast Meter
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-24 bg-border">
                      <div
                        className="h-full bg-[var(--crimson)]"
                        style={{ width: `${p.roast}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[var(--crimson)]">
                      {p.roast}%
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <Link
              to="/panelists"
              className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Meet the full council →
            </Link>
          </div>
        </div>
      </section>

      {/* FOUNDER JOURNEY */}
      <section className="py-28 px-6 border-b border-border">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">
              The Founder Path
            </span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-12">
              From application to verdict in 96 hours.
            </h2>
            <ol className="relative">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
              {PHASES.map((p) => (
                <li key={p.n} className="relative pl-8 pb-10 last:pb-0 group">
                  <span className="absolute left-[-4px] top-1.5 size-2 bg-[var(--crimson)] group-hover:bg-foreground transition-colors" />
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Phase {p.n}
                    </span>
                    <h3 className="font-display text-2xl">{p.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-border">
            <img
              src={journey}
              alt="Founder waiting backstage"
              loading="lazy"
              width={1000}
              height={1250}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
            <figure className="absolute bottom-6 left-6 right-6 bg-background/70 backdrop-blur-xl ring-1 ring-border p-6">
              <blockquote className="font-display italic text-xl md:text-2xl leading-snug mb-3">
                "I've never felt pressure like that. It stopped being about the
                money. It was about survival."
              </blockquote>
              <figcaption className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                — Season 01 Finalist
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* AUDIENCE + SPONSORS TEASER */}
      <section className="py-28 px-6 border-b border-border">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/tickets"
            className="group relative overflow-hidden bg-[var(--surface)] ring-1 ring-border p-10 md:p-14 min-h-[360px] flex flex-col justify-between transition-colors hover:bg-[var(--surface-2)]"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">
              The Audience
            </span>
            <div>
              <h3 className="font-display text-4xl md:text-5xl leading-tight mb-4 max-w-[14ch]">
                Be in the room when it breaks.
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                Floor seats, backstage access, VIP founder mixer. The arena
                holds 2,000. We seat 1,200.
              </p>
              <span className="inline-flex items-center text-xs uppercase tracking-[0.25em] group-hover:translate-x-1 transition-transform">
                Book Tickets →
              </span>
            </div>
          </Link>

          <Link
            to="/sponsors"
            className="group relative overflow-hidden bg-[var(--surface)] ring-1 ring-border p-10 md:p-14 min-h-[360px] flex flex-col justify-between transition-colors hover:bg-[var(--surface-2)]"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">
              For Brands
            </span>
            <div>
              <h3 className="font-display text-4xl md:text-5xl leading-tight mb-4 max-w-[14ch]">
                Where brands buy attention.
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                Title, arena, episode and founder-grant packages. 4.2M average
                live concurrents per show, 60M short-form impressions.
              </p>
              <span className="inline-flex items-center text-xs uppercase tracking-[0.25em] group-hover:translate-x-1 transition-transform">
                Sponsorship Deck →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mb-8">
            The stage is empty.
            <span className="block italic text-[var(--silver)]/70">The spotlight is waiting.</span>
          </h2>
          <Link
            to="/apply"
            className="inline-flex items-center bg-[var(--crimson)] text-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[var(--crimson)]/90 transition-colors"
          >
            Apply to Pitch
          </Link>
        </div>
      </section>
    </>
  );
}