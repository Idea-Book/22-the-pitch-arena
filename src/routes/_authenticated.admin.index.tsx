import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/admin.functions";
import { AdminHeader } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

const LABELS: Record<string, string> = {
  community_posts: "Posts", post_comments: "Comments", reports: "Reports",
  applications: "Applications", ticket_inquiries: "Ticket inquiries",
  sponsor_inquiries: "Sponsor inquiries", episodes: "Episodes",
  panelists: "Panelists", founders: "Founders", profiles: "Users",
};
const LINKS: Record<string, string> = {
  community_posts: "/admin/posts", reports: "/admin/reports",
  applications: "/admin/applications", ticket_inquiries: "/admin/tickets",
  sponsor_inquiries: "/admin/sponsors", episodes: "/admin/episodes",
  panelists: "/admin/panelists", founders: "/admin/founders", profiles: "/admin/users",
};

function Dashboard() {
  const { data } = useSuspenseQuery({ queryKey: ["adminStats"], queryFn: () => adminStats() });
  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Live counts across the database. Click a tile to manage." />
      {data.openReports > 0 && (
        <Link to="/admin/reports" className="block bg-[var(--crimson)] text-white px-5 py-4 mb-6 font-mono text-[11px] uppercase tracking-[0.3em]">
          ▲ {data.openReports} open report{data.openReports === 1 ? "" : "s"} need review →
        </Link>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border ring-1 ring-border">
        {Object.entries(data.counts).map(([k, v]) => {
          const inner = (
            <div className="bg-background p-5 hover:bg-[var(--surface)] transition-colors h-full">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{LABELS[k] ?? k}</div>
              <div className="font-display text-4xl mt-2 tabular-nums">{v}</div>
            </div>
          );
          return LINKS[k]
            ? <Link key={k} to={LINKS[k]}>{inner}</Link>
            : <div key={k}>{inner}</div>;
        })}
      </div>
    </>
  );
}