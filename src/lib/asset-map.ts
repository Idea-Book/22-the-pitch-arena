import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";
import panel01 from "@/assets/panel-01.jpg";
import panel02 from "@/assets/panel-02.jpg";
import panel03 from "@/assets/panel-03.jpg";
import panel04 from "@/assets/panel-04.jpg";
import panel05 from "@/assets/panel-05.jpg";
import { resolveMediaUrl } from "./media";

const EPS = [ep01, ep02, ep03];
const PANS = [panel01, panel02, panel03, panel04, panel05];

function hashIdx(key: string, mod: number) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % mod;
}

/** Deterministic bundled fallbacks — used when the DB value is empty or broken. */
export function episodeFallback(key: string) {
  return EPS[hashIdx(key, EPS.length)];
}
export function panelistFallback(key: string) {
  return PANS[hashIdx(key, PANS.length)];
}
export function founderFallback(key: string) {
  return EPS[hashIdx(key, EPS.length)];
}

/** DB value (URL, storage path or legacy /media path) wins; asset is fallback. */
export function episodeImage(slugOrId: string, dbUrl?: string | null) {
  return resolveMediaUrl(dbUrl) ?? episodeFallback(slugOrId);
}
export function panelistImage(slugOrId: string, dbUrl?: string | null) {
  return resolveMediaUrl(dbUrl) ?? panelistFallback(slugOrId);
}
export function founderImage(slugOrId: string, dbUrl?: string | null) {
  return resolveMediaUrl(dbUrl) ?? founderFallback(slugOrId);
}
