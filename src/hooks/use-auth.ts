import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: string[];
  isStaff: boolean;
  isAdmin: boolean;
};

const PROJECT_ID = (import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined) ?? "";
const STORAGE_KEY = PROJECT_ID ? `sb-${PROJECT_ID}-auth-token` : "";

// Synchronously read cached session from localStorage so the first paint
// already knows whether the user is signed in — no flash of signed-out UI.
function readCachedSession(): Session | null {
  if (typeof window === "undefined" || !STORAGE_KEY) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const session: Session | null = parsed?.currentSession ?? parsed ?? null;
    if (!session?.access_token) return null;
    // expires_at is unix seconds
    if (session.expires_at && session.expires_at * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function useAuth(): AuthState {
  const cached = typeof window !== "undefined" ? readCachedSession() : null;
  const [session, setSession] = useState<Session | null>(cached);
  // If we already restored a cached session, we're not "loading".
  const [loading, setLoading] = useState(!cached);
  const qc = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false);
      if (event === "SIGNED_OUT") qc.removeQueries({ queryKey: ["roles"] });
    });
    // Reconcile with server in the background — UI is already rendered from cache.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  const userId = session?.user?.id;
  const { data: roles = [] } = useQuery({
    queryKey: ["roles", userId],
    enabled: !!userId,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId!);
      return (data ?? []).map((r: any) => r.role as string);
    },
  });

  return {
    user: session?.user ?? null,
    session,
    loading,
    roles,
    isStaff: roles.includes("admin") || roles.includes("moderator"),
    isAdmin: roles.includes("admin"),
  };
}
