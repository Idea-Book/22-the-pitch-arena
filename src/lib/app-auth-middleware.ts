// Auth middleware bound to the ACTIVE backend project (see app-backend.ts).
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { appSupabasePublishableKey, appSupabaseUrl, supabaseFetchFor } from "./app-backend";

export const requireAppAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const request = getRequest();
  const authHeader = request?.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new Response("Unauthorized", { status: 401 });

  const url = appSupabaseUrl();
  const key = appSupabasePublishableKey();
  const supabase = createClient<Database>(url, key, {
    global: {
      fetch: supabaseFetchFor(key),
      headers: { Authorization: `Bearer ${token}` },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Response("Unauthorized", { status: 401 });

  return next({ context: { supabase, userId: data.user.id, claims: data.user } });
});
