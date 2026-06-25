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
            <Link to="/" className="font-display text-3xl tracking-tight block mb-4">
              THE ARENA
            </Link>
            <p className="text-sm text-muted-foreground max-w-[34ch] leading-relaxed">
              An independent production exploring the limits of founder psychology
              and market darwinism. Built for those who build.
            </p>
          </div>

          <FooterCol
            title="Show"
            items={[
              { to: "/episodes", label: "Episodes" },
              { to: "/panelists", label: "Panelists" },
              { to: "/founders", label: "Founders" },
              { to: "/community", label: "Community" },
            ]}
          />
          <FooterCol
            title="Get In"
            items={[
              { to: "/apply", label: "Apply to Pitch" },
              { to: "/tickets", label: "Tickets" },
              { to: "/sponsors", label: "Sponsorship" },
            ]}
          />
          <FooterCol
            title="Brand"
            items={[
              { to: "/sponsors", label: "Press Kit" },
              { to: "/sponsors", label: "Partners" },
              { to: "/community", label: "Creator Network" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-border pt-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
            © 2026 The Arena Media Group · No rights reserved to the weak.
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