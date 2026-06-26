import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
  },
  component: AuthedShell,
});

function AuthedShell() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.navigate({ to: "/auth" });
      else setReady(true);
    });
  }, [router]);
  if (!ready) return <div className="min-h-[60vh] grid place-items-center font-mono text-xs text-muted-foreground">Loading…</div>;
  return <Outlet />;
}