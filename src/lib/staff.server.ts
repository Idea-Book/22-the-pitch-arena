export async function assertStaffCtx(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.from("user_roles").select("role").eq("user_id", ctx.userId);
  const roles = (data ?? []).map((r: any) => r.role) as string[];
  if (!roles.includes("admin") && !roles.includes("moderator")) throw new Error("Forbidden: staff only");
  return roles;
}

export async function assertAdminCtx(ctx: { supabase: any; userId: string }) {
  const roles = await assertStaffCtx(ctx);
  if (!roles.includes("admin")) throw new Error("Forbidden: admin only");
  return roles;
}
