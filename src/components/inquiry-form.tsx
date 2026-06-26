import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitTicketInquiry, submitSponsorInquiry, submitApplication } from "@/lib/submissions.functions";
import { ticketInquirySchema, sponsorInquirySchema, applicationSchema } from "@/lib/schemas";

const inputCls = "w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 block">{label}</span>
      {children}
      {error && <span className="text-[10px] text-[var(--crimson)] font-mono mt-1 block">{error}</span>}
    </label>
  );
}

export function TicketInquiryForm({ defaultTier = "Paddock", defaultRound = "R01" }: { defaultTier?: "Grandstand" | "Paddock" | "Paddock Club VIP"; defaultRound?: string } = {}) {
  const [v, setV] = useState({ name: "", email: "", phone: "", tier: defaultTier, seats: 2, episode_round: defaultRound, notes: "" });

  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const m = useMutation({
    mutationFn: (d: any) => submitTicketInquiry({ data: d }),
    onSuccess: () => { setDone(true); toast.success("Inquiry received — our team will reply within 24h."); },
    onError: (e: Error) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = ticketInquirySchema.safeParse(v);
    if (!p.success) { const x: any = {}; p.error.issues.forEach(i => x[i.path[0] as string] = i.message); setErrs(x); return; }
    setErrs({}); m.mutate(p.data);
  }
  if (done) return <Done title="Inquiry received." sub="Our box office will email you a private booking link shortly." />;
  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
      <Field label="Full name" error={errs.name}><input className={inputCls} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></Field>
      <Field label="Email" error={errs.email}><input type="email" className={inputCls} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /></Field>
      <Field label="Phone (optional)" error={errs.phone}><input className={inputCls} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /></Field>
      <Field label="Round"><input className={inputCls} value={v.episode_round} onChange={(e) => setV({ ...v, episode_round: e.target.value })} /></Field>
      <Field label="Tier" error={errs.tier}><select className={inputCls} value={v.tier} onChange={(e) => setV({ ...v, tier: e.target.value as any })}><option>Grandstand</option><option>Paddock</option><option>Paddock Club VIP</option></select></Field>
      <Field label="Seats" error={errs.seats}><input type="number" min={1} max={20} className={inputCls} value={v.seats} onChange={(e) => setV({ ...v, seats: Number(e.target.value) })} /></Field>
      <div className="md:col-span-2"><Field label="Notes (optional)" error={errs.notes}><textarea rows={3} className={inputCls} value={v.notes} onChange={(e) => setV({ ...v, notes: e.target.value })} /></Field></div>
      <button disabled={m.isPending} className="md:col-span-2 bg-[var(--crimson)] text-white py-3 font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-50">{m.isPending ? "Sending…" : "Reserve my seats →"}</button>
    </form>
  );
}

export function SponsorInquiryForm() {
  const [v, setV] = useState({ brand: "", contact_name: "", email: "", phone: "", tier: "Title", budget_range: "₹1 Cr – ₹5 Cr", message: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const m = useMutation({
    mutationFn: (d: any) => submitSponsorInquiry({ data: d }),
    onSuccess: () => { setDone(true); toast.success("Inquiry received."); },
    onError: (e: Error) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = sponsorInquirySchema.safeParse(v);
    if (!p.success) { const x: any = {}; p.error.issues.forEach(i => x[i.path[0] as string] = i.message); setErrs(x); return; }
    setErrs({}); m.mutate(p.data);
  }
  if (done) return <Done title="Inquiry filed." sub="Our partnerships team will respond within 48 hours." />;
  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
      <Field label="Brand" error={errs.brand}><input className={inputCls} value={v.brand} onChange={(e) => setV({ ...v, brand: e.target.value })} /></Field>
      <Field label="Your name" error={errs.contact_name}><input className={inputCls} value={v.contact_name} onChange={(e) => setV({ ...v, contact_name: e.target.value })} /></Field>
      <Field label="Email" error={errs.email}><input type="email" className={inputCls} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /></Field>
      <Field label="Phone (optional)"><input className={inputCls} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /></Field>
      <Field label="Tier"><select className={inputCls} value={v.tier} onChange={(e) => setV({ ...v, tier: e.target.value })}><option>Title</option><option>Presenting</option><option>Round</option><option>Founder Bay</option><option>Other</option></select></Field>
      <Field label="Budget range"><input className={inputCls} value={v.budget_range} onChange={(e) => setV({ ...v, budget_range: e.target.value })} /></Field>
      <div className="md:col-span-2"><Field label="Message" error={errs.message}><textarea rows={4} className={inputCls} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} /></Field></div>
      <button disabled={m.isPending} className="md:col-span-2 bg-[var(--crimson)] text-white py-3 font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-50">{m.isPending ? "Sending…" : "Talk to partnerships →"}</button>
    </form>
  );
}

export function ApplicationForm() {
  const [v, setV] = useState({
    founder_name: "", email: "", phone: "", startup_name: "", sector: "", city: "", stage: "Seed",
    mrr: "" as any, ask_amount: "" as any, valuation: "" as any, pitch: "", deck_url: "",
  });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const m = useMutation({
    mutationFn: (d: any) => submitApplication({ data: d }),
    onSuccess: () => { setDone(true); toast.success("Application submitted to Pitch Control."); },
    onError: (e: Error) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean: any = { ...v, mrr: v.mrr === "" ? null : Number(v.mrr), ask_amount: v.ask_amount === "" ? null : Number(v.ask_amount), valuation: v.valuation === "" ? null : Number(v.valuation) };
    const p = applicationSchema.safeParse(clean);
    if (!p.success) { const x: any = {}; p.error.issues.forEach(i => x[i.path[0] as string] = i.message); setErrs(x); toast.error("Fix the highlighted fields"); return; }
    setErrs({}); m.mutate(p.data);
  }
  if (done) return <Done title="Welcome to the funnel." sub="Pitch Control will review your submission. Top 200 get a shortlist call." />;
  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
      <Field label="Founder name" error={errs.founder_name}><input className={inputCls} value={v.founder_name} onChange={(e) => setV({ ...v, founder_name: e.target.value })} /></Field>
      <Field label="Email" error={errs.email}><input type="email" className={inputCls} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /></Field>
      <Field label="Phone" error={errs.phone}><input className={inputCls} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /></Field>
      <Field label="Startup" error={errs.startup_name}><input className={inputCls} value={v.startup_name} onChange={(e) => setV({ ...v, startup_name: e.target.value })} /></Field>
      <Field label="Sector"><input className={inputCls} value={v.sector} onChange={(e) => setV({ ...v, sector: e.target.value })} /></Field>
      <Field label="City"><input className={inputCls} value={v.city} onChange={(e) => setV({ ...v, city: e.target.value })} /></Field>
      <Field label="Stage"><select className={inputCls} value={v.stage} onChange={(e) => setV({ ...v, stage: e.target.value })}>{["Pre-seed","Seed","Series A","Series B+"].map(s => <option key={s}>{s}</option>)}</select></Field>
      <Field label="MRR (₹)"><input type="number" min={0} className={inputCls} value={v.mrr} onChange={(e) => setV({ ...v, mrr: e.target.value })} /></Field>
      <Field label="Ask (₹)"><input type="number" min={0} className={inputCls} value={v.ask_amount} onChange={(e) => setV({ ...v, ask_amount: e.target.value })} /></Field>
      <Field label="Valuation (₹)"><input type="number" min={0} className={inputCls} value={v.valuation} onChange={(e) => setV({ ...v, valuation: e.target.value })} /></Field>
      <div className="md:col-span-2"><Field label="Deck URL" error={errs.deck_url}><input className={inputCls} value={v.deck_url} onChange={(e) => setV({ ...v, deck_url: e.target.value })} placeholder="https://" /></Field></div>
      <div className="md:col-span-2"><Field label="Pitch (40 – 2000 chars)" error={errs.pitch}><textarea rows={8} className={inputCls} value={v.pitch} onChange={(e) => setV({ ...v, pitch: e.target.value })} /></Field></div>
      <button disabled={m.isPending} className="md:col-span-2 bg-[var(--crimson)] text-white py-4 font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-50 glow-crimson">{m.isPending ? "Submitting…" : "Submit to the Arena →"}</button>
    </form>
  );
}

function Done({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="bg-[var(--surface)] ring-1 ring-[var(--gold)]/40 p-10 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">Submitted</div>
      <h3 className="font-display text-4xl mt-3">{title}</h3>
      <p className="text-sm text-muted-foreground mt-3">{sub}</p>
    </div>
  );
}