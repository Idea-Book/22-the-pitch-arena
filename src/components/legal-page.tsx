import { PageHero } from "@/components/page-hero";

export function LegalPage({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={<>{title}</>} lede={lede} />
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">{children}</div>
      </section>
    </>
  );
}
