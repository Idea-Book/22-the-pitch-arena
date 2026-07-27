import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ensureDemoAdmin, bootstrapGrantRole } from "@/lib/demo-auth.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/health")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "System Health — BKL Sharks" },
      { name: "description", content: "Live connection health for BKL Sharks: content reads, authentication and admin write access." },
      { property: "og:title", content: "System Health — BKL Sharks" },
      { property: "og:description", content: "Live connection health for BKL Sharks: content reads, authentication and admin write access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HealthPage,
});

type Check = { name: string; ok: boolean; detail: string };

function Row({ label, ok, detail }: { label: string; ok: boolean | null; detail: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.25em]">{label}</div>
        <p className="text-xs text-muted-foreground mt-1 break-all">{detail}</p>
      </div>
      <span className={`font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-1 shrink-0 ${ok === null ? "text-muted-foreground" : ok ? "text-[var(--electric)]" : "text-[var(--crimson)]"}`}>
        {ok === null ? "…" : ok ? "PASS" : "FAIL"}
      </span>
    </div>
  );
}

function HealthPage() {
  const { user, isAdmin, roles } = useAuth();
  const [server, setServer] = useState<{ ok: boolean; project: string; checks: Check[] } | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [browser, setBrowser] = useState<Check[]>([]);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");

  const provision = useServerFn(ensureDemoAdmin);
  const grant = useServerFn(bootstrapGrantRole);

  async function runChecks() {
    setServerErr(null);
    // Browser-side checks work even on static hosting.
    const results: Check[] = [];
    const ep = await supabase.from("episodes").select("*", { count: "exact", head: true });
    results.push({ name: "browser: episodes read", ok: !ep.error, detail: ep.error?.message ?? `${ep.count ?? 0} rows` });
    const pn = await supabase.from("panelists").select("*", { count: "exact", head: true });
    results.push({ name: "browser: panelists read", ok: !pn.error, detail: pn.error?.message ?? `${pn.count ?? 0} rows` });
    const sess = await supabase.auth.getSession();
    results.push({ name: "browser: auth session", ok: !sess.error, detail: sess.data.session ? `signed in as ${sess.data.session.user.email}` : "no session (sign in to test admin)" });
    setBrowser(results);

    try {
      const res = await fetch("/api/public/health", { cache: "no-store" });
      setServer(await res.json());
    } catch (e: any) {
      setServerErr("Server endpoint unreachable — this host has no SSR runtime (static hosting).");
    }
  }

  useEffect(() => { runChecks(); }, []);

  async function bootstrapDemo() {
    setBusy(true);
    try {
      const creds = await provision({ data: undefined as never });
      const { error } = await supabase.auth.signInWithPassword({ email: creds.email, password: creds.password });
      if (error) throw error;
      toast.success("Demo admin provisioned and signed in.");
      runChecks();
    } catch (e: any) {
      toast.error(e?.message ?? "Bootstrap failed.");
    } finally { setBusy(false); }
  }

  async function grantAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sign in as an admin first.");
      await grant({ data: { email, role: "admin" as const, accessToken: token } });
      toast.success(`${email} is now an admin.`);
      setEmail("");
    } catch (e: any) {
      toast.error(e?.message ?? "Grant failed.");
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">Diagnostics</span>
        <h1 className="font-display text-5xl mt-3">Connection health.</h1>
        <p className="text-sm text-muted-foreground mt-3">Verifies content reads, authentication and admin write access against the live backend.</p>

        <section className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Browser checks (work on any host)</h2>
          {browser.length === 0 && <p className="text-xs text-muted-foreground py-3">Running…</p>}
          {browser.map((c) => <Row key={c.name} label={c.name} ok={c.ok} detail={c.detail} />)}
        </section>

        <section className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Server checks (requires SSR runtime)</h2>
          {serverErr && <Row label="server endpoint" ok={false} detail={serverErr} />}
          {server?.checks.map((c) => <Row key={c.name} label={c.name} ok={c.ok} detail={c.detail} />)}
          {server && <p className="text-[10px] font-mono text-muted-foreground mt-2 break-all">project: {server.project}</p>}
        </section>

        <section className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Admin bootstrap</h2>
          <Row label="current user" ok={!!user} detail={user ? `${user.email} · roles: ${roles.join(", ") || "none"}` : "not signed in"} />
          <button onClick={bootstrapDemo} disabled={busy} type="button"
            className="mt-4 w-full bg-foreground text-background py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] hover:opacity-90 disabled:opacity-50">
            {busy ? "Working…" : "Provision demo admin & sign in"}
          </button>

          {isAdmin && (
            <form onSubmit={grantAdmin} className="mt-6 space-y-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Grant admin to an existing user</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="person@example.com"
                className="w-full bg-[var(--surface)] ring-1 ring-border px-3 py-2.5 outline-none focus:ring-[var(--crimson)]" />
              <button disabled={busy} className="w-full bg-[var(--crimson)] text-white py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] disabled:opacity-50">
                Grant admin role
              </button>
            </form>
          )}
        </section>

        <button onClick={runChecks} className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] underline underline-offset-4">Re-run checks</button>
      </div>
    </div>
  );
}
