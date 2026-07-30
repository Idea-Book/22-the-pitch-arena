import { createFileRoute } from "@tanstack/react-router";
import { MEDIA_BUCKET } from "@/lib/media";

/**
 * Public read proxy for the private `media` bucket so CMS uploads render on
 * every page without signed-URL churn.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const objectPath = (params as { _splat?: string })._splat ?? "";
        if (!objectPath || objectPath.includes("..")) {
          return new Response("Bad request", { status: 400 });
        }
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).download(objectPath);
          if (error || !data) {
            console.error(`[media-proxy] miss for "${objectPath}"`, error);
            return new Response("Not found", { status: 404 });
          }
          return new Response(await data.arrayBuffer(), {
            headers: {
              "content-type": data.type || "application/octet-stream",
              "cache-control": "public, max-age=31536000, immutable",
            },
          });
        } catch (err) {
          console.error(`[media-proxy] error for "${objectPath}"`, err);
          return new Response("Media unavailable", { status: 500 });
        }
      },
    },
  },
});
