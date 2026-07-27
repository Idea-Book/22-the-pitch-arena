import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DEMO_EMAIL = "demo-admin@bklsharks.app";
const DEMO_PASSWORD = "DemoAdmin#2026";

/**
 * Ensures a demo admin user exists with the admin role on the ACTIVE project.
 * Public endpoint by design (no auth required) — purely a sandbox helper.
 */
export const ensureDemoAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { getAppAdmin } = await import("./app-admin.server");
  const admin = getAppAdmin();

  let userId: string | undefined;
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list?.users?.find((u) => u.email?.toLowerCase() === DEMO_EMAIL);
  if (existing) {
    userId = existing.id;
    await admin.auth.admin.updateUserById(existing.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
  } else {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Demo Admin" },
    });
    if (error) throw new Error(error.message);
    userId = created.user?.id;
  }
  if (!userId) throw new Error("Failed to provision demo admin user.");

  await (admin as any)
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  return { email: DEMO_EMAIL, password: DEMO_PASSWORD, userId };
});

/**
 * Grants a role to any existing user by email. Admin-only sandbox bootstrap helper
 * guarded by the demo-admin flow: requires the caller to already be an admin.
 */
export const bootstrapGrantRole = createServerFn({ method: "POST" })
  .inputValidator((v) =>
    z
      .object({
        email: z.string().email(),
        role: z.enum(["admin", "moderator", "user"]),
        accessToken: z.string().min(10),
      })
      .parse(v),
  )
  .handler(async ({ data }) => {
    const { getAppAdmin } = await import("./app-admin.server");
    const admin = getAppAdmin();

    // Verify the caller is an admin on this project.
    const { data: caller, error: callerErr } = await admin.auth.getUser(data.accessToken);
    if (callerErr || !caller.user) throw new Error("Not signed in.");
    const { data: callerRoles } = await (admin as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.user.id);
    if (!(callerRoles ?? []).some((r: any) => r.role === "admin")) {
      throw new Error("Forbidden: admin only.");
    }

    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const target = list?.users?.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (!target) throw new Error(`No user found for ${data.email}. Ask them to sign up first.`);

    const { error } = await (admin as any)
      .from("user_roles")
      .upsert({ user_id: target.id, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true, userId: target.id, email: data.email, role: data.role };
  });
