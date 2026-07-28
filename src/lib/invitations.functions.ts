import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { panelistInviteSchema } from "./invitation-schema";

// ---------- PUBLIC: submit a nomination ----------
export const submitPanelistInvitation = createServerFn({ method: "POST" })
  .inputValidator((v) => panelistInviteSchema.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const nul = (s?: string | null) => (s && s.trim() ? s.trim() : null);
    const { error } = await (sb as any).from("panelist_invitations").insert({
      nominator_name: data.nominator_name,
      nominator_email: data.nominator_email,
      nominator_role: nul(data.nominator_role),
      nominator_is_panelist: data.nominator_is_panelist,
      relationship: nul(data.relationship),
      nominee_name: data.nominee_name,
      nominee_email: data.nominee_email,
      nominee_phone: nul(data.nominee_phone),
      city: nul(data.city),
      firm: nul(data.firm),
      title: nul(data.title),
      expertise: nul(data.expertise),
      sectors: nul(data.sectors),
      ticket_size: nul(data.ticket_size),
      aum: nul(data.aum),
      years_experience: data.years_experience ?? null,
      notable_deals: nul(data.notable_deals),
      linkedin_url: nul(data.linkedin_url),
      website_url: nul(data.website_url),
      headshot_url: nul(data.headshot_url),
      bio: nul(data.bio),
      quote: nul(data.quote),
      availability: nul(data.availability),
      why_fit: data.why_fit,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- ADMIN ----------
async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.from("user_roles").select("role").eq("user_id", ctx.userId);
  const roles = (data ?? []).map((r: any) => r.role);
  if (!roles.includes("admin") && !roles.includes("moderator")) throw new Error("Forbidden: staff only");
  return roles as string[];
}

export const adminListPanelistInvitations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await (context.supabase as any)
      .from("panelist_invitations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });

export const adminUpdatePanelistInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "reviewing", "accepted", "rejected", "archived"]),
        notes: z.string().trim().max(600).optional().or(z.literal("")),
      })
      .parse(v),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await (context.supabase as any)
      .from("panelist_invitations")
      .update({ status: data.status, reviewer_notes: data.notes || null, reviewed_by: context.userId })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Accept a nomination and promote it into a real panelist record. */
export const adminPromoteInvitationToPanelist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const sb: any = context.supabase;
    const { data: inv, error: e1 } = await sb.from("panelist_invitations").select("*").eq("id", data.id).maybeSingle();
    if (e1) throw new Error(e1.message);
    if (!inv) throw new Error("Invitation not found");
    if (inv.created_panelist_id) throw new Error("Already promoted to a panelist");

    const base = slugify(inv.nominee_name) || `panelist-${Date.now()}`;
    let slug = base;
    const { data: existing } = await sb.from("panelists").select("slug").like("slug", `${base}%`);
    if ((existing ?? []).some((r: any) => r.slug === base)) slug = `${base}-${(existing ?? []).length + 1}`;

    const { data: panelist, error: e2 } = await sb
      .from("panelists")
      .insert({
        slug,
        name: inv.nominee_name,
        firm: inv.firm,
        city: inv.city,
        tag: inv.title,
        bio: inv.bio,
        quote: inv.quote,
        headshot: inv.headshot_url,
        appetite: inv.sectors,
        aum: inv.aum,
        years: inv.years_experience,
      })
      .select()
      .single();
    if (e2) throw new Error(e2.message);

    const { error: e3 } = await sb
      .from("panelist_invitations")
      .update({ status: "accepted", created_panelist_id: panelist.id, reviewed_by: context.userId })
      .eq("id", data.id);
    if (e3) throw new Error(e3.message);
    return { ok: true, panelist };
  });

export const adminDeletePanelistInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await (context.supabase as any).from("panelist_invitations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
