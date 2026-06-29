import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Brands &amp; Media · BKL Sharks" },
      { name: "description", content: "Brand, media and ecosystem partners powering BKL Sharks Episode 01 — first live show on OTT &amp; YouTube." },
      { property: "og:title", content: "BKL Sharks · Partners" },
      { property: "og:description", content: "Brand, media and ecosystem partners powering Episode 01." },
    ],
  }),
  component: Partners,
});

const TIERS = [
  { tag: "Title Partner", names: ["JioCinema", "YouTube"] },
  { tag: "Presenting Partner", names: ["HDFC Bank", "Zerodha"] },
  { tag: "Round Partner", names: ["Apex Ventures", "Lighthouse Capital", "Tigerline", "Forge Studio"] },
  { tag: "Founder Bay", names: ["AWS Startups", "Notion", "Linear", "Figma", "Slack", "Razorpay"] },
  { tag: "Media", names: ["YourStory", "Inc42", "ET Tech", "Moneycontrol"] },
];

function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Partners · Episode 01 Premiere"
        title={<>The grid <span className="italic text-[var(--silver)]/70">behind the spotlight.</span></>}
        lede="Brands and platforms underwriting India's most uncensored pitch show."
      >
        <Link to="/sponsors" className="inline-block mt-8 bg-[var(--crimson)] text-white px-7 py-3 font-mono text-[11px] uppercase tracking-[0.3em]">Become a partner →</Link>
      </PageHero>

      <section className="py-20 px-6 border-b border-border">
        <div className="mx-auto max-w-6xl space-y-12">
          {TIERS.map((t) => (
            <div key={t.tag}>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">{t.tag}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                {t.names.map((n) => (
                  <div key={n} className="bg-background py-12 grid place-items-center">
                    <span className="font-display text-2xl tracking-tight">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
