import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsList } from "@/components/admin/submissions-list";

export const Route = createFileRoute("/_authenticated/admin/tickets")({
  component: () => <SubmissionsList
    table="ticket_inquiries"
    title="Ticket inquiries"
    subtitle="Audience booking requests from /tickets."
    columns={[
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "tier", label: "Tier" },
      { key: "seats", label: "Seats" },
      { key: "episode_round", label: "Round" },
    ]}
    expand={(r) => r.notes ? <p className="text-sm">{r.notes}</p> : null}
  />,
});