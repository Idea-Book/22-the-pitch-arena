import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BKL Sharks" },
      { name: "description", content: "How BKL Sharks collects, uses and protects your data — sign-ups, applications, community posts, tickets and sponsorship enquiries." },
    ],
  }),
  component: () => (
    <LegalPage eyebrow="Privacy · Effective 26 June 2026" title="Privacy Policy" lede="What we collect, why we collect it, and the controls you have over it.">
      <Block title="What we collect">
        Account: email, display name, avatar. Apply forms: contact details and pitch material. Community: posts, comments, reactions. Tickets &amp; sponsorship: contact + preferences.
      </Block>
      <Block title="How we use it">
        To run the show — review applications, send booking links, moderate the community, and contact you about your submissions. We do not sell personal data.
      </Block>
      <Block title="Subprocessors">
        Lovable Cloud (hosting, database, auth, file storage), email delivery providers, payment gateways for ticketing. All bound by data-protection agreements.
      </Block>
      <Block title="Retention">
        Account data is kept until you delete it. Applications retained for 24 months for casting history. Community moderation logs retained for 12 months.
      </Block>
      <Block title="Your controls">
        You can request export or deletion of your data anytime — email privacy@bklsharks.com. We respond within 30 days.
      </Block>
      <Block title="Cookies">
        We use first-party cookies for sign-in and basic analytics. No third-party ad cookies.
      </Block>
      <Block title="Contact">privacy@bklsharks.com</Block>
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
