import { createServerFn } from "@tanstack/react-start";

const DEMO_EMAIL = "demo-admin@bklsharks.app";
const DEMO_PASSWORD = "DemoAdmin#2026";

/**
 * Ensures a demo admin user exists with the admin role.
 * Returns the credentials so the client can sign in with them.
 * Public endpoint by design (no auth required) — purely a sandbox helper.
 */
export const ensureDemoAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // 1. Find or create the auth user
  let userId: string | undefined;
  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list?.users?.find((u) => u.email?.toLowerCase() === DEMO_EMAIL);
  if (existing) {
    userId = existing.id;
    // Make sure password matches and email is confirmed
    await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
  } else {
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Demo Admin" },
    });
    if (error) throw new Error(error.message);
    userId = created.user?.id;
  }
  if (!userId) throw new Error("Failed to provision demo admin user.");

  // 2. Ensure admin role
  await (supabaseAdmin as any)
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  return { email: DEMO_EMAIL, password: DEMO_PASSWORD };
});
