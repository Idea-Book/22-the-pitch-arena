import { Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

type Section = { to: string; label: string; admin?: boolean };
const SECTIONS: Section[] = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/posts", label: "Community posts" },
  { to: "/admin/episodes", label: "Episodes" },
  { to: "/admin/panelists", label: "Panelists" },
  { to: "/admin/founders", label: "Founders" },
  { to: "/admin/sponsor-content", label: "Sponsor info" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/tickets", label: "Tickets" },
  { to: "/admin/sponsors", label: "Sponsor inquiries" },
  { to: "/admin/users", label: "Users", admin: true },
];

export function AdminShell() {
  const { isAdmin, isStaff, loading } = useAuth();

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-xs font-mono text-muted-foreground">Loading…</div>;
  if (!isStaff) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-3">Access denied</div>
          <h1 className="font-display text-4xl">Staff only.</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-md">Your account doesn't have the admin or moderator role. Ask a Pitch Director to grant access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="mb-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">Pitch Control</div>
            <h2 className="font-display text-2xl">Admin</h2>
          </div>
          <nav className="flex flex-col">
            {SECTIONS.filter(s => s.admin ? isAdmin : true).map((s) => (
              <Link key={s.to} to={s.to as any}
                className="px-3 py-2 text-[12px] font-mono uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground hover:bg-[var(--surface)]"
                activeProps={{ className: "px-3 py-2 text-[12px] font-mono uppercase tracking-[0.22em] text-foreground bg-[var(--surface)] border-l-2 border-[var(--crimson)]" }}
                activeOptions={{ exact: s.to === "/admin" }}
              >{s.label}</Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0"><Outlet /></section>
      </div>
    </div>
  );
}

export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-4 mb-8 pb-5 border-b border-border">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">Pitch Control</div>
        <h1 className="font-display text-4xl mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="text-[10px] text-muted-foreground mt-1 font-mono">{hint}</p>}
      {error && <p className="text-[10px] text-[var(--crimson)] mt-1 font-mono">{error}</p>}
    </label>
  );
}

export const inputCls = "w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--electric)]";