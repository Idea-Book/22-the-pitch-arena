import { useEffect, useState } from "react";
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

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) { setRoles([]); return; }
    let cancelled = false;
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
      if (!cancelled) setRoles((data ?? []).map((r: any) => r.role));
    });
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  return {
    user: session?.user ?? null,
    session,
    loading,
    roles,
    isStaff: roles.includes("admin") || roles.includes("moderator"),
    isAdmin: roles.includes("admin"),
  };
}