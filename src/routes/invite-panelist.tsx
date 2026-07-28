import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { panelistInviteSchema, type PanelistInviteData } from "@/lib/invitation-schema";
import { submitPanelistInvitation } from "@/lib/invitations.functions";

export const Route = createFileRoute("/invite-panelist")({
  head: () => ({
    meta: [
      { title: "Nominate a Shark — Panelist Invitation · BKL Sharks" },
      {
        name: "description",
        content:
          "Sitting panelists and industry insiders can nominate the next shark for BKL Sharks S01 EP01 — Siri Fort, Delhi, 5 September, live on OTT & YouTube.",
      },
      { property: "og:title", content: "Nominate a Shark · BKL Sharks" },
      { property: "og:description", content: "Invite an operator, investor or industry veteran to the BKL Sharks panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitePanelistPage,
});

function InvitePanelistPage() {
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PanelistInviteData>({
    resolver: zodResolver(panelistInviteSchema) as any,
    defaultValues: { nominator_is_panelist: true },
  });

  const mutation = useMutation({
    mutationFn: (data: PanelistInviteData) => submitPanelistInvitation({ data }),
    onSuccess: () => {
      toast.success("Nomination logged. Our booking desk takes it from here.");
      setDone(true);
      reset({ nominator_is_panelist: true });
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong"),
  });

  return (
    <>
      <section className="relative pt-40 pb-20 px-6 border-b border-border overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 25% 0%, oklch(0.55 0.22 25 / 0.18), transparent 60%), radial-gradient(50% 60% at 90% 10%, oklch(0.7 0.15 60 / 0.12), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)]">
            <span className="size-1.5 rounded-full bg-[var(--crimson)] live-blink" />
            Panel referrals · S01 EP01
          </span>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tight max-w-[16ch] mt-8 text-balance">
            Know a sharper <span className="italic text-[var(--silver)]/70">shark?</span>
            <span className="block text-[var(--crimson)]">Put them in the chair.</span>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
            The panel is built on referrals. If you&apos;ve sat in the chair — or you work beside someone who
            should — send us the dossier. Every nomination lands in Pitch Control and gets a decision inside
            seven days.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border ring-1 ring-border">
            {[
              ["4", "Guest chairs left"],
              ["7 days", "Decision window"],
              ["05 Sep", "Siri Fort, Delhi"],
              ["OTT + YT", "Distribution"],
            ].map(([n, l]) => (
              <div key={l} className="bg-background p-5">
                <div className="font-display text-3xl md:text-4xl">{n}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nominate" className="py-20 px-6 bg-[var(--surface-2)] border-b border-border">
        <div className="mx-auto max-w-4xl">
          {done ? (
            <div className="bg-background ring-1 ring-border p-12 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--crimson)]">Nomination received</span>
              <h2 className="font-display text-4xl md:text-5xl mt-4">Dossier is in Pitch Control.</h2>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                We&apos;ll vet the nominee and reply to you and them within seven days.
              </p>
              <button
                onClick={() => setDone(false)}
                className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] border-b border-foreground pb-1"
              >
                Nominate someone else →
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit((d) => mutation.mutate(d))}
              className="bg-background ring-1 ring-border p-8 md:p-12 space-y-10"
              noValidate
            >
              <Block kicker="Section 01" title="Who's nominating">
                <Grid>
                  <Field label="Your name" required error={errors.nominator_name?.message}>
                    <input {...register("nominator_name")} className={inputCls} placeholder="Meera Nair" />
                  </Field>
                  <Field label="Your email" required error={errors.nominator_email?.message}>
                    <input type="email" {...register("nominator_email")} className={inputCls} placeholder="you@fund.in" />
                  </Field>
                  <Field label="Your role / firm" error={errors.nominator_role?.message}>
                    <input {...register("nominator_role")} className={inputCls} placeholder="Managing Partner, Ember Capital" />
                  </Field>
                  <Field label="How do you know them?" error={errors.relationship?.message}>
                    <input {...register("relationship")} className={inputCls} placeholder="Co-invested since 2019" />
                  </Field>
                </Grid>
                <label className="flex items-center gap-3 mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <input type="checkbox" {...register("nominator_is_panelist")} className="size-4 accent-[var(--crimson)]" />
                  I&apos;m a current or past BKL Sharks panelist
                </label>
              </Block>

              <Block kicker="Section 02" title="The nominee">
                <Grid>
                  <Field label="Full name" required error={errors.nominee_name?.message}>
                    <input {...register("nominee_name")} className={inputCls} placeholder="Vikram Mehra" />
                  </Field>
                  <Field label="Email" required error={errors.nominee_email?.message}>
                    <input type="email" {...register("nominee_email")} className={inputCls} placeholder="shark@fund.in" />
                  </Field>
                  <Field label="Phone" error={errors.nominee_phone?.message}>
                    <input {...register("nominee_phone")} className={inputCls} placeholder="+91 …" />
                  </Field>
                  <Field label="City" error={errors.city?.message}>
                    <input {...register("city")} className={inputCls} placeholder="Delhi" />
                  </Field>
                  <Field label="Firm / company" error={errors.firm?.message}>
                    <input {...register("firm")} className={inputCls} placeholder="Ember Capital" />
                  </Field>
                  <Field label="Title / designation" error={errors.title?.message}>
                    <input {...register("title")} className={inputCls} placeholder="Managing Partner" />
                  </Field>
                </Grid>
              </Block>

              <Block kicker="Section 03" title="Track record">
                <Grid>
                  <Field label="Areas of expertise" error={errors.expertise?.message}>
                    <input {...register("expertise")} className={inputCls} placeholder="Marketplaces, unit economics, D2C ops" />
                  </Field>
                  <Field label="Sectors they invest in" error={errors.sectors?.message}>
                    <input {...register("sectors")} className={inputCls} placeholder="Consumer, SaaS, fintech" />
                  </Field>
                  <Field label="Typical ticket size" error={errors.ticket_size?.message}>
                    <input {...register("ticket_size")} className={inputCls} placeholder="₹50 L – ₹5 Cr" />
                  </Field>
                  <Field label="AUM / fund size" error={errors.aum?.message}>
                    <input {...register("aum")} className={inputCls} placeholder="₹450 Cr" />
                  </Field>
                  <Field label="Years of experience" error={errors.years_experience?.message}>
                    <input type="number" min={0} max={70} {...register("years_experience")} className={inputCls} placeholder="14" />
                  </Field>
                  <Field label="Availability for 5 Sep, Delhi" error={errors.availability?.message}>
                    <input {...register("availability")} className={inputCls} placeholder="Confirmed / needs travel / TBC" />
                  </Field>
                </Grid>
                <div className="mt-6">
                  <Field label="Notable deals or exits" error={errors.notable_deals?.message}>
                    <textarea {...register("notable_deals")} rows={3} className={inputCls} placeholder="Led Series A in …, exited … to …" />
                  </Field>
                </div>
              </Block>

              <Block kicker="Section 04" title="Screen presence">
                <Grid>
                  <Field label="LinkedIn URL" error={errors.linkedin_url?.message}>
                    <input {...register("linkedin_url")} className={inputCls} placeholder="https://linkedin.com/in/…" />
                  </Field>
                  <Field label="Website / fund page" error={errors.website_url?.message}>
                    <input {...register("website_url")} className={inputCls} placeholder="https://…" />
                  </Field>
                  <Field label="Headshot URL" error={errors.headshot_url?.message}>
                    <input {...register("headshot_url")} className={inputCls} placeholder="https://…/headshot.jpg" />
                  </Field>
                  <Field label="Signature quote" error={errors.quote?.message}>
                    <input {...register("quote")} className={inputCls} placeholder="&ldquo;Show me retention, not vision.&rdquo;" />
                  </Field>
                </Grid>
                <div className="mt-6 space-y-6">
                  <Field label="Short bio" error={errors.bio?.message}>
                    <textarea {...register("bio")} rows={4} className={inputCls} placeholder="Two or three lines we can put on air." />
                  </Field>
                  <Field label="Why they belong on the panel" required error={errors.why_fit?.message}>
                    <textarea {...register("why_fit")} rows={5} className={inputCls} placeholder="Make the case — sharpness, sector depth, on-camera energy." />
                  </Field>
                </div>
              </Block>

              <div className="flex items-center justify-between gap-6 flex-wrap pt-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground max-w-sm">
                  We contact the nominee directly. Your name is shared as the referrer.
                </p>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-[var(--crimson)] text-white px-10 py-4 font-mono text-[11px] uppercase tracking-[0.3em] disabled:opacity-50 hover:bg-foreground hover:text-background transition-colors"
                >
                  {mutation.isPending ? "Sending…" : "Send nomination →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

const inputCls =
  "w-full bg-[var(--surface)] border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--crimson)] transition-colors";

function Block({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-8 first:border-0 first:pt-0">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--crimson)]">{kicker}</div>
      <h3 className="font-display text-2xl mt-1 mb-6">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-6">{children}</div>;
}

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
        <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--crimson)]">{error}</span>
      )}
    </label>
  );
}
