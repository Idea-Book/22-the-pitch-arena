import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import panel01 from "@/assets/panel-01.jpg";
import panel02 from "@/assets/panel-02.jpg";
import panel03 from "@/assets/panel-03.jpg";

export const Route = createFileRoute("/panelists")({
  head: () => ({
    meta: [
      { title: "The Council — Sharks | BKL Sharks" },
      { name: "description", content: "Meet the twelve operators, investors and unicorn founders who decide founder fates on BKL Sharks." },
      { property: "og:title", content: "The Council — BKL Sharks" },
      { property: "og:description", content: "The operators who decide founder fates in India's sharkest arena." },
    ],
  }),
  component: PanelistsPage,
});

const PANELISTS = [
  {
    img: panel01, name: "Vikram Mehra", tag: "The Hammer", aka: "MUM · #01",
    quote: "Profit is not a strategy. It is the only requirement to exist in my room.",
    roast: 95, appetite: "B2B Infra · Manufacturing", record: "12W / 4 KO", aum: "₹2,400 Cr", years: "27", deals: "44",
    bio: "Founder of two unicorns, one IPO. Sits on six boards. Has terminated more pitches on this show than anyone else.",
  },
  {
    img: panel02, name: "Riya Kapoor", tag: "The Architect", aka: "BLR · #02",
    quote: "I don't invest in products. I invest in founders who've survived a near-death experience.",
    roast: 62, appetite: "Vertical SaaS · Climate", record: "9W / 2 KO", aum: "₹3,800 Cr", years: "18", deals: "61",
    bio: "Ex-Sequoia partner turned solo GP. Backed 11 of India's top 50 SaaS exits. Patient until she isn't.",
  },
  {
    img: panel03, name: "Arjun Shetty", tag: "Velocity", aka: "BLR · #03",
    quote: "If your Bharat go-to-market fits on a slide, you don't have one. Show me the WhatsApp groups.",
    roast: 88, appetite: "Consumer · Bharat AI", record: "6W / 8 KO", aum: "₹950 Cr", years: "11", deals: "29",
    bio: "Founded a quick-commerce unicorn at 26. Sold at 31. Now hunts for the next one — and is brutal about it.",
  },
  {
    img: panel01, name: "Nikhil Joshi", tag: "The Closer", aka: "MUM · #04",
    quote: "Show me the door you walk through when the round doesn't close. That's the founder I back.",
    roast: 91, appetite: "Fintech · Payments", record: "11W / 5 KO", aum: "₹1,700 Cr", years: "20", deals: "38",
    bio: "Ex-RBI working group, two payments exits. Closes deals on stage in under 11 minutes — or not at all.",
  },
  {
    img: panel02, name: "Dr. Aisha Khan", tag: "The Algorithm", aka: "HYD · #05",
    quote: "Every founder lies on revenue. The unit economics don't. I'll wait while you do the math.",
    roast: 74, appetite: "Deep Tech · Healthtech", record: "7W / 3 KO", aum: "₹1,200 Cr", years: "15", deals: "22",
    bio: "PhD in computational biology. Built two healthtech companies. Has the calmest voice in the worst moments.",
  },
];

function PanelistsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Council · 12 Sharks"
        title={<>Five operators. <span className="italic text-[var(--silver)]/70">Zero patience.</span></>}
        lede="₹40,000 Cr deployed across the table. They have built, broken, and exited Indian empires. They are not here to mentor you. They are here to decide."
      />

      {/* DRIVER STANDINGS TABLE */}
      <section className="border-b border-border py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <h2 className="font-display text-2xl">Shark Standings · S01</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-[var(--crimson)] live-blink align-middle mr-2" />
              Live · Round 04 of 16
            </span>
          </div>
          <div className="bg-[var(--surface)] ring-1 ring-border overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  <th className="text-left px-5 py-3 w-12">Pos</th>
                  <th className="text-left px-5 py-3">Shark</th>
                  <th className="text-left px-5 py-3">Tag</th>
                  <th className="text-left px-5 py-3">Record</th>
                  <th className="text-left px-5 py-3">AUM</th>
                  <th className="text-right px-5 py-3">Kill Rate</th>
                </tr>
              </thead>
              <tbody>
                {PANELISTS.map((p, i) => (
                  <tr key={p.name} className="border-b border-border hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-5 py-4 font-display text-2xl text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-5 py-4">
                      <div className="font-display text-lg">{p.name}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.aka}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--crimson)]">{p.tag}</td>
                    <td className="px-5 py-4 font-mono text-xs">{p.record}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--gold)]">{p.aum}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-px w-20 bg-border"><div className="h-full bg-[var(--crimson)]" style={{ width: `${p.roast}%` }} /></div>
                        <span className="font-mono text-xs tabular-nums w-8 text-right">{p.roast}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DETAILED PROFILES */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl space-y-24">
          {PANELISTS.map((p, i) => (
            <article key={p.name + i} className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="md:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface ring-1 ring-border group">
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.3em] bg-background/80 backdrop-blur-md px-2 py-1 ring-1 ring-border">{p.aka}</div>
                  <div className="absolute bottom-4 right-4 font-display text-7xl text-white/90 leading-none drop-shadow-lg">{String(i + 1).padStart(2, "0")}</div>
                </div>
              </div>
              <div className="md:col-span-7 md:px-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-4 block">{p.tag}</span>
                <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">{p.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">{p.bio}</p>
                <blockquote className="font-display italic text-2xl text-[var(--silver)]/80 mb-8 max-w-lg leading-snug border-l-2 border-[var(--crimson)] pl-5">
                  "{p.quote}"
                </blockquote>
                <dl className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border ring-1 ring-border max-w-2xl">
                  {[
                    ["Roast", `${p.roast}%`, "text-[var(--crimson)]"],
                    ["Record", p.record, "text-foreground"],
                    ["AUM", p.aum, "text-[var(--gold)]"],
                    ["Years", p.years, "text-foreground"],
                    ["Deals", p.deals, "text-foreground"],
                  ].map(([label, value, color]) => (
                    <div key={label} className="bg-background p-4">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</dt>
                      <dd className={`font-display text-2xl ${color}`}>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Appetite · {p.appetite}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}