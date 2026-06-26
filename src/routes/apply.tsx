import { createFileRoute } from "@tanstack/react-router";
import { ApplicationForm } from "@/components/inquiry-form";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply to Pitch — BKL Sharks Season 02" },
      { name: "description", content: "Apply for a grid slot at BKL Sharks Season 02. Only the top 1% of Indian founders take the start line." },
      { property: "og:title", content: "Apply to Pitch — BKL Sharks" },
      { property: "og:description", content: "Apply for a grid slot at India's sharkest arena." },
    ],
  }),
  component: ApplyPage,
});

const STEPS = [
  { label: "Founder", fields: ["Full Name", "Role · Title", "City · Mumbai / BLR / DEL ...", "Twitter / X handle", "LinkedIn URL", "Founder Story (URL or paragraph)"] },
  { label: "Startup", fields: ["Company name", "One-line pitch", "Sector · D2C / Fintech / AI ...", "Stage · Pre-seed / Seed / A", "Website / App link", "Pitch deck URL"] },
  { label: "Traction", fields: ["MRR / ARR (₹)", "Monthly growth %", "Team size", "Funding raised to date (₹)", "Burn rate · monthly (₹)", "Runway · months"] },
  { label: "The Stage", fields: ["Why you deserve the spotlight", "What number on your deck you will defend to the death", "What scares you most about the panel", "If you walk off · what does it cost you?"] },
];

function Meter({ label, value, bar, color = "var(--silver)" }: { label: string; value: string; bar: number; color?: string }) {
  return (
    <div className="bg-background p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
        <span className="font-mono text-xs" style={{ color }}>{value}</span>
      </div>
      <div className="h-px bg-border overflow-hidden">
        <div className="h-full transition-all duration-700" style={{ width: `${bar}%`, background: color }} />
      </div>
    </div>
  );
}

function ApplyPage() {
  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-4 block">
            <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink align-middle mr-2" />
            Apply · Season 02 Open Call · Closes 09 Sep
          </span>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6">
            This is not a form.
            <span className="block italic text-[var(--silver)]/70">It's the start line.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Top 1% only. Be specific. Be honest. The sharks will have read every word
            before you walk the tunnel — and they will already have pulled your Razorpay,
            your GST filings and your last three pitch decks.
          </p>
        </header>
        <div className="bg-[var(--surface)] ring-1 ring-border p-8 md:p-12">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl">Founder application</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">S02 · Open call</span>
          </div>
          <ApplicationForm />
        </div>

        {/* SELECTION FUNNEL */}
        <div className="mt-16">
          <h3 className="font-display text-2xl mb-6">Selection funnel · S02</h3>
          <ul className="grid grid-cols-1 md:grid-cols-5 gap-px bg-border ring-1 ring-border">
            {[
              ["Applications", "1,240"],
              ["Shortlist call", "180"],
              ["Deck review", "62"],
              ["Founder interview", "24"],
              ["Grid slot", "16"],
            ].map(([k, v], i) => (
              <li key={k} className="bg-background p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Step {i + 1}</div>
                <div className="font-display text-2xl">{k}</div>
                <div className={`font-mono text-xs mt-1 ${i === 4 ? "text-[var(--gold)]" : "text-[var(--crimson)]"}`}>{v}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}