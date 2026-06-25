import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/episodes", label: "Episodes" },
  { to: "/panelists", label: "Panelists" },
  { to: "/founders", label: "Founders" },
  { to: "/tickets", label: "Tickets" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/community", label: "Community" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl tracking-tight">
          THE ARENA
        </Link>

        <div className="hidden gap-7 text-[13px] text-muted-foreground md:flex">
          {NAV.slice(1).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/apply"
            className="hidden sm:inline-flex items-center bg-foreground px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-background transition-transform active:scale-95 hover:bg-[var(--silver)]"
          >
            Pitch Live
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center border border-border"
          >
            <span className="block h-px w-4 bg-foreground" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-3 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}