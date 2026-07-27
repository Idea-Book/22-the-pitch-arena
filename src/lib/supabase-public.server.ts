import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { appSupabasePublishableKey, appSupabaseUrl, supabaseFetchFor } from "./app-backend";

let _client: ReturnType<typeof createClient<Database>> | undefined;

export function getPublicSupabase() {
  if (_client) return _client;
  const key = appSupabasePublishableKey();
  _client = createClient<Database>(appSupabaseUrl(), key, {
    global: { fetch: supabaseFetchFor(key) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
