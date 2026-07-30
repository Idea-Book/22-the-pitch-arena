/**
 * Central image pipeline.
 *
 * Every image reference in the CMS goes through `resolveMediaUrl`, whatever
 * shape it was stored in:
 *   - absolute https URL              → used as-is
 *   - storage path ("media/foo.jpg")  → proxied through /api/public/media/*
 *   - "media://foo.jpg"               → same
 *   - legacy "/media/ep-01.jpg"       → kept (static file in /public/media)
 *   - empty / whitespace              → null so callers can fall back
 */
export const MEDIA_BUCKET = "media";
export const MEDIA_PROXY_PREFIX = "/api/public/media/";

export function mediaProxyUrl(objectPath: string) {
  return MEDIA_PROXY_PREFIX + objectPath.replace(/^\/+/, "");
}

export function resolveMediaUrl(value?: string | null): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;

  if (raw.startsWith("media://")) return mediaProxyUrl(raw.slice("media://".length));
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("data:")) return raw;
  if (raw.startsWith(MEDIA_PROXY_PREFIX)) return raw;
  // Static assets already served from /public
  if (raw.startsWith("/")) return raw;
  // Bare storage object path, e.g. "episodes/1712-hero.jpg" or "media/x.jpg"
  const withoutBucket = raw.startsWith(`${MEDIA_BUCKET}/`) ? raw.slice(MEDIA_BUCKET.length + 1) : raw;
  return mediaProxyUrl(withoutBucket);
}
