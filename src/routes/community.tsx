import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — The Arena" },
      { name: "description", content: "Viral clips, founder rankings, roast reels and post-show analysis from The Arena audience." },
      { property: "og:title", content: "Community — The Arena" },
      { property: "og:description", content: "Viral clips, rankings, and post-show analysis." },
    ],
  }),
  component: CommunityPage,
});

const CLIPS = [
  { img: ep01, tag: "Roast Reel", title: "Vane vs The Protocol Founder", views: "2.1M" },
  { img: ep02, tag: "Standing Ovation", title: "The Silent Pivot Moment", views: "4.7M" },
  { img: ep03, tag: "Walk-Off", title: "Six Minutes In", views: "8.3M" },
  { img: ep01, tag: "Founder Story", title: "Why I Walked Out", views: "1.2M" },
  { img: ep02, tag: "Audience Cam", title: "The Vote That Broke The Tie", views: "920K" },
  { img: ep03, tag: "Investor Breakdown", title: "Ross Reacts to the Term Sheet", views: "640K" },
];

function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="The Feed"
        title={<>Where the show <span className="italic text-[var(--silver)]/70">keeps going.</span></>}
        lede="Viral clips, roast reels, audience reactions, post-show analysis and founder documentaries. The arena doesn't end when the lights come up."
      />
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CLIPS.map((c, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[9/16] overflow-hidden bg-surface ring-1 ring-border">
                  <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground bg-background/70 backdrop-blur-md px-2 py-1 ring-1 ring-border">{c.tag}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <h3 className="font-display text-xl leading-tight">{c.title}</h3>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">{c.views}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}