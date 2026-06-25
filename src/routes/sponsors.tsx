import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Sponsors — Where brands buy attention | The Arena" },
      { name: "description", content: "Title, arena, episode and founder-grant sponsorship packages for The Arena. 4.2M average live concurrents." },
      { property: "og:title", content: "Sponsors — Where brands buy attention | The Arena" },
      { property: "og:description", content: "Sponsorship packages with founder, audience and creator reach." },
    ],
  }),
  component: SponsorsPage,
});

const PACKAGES = [
  { name: "Title Sponsor", scope: "Season-long brand presence, stage naming, post-show editorial.", price: "$2M+" },
  { name: "Arena Sponsor", scope: "On-floor branding, audience badges, lobby activation, panel mention.", price: "$650K" },
  { name: "Episode Sponsor", scope: "Pre-roll, mid-show segment, founder-room branding for one episode.", price: "$180K" },
  { name: "Founder Grant", scope: "Fund a non-dilutive $50K stipend granted live on stage in your name.", price: "$120K" },
  { name: "Community Partner", scope: "Creator network co-branding and meme-wall placement across the season.", price: "$45K" },
];

const METRICS: [string, string][] = [
  ["4.2M", "Avg live concurrents"],
  ["62M", "Short-form impressions / ep"],
  ["83%", "Audience 22-38, builder index"],
  ["1,200", "Founders in waitlist pipeline"],
];

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 block">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full bg-[var(--surface)] border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
    </div>
  );
}

function SponsorsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Brands & Operators"
        title={<>Where brands <span className="italic text-[var(--gold)]/80">buy attention.</span></>}
        lede="The Arena is the highest-pressure surface on the internet to put your brand in front of founders, operators, investors and the audience that decides what gets built next."
      />
      <section className="py-20 px-6 border-b border-border">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {METRICS.map(([k, v]) => (
            <div key={v} className="bg-background p-8">
              <div className="font-display text-5xl mb-3">{k}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl mb-12">Packages</h2>
          <ul className="divide-y divide-border border-y border-border">
            {PACKAGES.map((p) => (
              <li key={p.name} className="grid grid-cols-12 gap-6 py-8 group hover:bg-[var(--surface)] px-6 -mx-6 transition-colors">
                <div className="col-span-12 md:col-span-4"><h3 className="font-display text-2xl">{p.name}</h3></div>
                <p className="col-span-12 md:col-span-6 text-muted-foreground leading-relaxed">{p.scope}</p>
                <div className="col-span-12 md:col-span-2 md:text-right font-mono text-sm text-[var(--gold)]">{p.price}</div>
              </li>
            ))}
          </ul>
          <form className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <h2 className="md:col-span-2 font-display text-3xl mb-2">Request the Deck</h2>
            <Field label="Company" />
            <Field label="Your Name" />
            <Field label="Email" type="email" />
            <Field label="Budget Range" placeholder="$120K — $2M+" />
            <div className="md:col-span-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 block">Partnership Intent</label>
              <textarea rows={4} className="w-full bg-[var(--surface)] border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
            </div>
            <button type="button" className="md:col-span-2 justify-self-start bg-foreground text-background px-8 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[var(--silver)] transition-colors">Send Inquiry</button>
          </form>
        </div>
      </section>
    </>
  );
}