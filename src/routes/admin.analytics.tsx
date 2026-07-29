import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { adminAnalytics } from "@/lib/settings.functions";
import { AdminHeader } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsAdmin });

type Point = { date: string; value: number };
type Slice = { label: string; value: number };

function Spark({ points, color = "var(--electric)" }: { points: Point[]; color?: string }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="flex items-end gap-[2px] h-16">
      {points.map((p) => (
        <div
          key={p.date}
          title={`${p.date}: ${p.value}`}
          className="flex-1 min-w-[2px]"
          style={{ height: `${Math.max(2, (p.value / max) * 100)}%`, background: color, opacity: p.value ? 1 : 0.25 }}
        />
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className="font-display text-4xl mt-2 tabular-nums">{value.toLocaleString("en-IN")}</div>
    </div>
  );
}

function Bars({ title, data }: { title: string; data: Slice[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="bg-background ring-1 ring-border p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">{title}</div>
      {data.length === 0 && <p className="text-xs text-muted-foreground font-mono">No data yet.</p>}
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label}>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="truncate max-w-[70%]">{d.label}</span>
              <span className="tabular-nums text-muted-foreground">{d.value}</span>
            </div>
            <div className="h-1.5 bg-[var(--surface)]">
              <div className="h-full bg-[var(--crimson)]" style={{ width: `${(d.value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const RANGES = [7, 30, 90];

function AnalyticsAdmin() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useQuery({
    queryKey: ["adminAnalytics", days],
    queryFn: () => adminAnalytics({ data: { days } }),
  });

  return (
    <>
      <AdminHeader
        title="Analytics"
        subtitle="Traffic, funnel and submission trends across the show."
        actions={
          <div className="flex gap-px bg-border ring-1 ring-border">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDays(r)}
                className={`px-3 py-2 text-[10px] font-mono uppercase tracking-[0.25em] ${days === r ? "bg-foreground text-background" : "bg-background text-muted-foreground"}`}
              >
                {r}d
              </button>
            ))}
          </div>
        }
      />

      {isLoading || !data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border ring-1 ring-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-background p-5 h-[104px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border ring-1 ring-border">
            <Stat label="Page views" value={data.totals.pageViews} />
            <Stat label="Sessions" value={data.totals.sessions} />
            <Stat label="New users" value={data.totals.newUsers} />
            <Stat label="Applications" value={data.totals.applications} />
            <Stat label="Ticket inquiries" value={data.totals.ticketInquiries} />
            <Stat label="Seats requested" value={data.totals.ticketSeats} />
            <Stat label="Sponsor inquiries" value={data.totals.sponsorInquiries} />
            <Stat label="Talent + invites" value={data.totals.talentApplications + data.totals.panelInvites} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {([
              ["Page views", data.series.pageViews, "var(--electric)"],
              ["Applications", data.series.applications, "var(--crimson)"],
              ["Community posts", data.series.posts, "var(--electric)"],
              ["Ticket inquiries", data.series.tickets, "var(--crimson)"],
            ] as [string, Point[], string][]).map(([label, points, color]) => (
              <div key={label} className="bg-background ring-1 ring-border p-5">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
                  <div className="font-display text-2xl tabular-nums">{points.reduce((s, p) => s + p.value, 0)}</div>
                </div>
                <Spark points={points} color={color} />
                <div className="flex justify-between font-mono text-[9px] text-muted-foreground mt-2">
                  <span>{points[0]?.date}</span>
                  <span>{points[points.length - 1]?.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Bars title="Top pages" data={data.breakdowns.topPaths} />
            <Bars title="Referrers" data={data.breakdowns.referrers} />
            <Bars title="Application status" data={data.breakdowns.applicationStatus} />
            <Bars title="Product stage" data={data.breakdowns.applicationStage} />
            <Bars title="Customer segment" data={data.breakdowns.applicationSegment} />
            <Bars title="Ticket tiers" data={data.breakdowns.ticketTiers} />
            <Bars title="Talent roles" data={data.breakdowns.talentRoles} />
            <Bars title="Post status" data={data.breakdowns.postStatus} />
          </div>
        </div>
      )}
    </>
  );
}
