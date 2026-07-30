import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";
import panel01 from "@/assets/panel-01.jpg";
import panel02 from "@/assets/panel-02.jpg";
import panel03 from "@/assets/panel-03.jpg";
import panel04 from "@/assets/panel-04.jpg";
import panel05 from "@/assets/panel-05.jpg";

const EPS = [ep01, ep02, ep03];
const PANS = [panel01, panel02, panel03, panel04, panel05];

function hashIdx(key: string, mod: number) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % mod;
}

function clean(url?: string | null) {
  const v = (url ?? "").trim();
  return v.length > 0 ? v : null;
}

/** DB value wins; local asset is only a fallback. */
export function episodeImage(slugOrId: string, dbUrl?: string | null) {
  return clean(dbUrl) ?? EPS[hashIdx(slugOrId, EPS.length)];
}
export function panelistImage(slugOrId: string, dbUrl?: string | null) {
  return clean(dbUrl) ?? PANS[hashIdx(slugOrId, PANS.length)];
}
export function founderImage(slugOrId: string, dbUrl?: string | null) {
  return clean(dbUrl) ?? EPS[hashIdx(slugOrId, EPS.length)];
}
