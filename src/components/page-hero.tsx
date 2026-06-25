import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative pt-32 pb-20 px-6 border-b border-border overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 0%, oklch(0.97 0 0 / 0.06), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)] mb-6 block">
          {eyebrow}
        </span>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-[18ch] text-balance">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 text-muted-foreground max-w-xl text-pretty leading-relaxed">
            {lede}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}