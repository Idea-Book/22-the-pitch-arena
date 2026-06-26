import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsList } from "@/components/admin/submissions-list";

export const Route = createFileRoute("/admin/applications")({
  component: () => <SubmissionsList
    table="applications"
    title="Founder applications"
    subtitle="Review applications submitted via /apply. Triage with status updates."
    columns={[
      { key: "founder_name", label: "Founder" },
      { key: "startup_name", label: "Startup" },
      { key: "sector", label: "Sector" },
      { key: "city", label: "City" },
      { key: "email", label: "Email" },
    ]}
    expand={(r) => <div className="text-sm leading-relaxed space-y-2">
      <div><span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.25em]">Pitch · </span>{r.pitch}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
        <span>MRR ₹{r.mrr ?? "—"}</span>
        <span>Ask ₹{r.ask_amount ?? "—"}</span>
        <span>Val ₹{r.valuation ?? "—"}</span>
        <span>Stage {r.stage ?? "—"}</span>
      </div>
      {r.deck_url && <a className="text-[var(--electric)] text-xs underline" href={r.deck_url} target="_blank" rel="noreferrer">Deck →</a>}
    </div>}
  />,
});