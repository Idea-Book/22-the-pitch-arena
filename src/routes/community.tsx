import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { CommunityFeed } from "@/components/community-feed";
import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — BKL Sharks Reels, Roasts & Pitch Radio" },
      { name: "description", content: "Viral clips, founder rankings, roast reels, pitch radio transcripts and post-show analysis from the BKL Sharks audience." },
      { property: "og:title", content: "Community — BKL Sharks" },
      { property: "og:description", content: "Where the show keeps going." },
    ],
  }),
  component: CommunityPage,
});

const CLIPS = [
  { img: ep01, tag: "Roast Reel", title: "Mehra vs DropPay · 8 minutes of bloodletting", views: "12.4M", time: "2h", platform: "Reels" },
  { img: ep02, tag: "Standing Ovation", title: "Bharat Bites · the silent pivot moment", views: "8.7M", time: "1d", platform: "YT Shorts" },
  { img: ep03, tag: "Walk-Off", title: "Six minutes in. He just left.", views: "18.3M", time: "4d", platform: "Reels" },
  { img: ep01, tag: "Founder Story", title: "Why I walked out · Kabir Verma", views: "2.1M", time: "5d", platform: "Long-form" },
  { img: ep02, tag: "Audience Cam", title: "The vote that broke the tie", views: "920K", time: "1w", platform: "Reels" },
  { img: ep03, tag: "Investor Breakdown", title: "Riya Kapoor reacts to the ₹600 Cr cap", views: "1.4M", time: "1w", platform: "YT" },
  { img: ep01, tag: "Hinglish.ai", title: "When she switched the demo to Hindi mid-pitch", views: "6.2M", time: "2w", platform: "Reels" },
  { img: ep02, tag: "Behind the Curtain", title: "The holding room · 48 hours · no phones", views: "3.8M", time: "3w", platform: "Docu" },
];

const RADIO = [
  { t: "00:12", who: "Mehra", what: "What's your CAC payback? Don't lie. I already saw your dashboard." },
  { t: "01:48", who: "Founder", what: "Eleven months on paid. Six on organic." },
  { t: "01:55", who: "Kapoor", what: "Then why is your blended at twenty-two months?" },
  { t: "02:33", who: "Shetty", what: "Bhai, your tier-3 cohort is leaking. Show me the WhatsApp groups." },
  { t: "04:01", who: "Founder", what: "We don't have a tier-3 cohort yet." },
  { t: "04:04", who: "Mehra", what: "Then what are you selling me here?" },
  { t: "07:11", who: "Joshi", what: "I'll do ₹2 Cr at ₹24 Cr cap. Right now. Take it or get off the stage." },
];

const CREATORS = [
  { name: "@startupBhai", followers: "2.4M", lane: "Founder breakdowns" },
  { name: "@DeshiVC", followers: "880K", lane: "Term-sheet decode" },
  { name: "@CaughtInLaunch", followers: "1.6M", lane: "Pitch reactions" },
  { name: "@RoastMeBro", followers: "3.1M", lane: "Comedy edits" },
  { name: "@TheBuilder", followers: "640K", lane: "Long-form analysis" },
  { name: "@PaisaTalks", followers: "1.2M", lane: "Money explainers" },
];

function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="The Feed · After-Show"
        title={<>Where the show <span className="italic text-[var(--silver)]/70">keeps going.</span></>}
        lede="Viral reels, race-radio transcripts, audience reactions, post-show analysis and founder documentaries. The arena doesn't end when the lights come up — it explodes online."
      />

      {/* TRENDING NOW */}
      <section className="border-b border-border py-10 px-6">
        <div className="mx-auto max-w-7xl flex items-center gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)] shrink-0">
            <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink mr-2 align-middle" />
            Trending now
          </span>
          <div className="flex gap-3 overflow-x-auto no-scrollbar text-xs">
            {["#BKLSharks", "#KabirWalkOff", "#600CrLie", "#BharatBites", "#MehraThePen", "#PaddockMumbai"].map((t) => (
              <span key={t} className="shrink-0 px-3 py-1.5 border border-border bg-[var(--surface)] font-mono tracking-[0.15em]">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CLIP GRID */}
      <section className="py-20 px-6 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h2 className="font-display text-3xl md:text-4xl">Viral · Last 7 days</h2>
            <div className="flex gap-2">
              {["All", "Reels", "YT Shorts", "Long-form", "Docu"].map((f, i) => (
                <button key={f} className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${i === 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CLIPS.map((c, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[9/16] overflow-hidden bg-surface ring-1 ring-border">
                  <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground bg-background/70 backdrop-blur-md px-2 py-1 ring-1 ring-border">{c.tag}</span>
                    <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground bg-background/70 backdrop-blur-md px-2 py-1 ring-1 ring-border">{c.platform}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-lg leading-tight mb-2">{c.title}</h3>
                    <div className="flex justify-between items-center font-mono text-[10px] text-muted-foreground">
                      <span>{c.views} views</span>
                      <span>{c.time}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PITCH RADIO */}
      <section className="py-24 px-6 border-b border-border">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">Pitch Radio · Round 04</span>
              <h2 className="font-display text-3xl md:text-4xl">Unedited audio · 7 min 11 sec</h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink mr-2 align-middle" /> Transcript live
            </span>
          </div>
          <ul className="bg-[var(--surface)] ring-1 ring-border divide-y divide-border font-mono text-sm">
            {RADIO.map((r, i) => (
              <li key={i} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[var(--surface-2)] transition-colors">
                <span className="col-span-2 text-[var(--gold)]">{r.t}</span>
                <span className={`col-span-3 uppercase tracking-[0.2em] text-[11px] ${r.who === "Founder" ? "text-foreground" : "text-[var(--crimson)]"}`}>{r.who}</span>
                <span className="col-span-7 text-muted-foreground leading-relaxed">{r.what}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CREATOR NETWORK */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--gold)] mb-3 block">Creator Network</span>
              <h2 className="font-display text-3xl md:text-4xl">Indian creators in the BKL pit lane.</h2>
            </div>
            <a href="#" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">Apply to creator network →</a>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border ring-1 ring-border">
            {CREATORS.map((c) => (
              <li key={c.name} className="bg-background p-6 hover:bg-[var(--surface)] transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="font-display text-xl group-hover:text-[var(--crimson)] transition-colors">{c.name}</div>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--gold)]">{c.followers}</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{c.lane}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* LIVE COMMUNITY FEED */}
      <section id="feed" className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3 block">
              <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink mr-2 align-middle" />Live feed
            </span>
            <h2 className="font-display text-3xl md:text-4xl">Take the mic.</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">Post hot takes, tag them to episodes, react and reply. Mods are watching.</p>
          </div>
          <CommunityFeed />
        </div>
      </section>
    </>
  );
}