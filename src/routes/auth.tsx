import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { ensureDemoAdmin } from "@/lib/demo-auth.functions";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — BKL Sharks" },
      { name: "description", content: "Sign in to BKL Sharks to post in the community, react to clips, and apply to pitch." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirect ?? "/" });
    });
  }, [navigate, redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to the arena.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      navigate({ to: redirect ?? "/" });
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed.");
    } finally { setBusy(false); }
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed."); setBusy(false); return; }
    if (result.redirected) return;
    navigate({ to: redirect ?? "/" });
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--crimson)]">Paddock Pass</span>
          <h1 className="font-display text-5xl mt-3">{mode === "signin" ? "Enter the arena." : "Take the pit lane."}</h1>
          <p className="text-sm text-muted-foreground mt-3">React to clips, post in the community, apply to pitch.</p>
        </div>

        <button onClick={google} disabled={busy} className="w-full inline-flex items-center justify-center gap-3 bg-[var(--surface)] hover:bg-[var(--surface-2)] ring-1 ring-border py-3 mb-5 transition-colors font-mono text-[11px] uppercase tracking-[0.25em] disabled:opacity-50">
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden><path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.6 4.1-5.35 4.1-3.22 0-5.84-2.67-5.84-5.95s2.62-5.95 5.84-5.95c1.83 0 3.06.78 3.76 1.45l2.57-2.48C16.7 3.86 14.6 3 12 3 6.97 3 2.9 7.07 2.9 12.1S6.97 21.2 12 21.2c6.92 0 9.5-4.85 9.5-7.34 0-.5-.05-.87-.15-1.26z" /></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-border flex-1" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">or email</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Display name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={120}
                className="mt-2 w-full bg-[var(--surface)] ring-1 ring-border px-3 py-2.5 outline-none focus:ring-[var(--crimson)]" />
            </div>
          )}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-[var(--surface)] ring-1 ring-border px-3 py-2.5 outline-none focus:ring-[var(--crimson)]" />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-[var(--surface)] ring-1 ring-border px-3 py-2.5 outline-none focus:ring-[var(--crimson)]" />
            {mode === "signup" && <p className="text-[10px] text-muted-foreground mt-1 font-mono">8+ characters · checked against leak databases.</p>}
          </div>
          <button disabled={busy} className="w-full bg-[var(--crimson)] text-white py-3 font-mono text-[11px] uppercase tracking-[0.3em] hover:bg-[var(--crimson)]/90 transition-colors disabled:opacity-50">
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {mode === "signin" ? "No account? " : "Already racing? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-foreground underline underline-offset-2">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}