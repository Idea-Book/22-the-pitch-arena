import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / STEPS.length) * 100;
  const survival = 18 + step * 16;

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

        {/* TELEMETRY METERS */}
        <div className="grid grid-cols-3 gap-px bg-border mb-12">
          <Meter label="Application" value={`${Math.round(progress)}%`} bar={progress} />
          <Meter label="Survival probability" value={`${survival}%`} bar={survival} color="var(--crimson)" />
          <Meter label="Investor readiness" value={step >= 2 ? "Live" : "Pending"} bar={step >= 2 ? 70 : 10} color="var(--gold)" />
        </div>

        {/* STEP NAV */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar">
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} className={`flex-1 min-w-[140px] text-left p-4 border transition-colors ${i === step ? "border-[var(--crimson)] bg-[var(--surface-2)] glow-crimson" : "border-border hover:border-muted-foreground"}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">PHASE 0{i + 1}</div>
              <div className="font-display text-lg">{s.label}</div>
            </button>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="bg-[var(--surface)] ring-1 ring-border p-8 md:p-12">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl">{STEPS[step].label}</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{step + 1} / {STEPS.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS[step].fields.map((f) => (
              <div key={f} className={f.length > 30 ? "md:col-span-2" : ""}>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 block">{f}</label>
                {f.length > 30 ? (
                  <textarea rows={4} className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
                ) : (
                  <input type="text" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-10 pt-8 border-t border-border">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground disabled:opacity-30">← Back</button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="bg-foreground text-background px-8 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[var(--silver)] transition-colors">Continue →</button>
            ) : (
              <button className="bg-[var(--crimson)] text-white px-10 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[var(--crimson)]/90 transition-colors glow-crimson">
                <span className="size-1.5 rounded-full bg-white live-blink inline-block mr-3 align-middle" />
                Submit to the Arena
              </button>
            )}
          </div>
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