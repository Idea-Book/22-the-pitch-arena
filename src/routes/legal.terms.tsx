import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — BKL Sharks" },
      { name: "description", content: "The terms governing your use of BKL Sharks — the live pitch show, the website, the community, and the apply funnel." },
    ],
  }),
  component: () => (
    <LegalPage eyebrow="Legal · Effective 26 June 2026" title="Terms of Service" lede="Plain-English rules for everything we run — the live show, the community, the apply funnel, the merch drops.">
      <Section title="1. Who we are">
        BKL Sharks Media Pvt. Ltd. ("we", "us", "BKL Sharks") is a registered Indian media company headquartered in Mumbai, India. We produce the live pitch show BKL Sharks at NMACC and operate the website bklsharks.com (the "Service").
      </Section>
      <Section title="2. Using the Service">
        By using the Service you agree to these Terms. You must be 18+ to apply to pitch or post in the community. We may suspend accounts that violate these Terms or our Community Guidelines without notice.
      </Section>
      <Section title="3. User content">
        You retain ownership of what you post — pitches, comments, reactions, media. By posting you grant us a worldwide, royalty-free licence to host, broadcast, distribute and excerpt that content across the show, social, and partner channels.
      </Section>
      <Section title="4. Tickets, apply &amp; sponsorship">
        Ticket inquiries, applications and sponsorship enquiries are subject to acceptance. Tickets are non-refundable; see Refund Policy. Pitch acceptance is at sole editorial discretion.
      </Section>
      <Section title="5. Liability">
        The Service is provided "as is". To the maximum extent permitted by Indian law, our aggregate liability for any claim is capped at ₹10,000 or the amount you paid us in the last 12 months — whichever is higher.
      </Section>
      <Section title="6. Governing law">
        These Terms are governed by the laws of India. Exclusive jurisdiction lies with the courts of Mumbai.
      </Section>
      <Section title="7. Contact">legal@bklsharks.com</Section>
    </LegalPage>
  ),
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 border-b border-border">
      <h2 className="font-display text-2xl mb-3">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}
