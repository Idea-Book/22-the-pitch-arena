import ep01 from "@/assets/ep-01.jpg";
import ep02 from "@/assets/ep-02.jpg";
import ep03 from "@/assets/ep-03.jpg";
import panel01 from "@/assets/panel-01.jpg";
import panel02 from "@/assets/panel-02.jpg";
import panel03 from "@/assets/panel-03.jpg";

const EPS = [ep01, ep02, ep03];
const PANS = [panel01, panel02, panel03];

function hashIdx(key: string, mod: number) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % mod;
}

export function episodeImage(slugOrId: string) { return EPS[hashIdx(slugOrId, EPS.length)]; }
export function panelistImage(slugOrId: string) { return PANS[hashIdx(slugOrId, PANS.length)]; }
export function founderImage(slugOrId: string) { return EPS[hashIdx(slugOrId, EPS.length)]; }