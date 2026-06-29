import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { TicketInquiryForm } from "@/components/inquiry-form";

type Tier = "Grandstand" | "Paddock" | "Paddock Club VIP";


export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Tickets — Be in the Paddock | BKL Sharks Delhi · Premiere Episode" },
      { name: "description", content: "Grandstand, Paddock and Paddock Club VIP access to the BKL Sharks premiere — first ever live show on OTT & YouTube. Siri Fort Auditorium, New Delhi · 5 September · Lights out 19:00 IST." },
      { property: "og:title", content: "Tickets — BKL Sharks Premiere · Delhi" },
      { property: "og:description", content: "First-ever live show on OTT & YouTube. Grandstand from ₹499." },
    ],
  }),
  component: TicketsPage,
});

const TIERS = [
  { name: "Grandstand", price: "₹499", strike: "₹2,499", accent: "text-foreground", featured: false,
    items: ["Full venue view from rear stand", "Live audience vote panel", "Round-program booklet", "Post-show meme-wall entry"],
    cta: "Book Grandstand" },
  { name: "Paddock", price: "₹2,499", strike: "₹4,999", accent: "text-[var(--crimson)]", featured: true,
    items: ["On-camera floor seat", "Founder mixer entry", "Reaction-cam feature on JioCinema + YouTube", "Signed Premiere program · numbered"],
    cta: "Book Paddock" },
  { name: "Paddock Club VIP", price: "₹4,999", strike: "₹9,999", accent: "text-[var(--gold)]", featured: false,
    items: ["Backstage tunnel access", "Pre-show meet with all 5 sharks", "Investor lounge entry", "After-party at The Lodhi · Delhi"],
    cta: "Book Paddock Club" },
];

const SCHEDULE = [
  { time: "16:00", phase: "Gates Open", note: "Lobby activation · sponsor wall · founder photo ops" },
  { time: "17:30", phase: "Founder Walk", note: "All 12 founders walk the tunnel · cameras live" },
  { time: "18:30", phase: "Driver Parade", note: "Sharks introduced to the room · audience vote opens" },
  { time: "19:00", phase: "Lights Out", note: "Episode 01 begins · first founder under the spotlight · live on OTT + YouTube" },
  { time: "21:45", phase: "Verdict", note: "Final votes · live cheque ceremony" },
  { time: "22:30", phase: "After Party", note: "Paddock Club only · founders + sharks + press" },
];

const VENUE = [
  ["1,800", "Seats"],
  ["12", "Cameras live"],
  ["62%", "On-camera rate"],
  ["1", "Stage · one spotlight"],
];

const FAQ = [
  ["Where is the venue?", "Siri Fort Auditorium, August Kranti Marg, New Delhi. Auditorium I, Level 1."],
  ["When does it go live?", "Premiere Episode 01 streams live on JioCinema and the BKL Sharks YouTube channel from 19:00 IST on 5 September."],
  ["What's the dress code?", "Smart-casual. Paddock Club: black tie optional. No bright colours on Floor — you'll be on camera."],
  ["Can I bring my phone?", "Phones are pouched on entry to prevent leaks. You get them back at intermission."],
  ["Are tickets refundable?", "Non-refundable. Transferable up to 72 hours before lights out via the BKL Sharks app."],
  ["Will I be on TV?", "If you're seated Paddock or VIP, statistically yes. By entering, you grant on-air consent for OTT & YouTube broadcast."],
];

function TicketsPage() {
  const [tier, setTier] = useState<Tier>("Paddock");
  function book(t: Tier) {
    setTier(t);
    setTimeout(() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }
  return (

    <>
      <PageHero
        eyebrow="Premiere Episode · Live on OTT + YouTube · Siri Fort, New Delhi · 5 Sep · 19:00 IST"
        title={<>Be in the room <span className="italic text-[var(--silver)]/70">when it breaks.</span></>}
        lede="Eighteen hundred seats. Twelve hundred released to the public. The room makes the show — your reactions go on camera."
      >
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-border max-w-2xl">
          {[["28", "DAYS"], ["14", "HRS"], ["42", "MIN"], ["18", "SEC"]].map(([n, l]) => (
            <div key={l} className="bg-background p-5 text-center">
              <div className="font-display text-4xl">{n}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* TIERS */}
      <section className="py-20 px-6 border-b border-border">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <article key={t.name} className={`relative p-10 ring-1 flex flex-col ${t.featured ? "bg-[var(--surface-2)] ring-[var(--crimson)]/40 glow-crimson" : "bg-[var(--surface)] ring-border"}`}>
              {t.featured && <span className="absolute -top-3 left-10 font-mono text-[9px] uppercase tracking-[0.3em] bg-[var(--crimson)] text-white px-2 py-1">Selling Fastest</span>}
              <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${t.accent} mb-4`}>{t.name}</span>
              <div className="flex items-baseline gap-3 mb-1">
                <div className="font-display text-5xl md:text-6xl">{t.price}</div>
                <div className="font-mono text-sm text-muted-foreground line-through">{t.strike}</div>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-8">Premiere launch price · + 18% GST</div>
              <ul className="space-y-3 text-sm text-muted-foreground mb-10 flex-1">
                {t.items.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 size-1 bg-[var(--crimson)] shrink-0" />{i}
                  </li>
                ))}
              </ul>
              <button onClick={() => book(t.name as Tier)} className={`w-full py-3 text-xs uppercase tracking-[0.22em] transition-colors ${t.featured ? "bg-[var(--crimson)] text-white hover:bg-[var(--crimson)]/90" : "bg-foreground text-background hover:bg-[var(--silver)]"}`}>{t.cta}</button>
            </article>
          ))}
        </div>
        <div className="mx-auto max-w-6xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {VENUE.map(([k, v]) => (
            <div key={v} className="bg-background p-8 text-center">
              <div className="font-display text-4xl mb-2">{k}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SCHEDULE — PITCH WEEKEND */}
      <section className="py-24 px-6 border-b border-border">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h2 className="font-display text-3xl md:text-4xl">Pitch-night schedule</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">05 SEP · IST</span>
          </div>
          <ol className="bg-[var(--surface)] ring-1 ring-border">
            {SCHEDULE.map((s, i) => (
              <li key={s.phase} className={`grid grid-cols-12 gap-4 px-6 py-5 ${i < SCHEDULE.length - 1 ? "border-b border-border" : ""} hover:bg-[var(--surface-2)] transition-colors`}>
                <div className="col-span-3 md:col-span-2 font-mono text-lg text-[var(--gold)]">{s.time}</div>
                <div className="col-span-9 md:col-span-3 font-display text-xl">{s.phase}</div>
                <div className="col-span-12 md:col-span-7 text-sm text-muted-foreground self-center">{s.note}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SEAT MAP placeholder */}
      <section className="py-24 px-6 border-b border-border">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl mb-10">The Circuit · Siri Fort Auditorium, New Delhi</h2>
          <div className="aspect-[16/9] bg-[var(--surface)] ring-1 ring-border relative overflow-hidden grid-lines">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="size-32 bg-[var(--crimson)]/20 ring-2 ring-[var(--crimson)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--crimson)]">STAGE</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">One spotlight · Five sharks · 1,800 witnesses</div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.3em] text-muted-foreground">N · SIRI FORT · NEW DELHI</div>
            <div className="absolute top-4 right-4 font-mono text-[9px] tracking-[0.3em] text-[var(--crimson)]"><span className="size-1.5 rounded-full bg-[var(--crimson)] inline-block live-blink mr-2 align-middle" />62% SOLD</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl mb-10">Questions from the queue</h2>
          <ul className="divide-y divide-border border-y border-border">
            {FAQ.map(([q, a]) => (
              <li key={q} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                <h3 className="md:col-span-5 font-display text-xl">{q}</h3>
                <p className="md:col-span-7 text-muted-foreground leading-relaxed">{a}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="book" className="py-24 px-6 border-t border-border scroll-mt-24">
        <div className="mx-auto max-w-4xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3">Box office · {tier}</div>
          <h2 className="font-display text-3xl md:text-4xl mb-3">Hold your seat.</h2>
          <p className="text-muted-foreground mb-10 max-w-xl">Tell us tier and round — we'll send a private booking + checkout link to your inbox within 24 hours. Payment is handled off-platform by our box-office team.</p>
          <TicketInquiryForm key={tier} defaultTier={tier} />
        </div>
      </section>

    </>
  );
}