import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-background overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.97 0 0 / 0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5 mb-16">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <span aria-hidden className="inline-flex items-center justify-center size-9 bg-[var(--crimson)] text-white font-mono text-sm font-bold rounded-sm">B</span>
              <span className="font-display text-3xl tracking-tight">
                BKL <span className="text-[var(--crimson)]">SHARKS</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[36ch] leading-relaxed mb-6">
              India's most uncensored founder bloodsport. Built in Delhi. Aimed at
              the world. No edits. No safety nets. <span className="italic">No prisoners.</span>
            </p>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="size-2 rounded-full bg-[var(--crimson)] live-blink" />
              S01 · EP01 PREMIERE · 05 SEP · SIRI FORT · DELHI
            </div>
          </div>

          <FooterCol
            title="Show"
            items={[
              { to: "/episodes", label: "Episodes" },
              { to: "/panelists", label: "Panelists" },
              { to: "/founders", label: "Grid Standings" },
              { to: "/community", label: "Community" },
            ]}
          />
          <FooterCol
            title="Paddock"
            items={[
              { to: "/apply", label: "Apply to Pitch" },
              { to: "/tickets", label: "Tickets" },
              { to: "/sponsors", label: "Sponsorship" },
              { to: "/invite-panelist", label: "Nominate a Shark" },
            ]}
          />
          <FooterCol
            title="Brand"
            items={[
              { to: "/press-kit", label: "Press Kit" },
              { to: "/partners", label: "Partners" },
              { to: "/creators", label: "Creator Network" },
            ]}
          />
        </div>

        <div className="flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-mono border-t border-border pt-6 mb-6">
          <Link to="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link to="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/legal/refunds" className="hover:text-foreground transition-colors">Refunds &amp; Cancellation</Link>
          <a href="mailto:press@bklsharks.com" className="hover:text-foreground transition-colors">Press</a>
          <a href="mailto:legal@bklsharks.com" className="hover:text-foreground transition-colors">Legal</a>
        </div>




        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-border pt-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
            © 2026 BKL Sharks Media · Made in Bharat. Aimed at the world.
          </span>
          <div className="flex gap-5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="#" className="hover:text-foreground transition-colors">YouTube</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { to: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 mb-1">
        {title}
      </span>
      {items.map((i, idx) => (
        <Link
          key={idx}
          to={i.to}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {i.label}
        </Link>
      ))}
    </div>
  );
}