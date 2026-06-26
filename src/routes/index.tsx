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
      { title: "BKL Sharks — India's Sharkest Founder Bloodsport" },
      { name: "description", content: "Build. Kill. Launch. India's most uncensored startup arena. 12 sharks, 16 rounds, one stage. Founders pitch under live pressure. No edits." },
      { property: "og:title", content: "BKL Sharks — Build. Kill. Launch." },
      { property: "og:description", content: "India's most uncensored founder bloodsport." },
    ],
  }),
  component: Home,
});

const EPISODES = [
  { img: ep01, badge: "TERMINATED", badgeColor: "text-[var(--crimson)]", title: "The Quick-Commerce Reckoning", meta: "S01 · R04 · MUMBAI · 42 MIN", lap: "LAP 04" },
  { img: ep02, badge: "TERM SHEET ₹3.2 CR", badgeColor: "text-[var(--gold)]", title: "Bharat Bites Goes Global", meta: "S01 · R07 · BENGALURU · 38 MIN", lap: "LAP 07" },
  { img: ep03, badge: "VIRAL · 41M REELS", badgeColor: "text-foreground", title: "The Valuation Standoff", meta: "S01 · R02 · DELHI · 51 MIN", lap: "LAP 02" },
];

const PANELISTS = [
  { img: panel01, name: "Vikram Mehra", tag: "The Hammer", quote: "Profit. Or get off my stage. Storytelling is for Netflix.", roast: 95 },
  { img: panel02, name: "Riya Kapoor", tag: "The Architect", quote: "I don't fund pitches. I fund operators who've been bled and still showed up.", roast: 62 },
  { img: panel03, name: "Arjun Shetty", tag: "Velocity", quote: "If your Bharat go-to-market fits on a slide, you don't have one.", roast: 88 },
];

const PHASES = [
  { n: "01", title: "Application", body: "Top 1% only. Psychometric screen, three reference calls, traction proof. The deck is the easy part.", time: "T-21 DAYS" },
  { n: "02", title: "The Holding Room", body: "48 hours of complete isolation in the NMACC paddock. No phones. No team. Cameras roll the whole time.", time: "T-48 HRS" },
  { n: "03", title: "Lights Out", body: "Ten minutes under one spotlight. Six sharks. 1,800 live in the room and 4.2M streaming in real time.", time: "T-0" },
  { n: "04", title: "The Verdict", body: "Wire on stage in 11 minutes — or the walk of shame down the tunnel. No follow-ups. No middle ground.", time: "T+11 MIN" },
];

const SECTORS = [
  ["D2C / Bharat", "₹1.4 Cr avg"],
  ["Fintech", "₹2.1 Cr avg"],
  ["AgriTech", "₹85 L avg"],
  ["AI · LLM Apps", "₹3.6 Cr avg"],
  ["Quick-Commerce", "₹1.9 Cr avg"],
  ["Healthtech", "₹1.2 Cr avg"],
];

function Home() {
  return (
    <>
      {/* ============ HERO — START LINE ============ */}
      <section className="relative h-screen min-h-[760px] flex items-center justify-center overflow-hidden pt-7">
        <img
          src={heroStage}
          alt=""
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div aria-hidden className="absolute inset-0 cinematic-vignette" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.13 0 0 / 0.5) 0%, transparent 30%, transparent 55%, oklch(0.13 0 0) 100%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />

        {/* SPEED STRIPE BAR */}
        <div aria-hidden className="absolute top-7 inset-x-0 h-1 speed-stripe opacity-80" />
        <div aria-hidden className="absolute bottom-0 inset-x-0 h-1 speed-stripe opacity-80" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 reveal-up">
          {/* Race header strip */}
          <div className="mb-10 grid grid-cols-3 md:grid-cols-5 gap-px bg-border max-w-3xl mx-auto">
            {[
              ["ROUND", "01 / 16"],
              ["CIRCUIT", "NMACC · BOM"],
              ["LIGHTS OUT", "14 NOV 19:00"],
              ["WEATHER", "DRY · HOT"],
              ["GRID", "12 SHARKS"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background/70 backdrop-blur-md px-3 py-2 text-center">
                <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted-foreground">{k}</div>
                <div className="font-mono text-[11px] mt-0.5 text-foreground">{v}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--crimson)] mb-6 block">
              <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink align-middle mr-2" />
              Season 02 · Premieres 14 November · Mumbai
            </span>
            <h1 className="font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.88] tracking-tight text-balance">
              Build.
              <span className="text-[var(--crimson)]"> Kill. </span>
              <span className="block italic text-[var(--silver)]/80">Launch.</span>
            </h1>
            <p className="mt-8 mx-auto max-w-xl text-muted-foreground text-pretty leading-relaxed">
              India's most uncensored founder bloodsport. <strong className="text-foreground font-normal">12 sharks. 16 rounds. One stage.</strong> Ten minutes under the lights to justify your existence — or take the long walk back.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/apply"
                className="inline-flex items-center justify-center bg-[var(--crimson)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-[var(--crimson)]/90 transition-colors glow-crimson"
              >
                <span className="size-1.5 rounded-full bg-white live-blink mr-3" />
                Apply to Pitch
              </Link>
              <Link
                to="/tickets"
                className="inline-flex items-center justify-center border border-border bg-background/30 backdrop-blur-md px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] hover:bg-background/60 transition-colors"
              >
                Paddock Tickets
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          scroll · पढ़ें
        </div>
      </section>

      {/* ============ LIVE STANDINGS BAR ============ */}
      <section className="border-y border-border bg-[var(--surface)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-6">
          <span className="shrink-0 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)]">
            <span className="size-1.5 rounded-full bg-[var(--crimson)] live-blink" /> Live Standings
          </span>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex gap-8 whitespace-nowrap ticker-fast font-mono text-[11px]">
              {[...Array(2)].map((_, k) => (
                <span key={k} className="flex gap-8 pr-8">
                  <span><span className="text-[var(--gold)]">P1</span> AARAV IYER · GRIDSPARK · ▲2</span>
                  <span><span className="text-[var(--gold)]">P2</span> MEERA NAIR · BHARAT BITES · ▲5</span>
                  <span><span className="text-foreground">P3</span> ROHIT SINGH · LATTICE LABS · —</span>
                  <span><span className="text-muted-foreground">P4</span> ANAYA REDDY · KRISHIOS · ▼1</span>
                  <span><span className="text-muted-foreground">P5</span> TARA JOSHI · HINGLISH.AI · ▲3</span>
                  <span><span className="text-[var(--crimson)]">DNF</span> KABIR VERMA · DROPPAY · WALK-OFF</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="border-b border-border py-32 px-6 relative overflow-hidden">
        <div aria-hidden className="absolute -right-32 top-0 bottom-0 w-[40%] bg-gradient-to-l from-[var(--crimson)]/10 to-transparent" />
        <div className="relative mx-auto max-w-5xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8 block">
            The Premise · सिद्धांत
          </span>
          <p className="font-display text-3xl md:text-5xl leading-[1.1] tracking-tight text-balance">
            This is not Shark Tank India. This is not a Bengaluru demo day.
            It is the breath before a founder walks out under one spotlight,
            in front of an arena that came to see something{" "}
            <span className="italic text-[var(--silver)]/80">break</span> — or{" "}
            <span className="italic text-[var(--gold)]">become legend.</span>
          </p>
        </div>
      </section>

      {/* ============ EPISODE SHOWCASE — RACE WEEKEND ============ */}
      <section className="py-28 px-6 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex items-end justify-between flex-wrap gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">
                Season 01 · The Vault
              </span>
              <h2 className="font-display text-4xl md:text-6xl leading-[0.9]">
                Last season's <span className="italic text-[var(--silver)]/70">carnage.</span>
              </h2>
            </div>
            <Link
              to="/episodes"
              className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors group"
            >
              All 16 rounds <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
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
                  <div className="absolute top-4 left-4 right-4 flex justify-between gap-2">
                    <span className={`font-mono text-[9px] font-semibold uppercase tracking-[0.25em] ${e.badgeColor} bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border`}>
                      {e.badge}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border">
                      {e.lap}
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

      {/* ============ PANELISTS ============ */}
      <section className="py-28 px-6 border-b border-border bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">
              The Council · पंच
            </span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
              Five operators who've built, broken, and exited Indian empires.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              ₹40,000 Cr+ deployed across the table. Zero patience for theatre.
              They don't want your pitch deck — they want your kill ratio.
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
                  <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.3em] bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border">
                    SHARK · 0{i + 1}
                  </div>
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
                    Kill Rate
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-24 bg-border">
                      <div className="h-full bg-[var(--crimson)]" style={{ width: `${p.roast}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-[var(--crimson)]">{p.roast}%</span>
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

      {/* ============ FOUNDER JOURNEY ============ */}
      <section className="py-28 px-6 border-b border-border relative overflow-hidden">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">
              The Founder Path
            </span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-12">
              From application to verdict in <span className="italic">96 hours.</span>
            </h2>
            <ol className="relative">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
              {PHASES.map((p) => (
                <li key={p.n} className="relative pl-8 pb-10 last:pb-0 group">
                  <span className="absolute left-[-4px] top-1.5 size-2 bg-[var(--crimson)] group-hover:bg-foreground transition-colors" />
                  <div className="flex items-baseline gap-4 mb-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Phase {p.n}
                    </span>
                    <h3 className="font-display text-2xl">{p.title}</h3>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--gold)] ml-auto">{p.time}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-border">
            <img
              src={journey}
              alt="Founder waiting in the tunnel"
              loading="lazy"
              width={1000}
              height={1250}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
            <figure className="absolute bottom-6 left-6 right-6 bg-background/70 backdrop-blur-xl ring-1 ring-border p-6">
              <blockquote className="font-display italic text-xl md:text-2xl leading-snug mb-3">
                "Maine IIT clear kiya. Sequoia ne mujhe roast kiya. Yeh dono se zyada darawna tha."
              </blockquote>
              <figcaption className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                — Aarav Iyer · S01 Champion · GridSpark
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ SECTOR GRID ============ */}
      <section className="py-24 px-6 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
            <h2 className="font-display text-3xl md:text-4xl">
              The grid runs every sector India is rewriting.
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              S01 · 142 founders · 16 rounds · ₹47 Cr deployed
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border">
            {SECTORS.map(([name, avg], i) => (
              <div key={name} className="bg-background p-6 hover:bg-[var(--surface)] transition-colors group">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Sector 0{i + 1}
                </div>
                <div className="font-display text-xl mb-2 group-hover:text-[var(--crimson)] transition-colors">{name}</div>
                <div className="font-mono text-[10px] text-[var(--gold)]">{avg}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AUDIENCE + SPONSORS ============ */}
      <section className="py-28 px-6 border-b border-border">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/tickets"
            className="group relative overflow-hidden bg-[var(--surface)] ring-1 ring-border p-10 md:p-14 min-h-[380px] flex flex-col justify-between transition-colors hover:bg-[var(--surface-2)] racing-edge"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">
              The Paddock
            </span>
            <div>
              <h3 className="font-display text-4xl md:text-5xl leading-tight mb-4 max-w-[14ch]">
                Be in the room when it breaks.
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                Floor seats, paddock club, founder mixer access at NMACC Mumbai.
                1,800 seats. 1,200 released. The room makes the show.
              </p>
              <span className="inline-flex items-center text-xs uppercase tracking-[0.25em] group-hover:translate-x-1 transition-transform">
                Book from ₹2,499 →
              </span>
            </div>
          </Link>

          <Link
            to="/sponsors"
            className="group relative overflow-hidden bg-[var(--surface)] ring-1 ring-border p-10 md:p-14 min-h-[380px] flex flex-col justify-between transition-colors hover:bg-[var(--surface-2)]"
            style={{ boxShadow: "inset -4px 0 0 0 var(--gold), inset 0 -1px 0 0 var(--border)" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">
              For Brands
            </span>
            <div>
              <h3 className="font-display text-4xl md:text-5xl leading-tight mb-4 max-w-[14ch]">
                Where brands buy attention.
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                Title, circuit, round and founder-grant packages. 4.2M avg
                live concurrents on JioCinema. 62M short-form impressions per round.
              </p>
              <span className="inline-flex items-center text-xs uppercase tracking-[0.25em] group-hover:translate-x-1 transition-transform">
                Sponsorship deck →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 speed-stripe" />
        <div className="mx-auto max-w-3xl relative">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mb-8">
            The stage is empty.
            <span className="block italic text-[var(--silver)]/70">The lights are coming on.</span>
          </h2>
          <Link
            to="/apply"
            className="inline-flex items-center bg-[var(--crimson)] text-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[var(--crimson)]/90 transition-colors glow-crimson"
          >
            <span className="size-1.5 rounded-full bg-white live-blink mr-3" />
            Apply to Pitch
          </Link>
        </div>
      </section>
    </>
  );
}