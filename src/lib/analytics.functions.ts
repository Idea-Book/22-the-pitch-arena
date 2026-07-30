import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(500).optional().nullable(),
  sessionId: z.string().max(64).optional().nullable(),
});

/** Fire-and-forget first-party pageview tracking (feeds admin analytics). */
export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((v) => inputSchema.parse(v))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await (supabaseAdmin as any).from("page_views").insert({
        path: data.path.slice(0, 300),
        referrer: data.referrer || null,
        session_id: data.sessionId || null,
      });
      if (error) console.error("[analytics] pageview insert failed", error);
    } catch (err) {
      console.error("[analytics] pageview tracking error", err);
    }
    return { ok: true };
  });
