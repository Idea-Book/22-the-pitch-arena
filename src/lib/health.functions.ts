import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertStaffCtx } from "./staff.server";
import { runHealthChecks } from "./health.server";

export const adminHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaffCtx(context);
    return runHealthChecks();
  });
