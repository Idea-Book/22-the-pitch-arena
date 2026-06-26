import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/legal/refunds")({
  head: () => ({
    meta: [
      { title: "Refund &amp; Cancellation Policy — BKL Sharks" },
      { name: "description", content: "Refund and cancellation rules for BKL Sharks tickets, sponsorship and merch." },
    ],
  }),
  component: () => (
    <LegalPage eyebrow="Refunds · Effective 26 June 2026" title="Refund &amp; Cancellation Policy" lede="The pit-lane rules for ticketing, sponsorship and merch.">
      <Block title="Tickets">
        All ticket sales are <strong>non-refundable</strong>. You may transfer a ticket to another individual up to 72 hours before lights-out via the BKL Sharks app. Name on the ticket must match a valid government ID at the gate.
      </Block>
      <Block title="Show cancellation by us">
        If we cancel or reschedule a taping for reasons within our control, we will offer a full refund or a seat at the next available taping at the same tier — your choice.
      </Block>
      <Block title="Force majeure">
        For postponement due to force majeure (weather, public-health orders, venue lockdown), we will rebook you at no extra cost. No cash refund is owed in these cases.
      </Block>
      <Block title="Sponsorship">
        Sponsorship contracts follow the cancellation terms agreed in your signed insertion order. Default policy: 50% refund if cancelled 30+ days before the taping, none thereafter.
      </Block>
      <Block title="Merch">
        Unopened merchandise can be returned within 7 days of delivery for a full refund. Return shipping borne by buyer unless the item is defective.
      </Block>
      <Block title="How to request">
        Email refunds@bklsharks.com with your order ID. Confirmed refunds reach the original payment method within 7–10 business days.
      </Block>
    </LegalPage>
  ),
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 border-b border-border">
      <h2 className="font-display text-2xl mb-3">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}
