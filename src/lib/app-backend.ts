// Central config for the app's active backend project.
// The managed SUPABASE_* env vars still point at the legacy project, so server
// code must resolve the active project through these helpers instead.
export const APP_SUPABASE_URL_FALLBACK = "https://botgaugqqsmkeemceybm.supabase.co";
export const APP_SUPABASE_PUBLISHABLE_FALLBACK = "sb_publishable_qmAq9ETk32T7P0A_el6pmQ_BxmfYxaV";

export function appSupabaseUrl(): string {
  return process.env.EXTERNAL_SUPABASE_URL || APP_SUPABASE_URL_FALLBACK;
}

export function appSupabasePublishableKey(): string {
  return process.env.EXTERNAL_SUPABASE_PUBLISHABLE_KEY || APP_SUPABASE_PUBLISHABLE_FALLBACK;
}

export function appSupabaseServiceKey(): string | undefined {
  return process.env.EXTERNAL_SUPABASE_SERVICE_ROLE_KEY || undefined;
}

export function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

export function supabaseFetchFor(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    if (isNewSupabaseApiKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}
