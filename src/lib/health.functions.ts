import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const adminHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertStaffCtx } = await import("./staff.server");
    await assertStaffCtx(context);
    const { runHealthChecks } = await import("./health.server");
    return runHealthChecks();
  });
