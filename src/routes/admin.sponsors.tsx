import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsList } from "@/components/admin/submissions-list";

export const Route = createFileRoute("/admin/sponsors")({
  component: () => <SubmissionsList
    table="sponsor_inquiries"
    title="Sponsor inquiries"
    subtitle="Brand interest from /sponsors."
    columns={[
      { key: "brand", label: "Brand" },
      { key: "contact_name", label: "Contact" },
      { key: "email", label: "Email" },
      { key: "tier", label: "Tier" },
      { key: "budget_range", label: "Budget" },
    ]}
    expand={(r) => r.message ? <p className="text-sm">{r.message}</p> : null}
  />,
});