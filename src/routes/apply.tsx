import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply to Pitch — The Arena" },
      { name: "description", content: "Apply to take the stage at The Arena. Only the top 1% of founders are selected for live taping." },
      { property: "og:title", content: "Apply to Pitch — The Arena" },
      { property: "og:description", content: "Apply to take the stage at The Arena." },
    ],
  }),
  component: ApplyPage,
});

const STEPS = [
  { label: "Founder", fields: ["Full Name", "Role", "Twitter / X", "Founder Story (URL)"] },
  { label: "Startup", fields: ["Company", "One-line pitch", "Market", "Stage"] },
  { label: "Traction", fields: ["MRR / ARR", "Growth rate", "Team size", "Funding to date"] },
  { label: "The Stage", fields: ["Why you deserve the spotlight", "What you will defend", "What scares you about the panel"] },
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
  const survival = 28 + step * 18;
  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-4 block">Apply · Season 02 Open Call</span>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6">
            This is not a form.
            <span className="block italic text-[var(--silver)]/70">It's the door.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">Only the top 1% are selected. Be specific. Be honest. The panel will already have read everything you write here before you walk on stage.</p>
        </header>
        <div className="grid grid-cols-3 gap-px bg-border mb-12">
          <Meter label="Application" value={`${Math.round(progress)}%`} bar={progress} />
          <Meter label="Survival Probability" value={`${survival}%`} bar={survival} color="var(--crimson)" />
          <Meter label="Investor Readiness" value={step >= 2 ? "Live" : "Pending"} bar={step >= 2 ? 70 : 10} color="var(--gold)" />
        </div>
        <div className="flex gap-2 mb-12">
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} className={`flex-1 text-left p-4 border ${i === step ? "border-foreground bg-[var(--surface-2)]" : "border-border hover:border-muted-foreground"}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">0{i + 1}</div>
              <div className="font-display text-lg">{s.label}</div>
            </button>
          ))}
        </div>
        <div className="bg-[var(--surface)] ring-1 ring-border p-8 md:p-12">
          <h2 className="font-display text-3xl mb-8">{STEPS[step].label}</h2>
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
              <button className="bg-[var(--crimson)] text-white px-8 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[var(--crimson)]/90 transition-colors">Submit to Arena</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}