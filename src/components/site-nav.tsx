import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const { user, isStaff, isAdmin, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* PITCH CONTROL TICKER */}
      <div className="fixed top-0 inset-x-0 z-[60] h-7 bg-[var(--crimson)] text-white overflow-hidden border-b border-white/10">
        <div className="flex items-center h-full">
          <span className="shrink-0 h-full flex items-center gap-2 px-3 bg-black/30 font-mono text-[9px] uppercase tracking-[0.3em]">
            <span className="size-1.5 rounded-full bg-white live-blink" />
            Pitch Control
          </span>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex gap-10 whitespace-nowrap ticker-fast font-mono text-[10px] uppercase tracking-[0.25em]">
              {[...Array(2)].map((_, k) => (
                <span key={k} className="flex gap-10 pr-10">
                  <span>S02 · LIGHTS OUT 14 NOV · MUMBAI</span>
                  <span className="text-white/70">▲ AARAV IYER P1 · GRIDSPARK ₹4.2 CR CLOSED</span>
                  <span>● LIVE QUALI · DELHI 19:30 IST</span>
                  <span className="text-white/70">▼ KABIR VERMA WALK-OFF · LAP 7</span>
                  <span>● 12 SHARKS · 16 ROUNDS · 1 STAGE</span>
                  <span className="text-white/70">▲ MEERA NAIR FASTEST CLOSE · 04:11</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    <nav
      className={`fixed top-7 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span aria-hidden className="inline-flex items-center justify-center size-6 bg-[var(--crimson)] text-white font-mono text-[10px] font-bold rounded-sm group-hover:rotate-[8deg] transition-transform">B</span>
          <span className="font-display text-xl tracking-tight">
            BKL <span className="text-[var(--crimson)]">SHARKS</span>
          </span>
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
          <span className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[var(--crimson)] live-blink" />
            On Air
          </span>
          {!loading && isStaff && (
            <Link to="/admin" className="hidden md:inline-flex items-center bg-[var(--surface)] ring-1 ring-border px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] hover:bg-[var(--surface-2)]">
              {isAdmin ? "Admin" : "Mod"}
            </Link>
          )}
          {!loading && (user ? (
            <button
              onClick={async () => { await supabase.auth.signOut(); toast.success("Signed out"); }}
              className="hidden md:inline-flex items-center px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
            >Sign out</button>
          ) : (
            <Link to="/auth" className="hidden md:inline-flex items-center px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">Sign in</Link>
          ))}
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
    </>
  );
}