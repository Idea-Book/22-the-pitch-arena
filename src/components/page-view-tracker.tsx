import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackPageView } from "@/lib/analytics.functions";

const KEY = "bkl-session-id";

function sessionId() {
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Records a pageview on every client-side navigation. */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (last.current === pathname) return;
    last.current = pathname;
    void trackPageView({
      data: { path: pathname, referrer: document.referrer || null, sessionId: sessionId() },
    }).catch((e) => console.error("[analytics] track failed", e));
  }, [pathname]);

  return null;
}
