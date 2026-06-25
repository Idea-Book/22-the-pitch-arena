import { Link, useRouterState } from "@tanstack/react-router";

export function StickyPitchCTA() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/apply") return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        to="/apply"
        className="group flex items-center gap-3 bg-[var(--crimson)] pl-4 pr-5 h-12 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_60px_-12px_oklch(0.55_0.19_25/0.6)] ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
        </span>
        Pitch Live
      </Link>
    </div>
  );
}