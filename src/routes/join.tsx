import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { talentSchema, submitTalentApplication, type TalentInput } from "@/lib/talent.functions";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the Grid — Creators, Panelists & Investors · BKL Sharks" },
      { name: "description", content: "The mic is hot. The cheque is bigger. Onboard as a stand-up creator, industry-expert panelist or investor for BKL Sharks Episode 01 — Delhi · 5 September, live on OTT & YouTube." },
      { property: "og:title", content: "Join the Grid — BKL Sharks" },
      { property: "og:description", content: "Creators, panelists, investors — get on the S01 EP01 shortlist." },
    ],
  }),
  component: JoinPage,
});

type Role = "creator" | "panelist" | "investor";

const ROLES: { id: Role; kicker: string; title: string; sell: string; badge: string }[] = [
  {
    id: "creator",
    kicker: "Stand-up · Creator",
    title: "Open the show. Roast the sharks.",
    sell: "8-minute opening set. Live crowd of 1,800 at Siri Fort. Cut into every episode drop across JioCinema, YouTube, Reels.",
    badge: "12 slots · S01",
  },
  {
    id: "panelist",
    kicker: "Industry Expert · Panelist",
    title: "Sit in the chair. Ask the killer question.",
    sell: "Guest-panelist seat next to India's sharkest operators. One episode, four founders, full-length airtime.",
    badge: "4 guest chairs · S01",
  },
  {
    id: "investor",
    kicker: "Investor · Cheque",
    title: "Write live. Close on stage.",
    sell: "Bring a live term-sheet cheque. Deploy from ₹25 L to ₹10 Cr. Every close is filmed, aired and press-released.",
    badge: "6 investor chairs · S01",
  },
];

function JoinPage() {
  const [role, setRole] = useState<Role>("creator");
  return (
    <>
      <Hero />
      <RoleSwitcher role={role} setRole={setRole} />
      <FormSection key={role} role={role} />
      <SocialProof />
      <Timeline />
    </>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 border-b border-border overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 30% 0%, oklch(0.55 0.22 25 / 0.18), transparent 60%), radial-gradient(50% 60% at 90% 10%, oklch(0.7 0.15 60 / 0.12), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 79px, oklch(0.97 0 0 / 0.4) 79px 80px)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)]">
            <span className="size-1.5 rounded-full bg-[var(--crimson)] live-blink" />
            Onboarding open · Closes 18 Aug
          </span>
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            S01 EP01 · Siri Fort · Delhi · 05 Sep
          </span>
        </div>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tight max-w-[16ch] text-balance">
          The room isn&apos;t full <span className="italic text-[var(--silver)]/70">yet.</span>
          <span className="block text-[var(--crimson)]">Take a chair.</span>
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Three ways onto the grid of India&apos;s first live founder-combat show — on OTT and YouTube. Stand-up
          creators to open, industry veterans to grill, investors to close live. Pick a chair, drop your name,
          we&apos;ll come find you.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border ring-1 ring-border">
          {[
            ["1,800", "Live audience"],
            ["48M+", "Projected reach"],
            ["₹42 Cr", "Cheque pool"],
            ["16", "Grid rounds"],
          ].map(([n, l]) => (
            <div key={l} className="bg-background p-5">
              <div className="font-display text-3xl md:text-4xl">{n}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">{l}</div>
            </div>
          ))}
        </div>

        <a
          href="#pick-a-chair"
          className="mt-14 inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] hover:bg-[var(--silver)] transition-colors"
        >
          Pick a chair
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}

function RoleSwitcher({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <section id="pick-a-chair" className="py-20 px-6 border-b border-border">
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)] block mb-6">
          Three chairs · One stage
        </span>
        <div className="grid md:grid-cols-3 gap-px bg-border ring-1 ring-border">
          {ROLES.map((r) => {
            const active = r.id === role;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`text-left p-8 transition-all group relative overflow-hidden ${
                  active
                    ? "bg-[var(--crimson)] text-white"
                    : "bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${active ? "text-white/80" : "text-[var(--crimson)]"}`}>
                    {r.kicker}
                  </span>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.3em] px-2 py-1 border ${active ? "border-white/40 text-white/90" : "border-border text-muted-foreground"}`}>
                    {r.badge}
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl leading-tight max-w-[16ch]">{r.title}</h3>
                <p className={`text-sm mt-4 leading-relaxed max-w-md ${active ? "text-white/85" : "text-muted-foreground"}`}>
                  {r.sell}
                </p>
                <div className={`mt-8 font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 ${active ? "text-white" : "text-foreground"}`}>
                  {active ? "Selected" : "Choose this chair"} <span aria-hidden>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FormSection({ role }: { role: Role }) {
  const config = ROLES.find((r) => r.id === role)!;
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TalentInput>({
    resolver: zodResolver(talentSchema),
    defaultValues: { role },
  });

  const mutation = useMutation({
    mutationFn: (data: TalentInput) => submitTalentApplication({ data }),
    onSuccess: () => {
      toast.success("You're on the list. We'll be in touch.");
      setDone(true);
      reset({ role });
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong"),
  });

  if (done) {
    return (
      <section id="apply-form" className="py-24 px-6 border-b border-border">
        <div className="mx-auto max-w-3xl bg-[var(--surface)] ring-1 ring-border p-12 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)]">Signal received</span>
          <h2 className="font-display text-4xl md:text-5xl mt-4">You&apos;re on the shortlist.</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Our team will reach out within 72 hours if there&apos;s a match for Episode 01. In the meantime, follow the ticker.
          </p>
          <button
            onClick={() => setDone(false)}
            className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground border-b border-foreground pb-1"
          >
            Submit another →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="apply-form" className="py-24 px-6 border-b border-border bg-[var(--surface-2)]">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)]">{config.kicker}</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 max-w-[20ch]">{config.title}</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Application · {config.badge}
          </span>
        </div>

        <form
          onSubmit={handleSubmit((d) => mutation.mutate({ ...d, role }))}
          className="bg-background ring-1 ring-border p-8 md:p-12 space-y-8"
        >
          <input type="hidden" {...register("role")} value={role} />

          <Grid>
            <Field label="Full name" error={errors.full_name?.message}>
              <input {...register("full_name")} className={inputCls} placeholder="Aarav Iyer" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input type="email" {...register("email")} className={inputCls} placeholder="you@studio.in" />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input {...register("phone")} className={inputCls} placeholder="+91 …" />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <input {...register("city")} className={inputCls} placeholder="Delhi / Mumbai / BLR" />
            </Field>
          </Grid>

          {role === "creator" && (
            <>
              <Field label="Stage name / handle" error={errors.headline?.message}>
                <input {...register("headline")} className={inputCls} placeholder="e.g. @notthatfunny" />
              </Field>
              <Field label="Showreel URL (YouTube / Instagram)" error={errors.showreel_url?.message}>
                <input {...register("showreel_url")} className={inputCls} placeholder="https://youtu.be/…" />
              </Field>
              <Field label="Best clips / links" error={errors.links?.message}>
                <input {...register("links")} className={inputCls} placeholder="Comma-separated URLs" />
              </Field>
              <Field label="Set style" error={errors.expertise?.message}>
                <input {...register("expertise")} className={inputCls} placeholder="Observational · Roast · Crowd work" />
              </Field>
            </>
          )}

          {role === "panelist" && (
            <>
              <Field label="Current title" error={errors.headline?.message}>
                <input {...register("headline")} className={inputCls} placeholder="Founder & CEO, Growth Ops" />
              </Field>
              <Field label="Firm / Company" error={errors.firm?.message}>
                <input {...register("firm")} className={inputCls} placeholder="e.g. Nexus Ventures" />
              </Field>
              <Field label="Domain expertise" error={errors.expertise?.message}>
                <input {...register("expertise")} className={inputCls} placeholder="D2C · Fintech · AI infra" />
              </Field>
              <Field label="LinkedIn / Portfolio" error={errors.portfolio_url?.message}>
                <input {...register("portfolio_url")} className={inputCls} placeholder="https://linkedin.com/in/…" />
              </Field>
              <Field label="Availability window" error={errors.availability?.message}>
                <input {...register("availability")} className={inputCls} placeholder="Sep 4–6 · Delhi" />
              </Field>
            </>
          )}

          {role === "investor" && (
            <>
              <Field label="Firm" error={errors.firm?.message}>
                <input {...register("firm")} className={inputCls} placeholder="Fund / Family office / Angel" />
              </Field>
              <Field label="Role / Title" error={errors.headline?.message}>
                <input {...register("headline")} className={inputCls} placeholder="Partner · Principal · Angel" />
              </Field>
              <Field label="Typical ticket size" error={errors.ticket_size?.message}>
                <input {...register("ticket_size")} className={inputCls} placeholder="₹25 L – ₹10 Cr" />
              </Field>
              <Field label="Sectors" error={errors.sectors?.message}>
                <input {...register("sectors")} className={inputCls} placeholder="Consumer · SaaS · Climate" />
              </Field>
              <Field label="Portfolio / Fund URL" error={errors.portfolio_url?.message}>
                <input {...register("portfolio_url")} className={inputCls} placeholder="https://…" />
              </Field>
            </>
          )}

          <Field label="Short bio" error={errors.bio?.message}>
            <textarea rows={3} {...register("bio")} className={inputCls} placeholder="Two lines. Who you are, what you're known for." />
          </Field>

          <Field label="Why this chair?" required error={errors.why_join?.message}>
            <textarea
              rows={5}
              {...register("why_join")}
              className={inputCls}
              placeholder="Why you, why now, why this stage. Be specific — the sharks read every word."
            />
          </Field>

          <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Response within 72h · Shortlist call within 10 days
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--crimson)] text-white px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] hover:bg-[var(--crimson)]/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending…" : "Send application →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="py-20 px-6 border-b border-border">
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)] mb-6 block">
          Backed by the room
        </span>
        <div className="grid md:grid-cols-3 gap-px bg-border ring-1 ring-border">
          {[
            { q: "The only stage in India where a founder can close a round before the credits roll.", who: "Meera Nair · Managing Partner" },
            { q: "I've done every open-mic in Delhi. None of them had a shark heckling from row two.", who: "Kabir Verma · Creator, S01" },
            { q: "You get an audited data-room the same night the founder walks off. That's the show.", who: "Nikhil Joshi · Partner" },
          ].map((t) => (
            <blockquote key={t.who} className="bg-background p-8">
              <p className="font-display text-xl leading-snug text-balance">&ldquo;{t.q}&rdquo;</p>
              <footer className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-6">
                {t.who}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  const steps = [
    ["Now → 18 Aug", "Applications open", "Rolling review · we call as we go."],
    ["19 – 25 Aug", "Shortlist calls", "20-minute video call with our booking team."],
    ["26 – 30 Aug", "Chair confirmed", "Contract, travel, green-room brief."],
    ["05 Sep · Delhi", "Live at Siri Fort", "Cameras hot at 19:00 IST. OTT + YouTube."],
  ];
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-4xl md:text-5xl mb-12 max-w-[20ch]">
          From this form <span className="italic text-[var(--silver)]/70">to the stage</span> in four moves.
        </h2>
        <ol className="grid md:grid-cols-4 gap-px bg-border ring-1 ring-border">
          {steps.map(([when, what, detail], i) => (
            <li key={what} className="bg-background p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)]">Step 0{i + 1}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{when}</div>
              <div className="font-display text-2xl mt-4">{what}</div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const inputCls =
  "w-full bg-[var(--surface)] border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--crimson)] transition-colors";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
        {label}
        {required && <span className="text-[var(--crimson)]">*</span>}
      </span>
      {children}
      {error && (
        <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--crimson)]">
          {error}
        </span>
      )}
    </label>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-6">{children}</div>;
}
