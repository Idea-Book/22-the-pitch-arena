// Service-role client for the ACTIVE backend project. Server-only.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { appSupabaseServiceKey, appSupabaseUrl, supabaseFetchFor } from "./app-backend";

let _client: ReturnType<typeof createClient<Database>> | undefined;

export function hasServiceKey() {
  return !!appSupabaseServiceKey();
}

export function getAppAdmin() {
  if (_client) return _client;
  const key = appSupabaseServiceKey();
  if (!key) {
    throw new Error(
      "Admin write access is not configured: EXTERNAL_SUPABASE_SERVICE_ROLE_KEY is missing.",
    );
  }
  _client = createClient<Database>(appSupabaseUrl(), key, {
    global: { fetch: supabaseFetchFor(key) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
