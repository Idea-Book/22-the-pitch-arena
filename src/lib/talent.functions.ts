import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const talentSchema = z.object({
  role: z.enum(["creator", "panelist", "investor"]),
  full_name: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  headline: z.string().trim().max(160).optional().or(z.literal("")),
  bio: z.string().trim().max(1200).optional().or(z.literal("")),
  links: z.string().trim().max(600).optional().or(z.literal("")),
  portfolio_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  showreel_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  expertise: z.string().trim().max(200).optional().or(z.literal("")),
  firm: z.string().trim().max(120).optional().or(z.literal("")),
  ticket_size: z.string().trim().max(60).optional().or(z.literal("")),
  sectors: z.string().trim().max(200).optional().or(z.literal("")),
  availability: z.string().trim().max(120).optional().or(z.literal("")),
  why_join: z.string().trim().min(20, "Tell us at least a couple of sentences").max(1500),
});

export type TalentInput = z.infer<typeof talentSchema>;

export const submitTalentApplication = createServerFn({ method: "POST" })
  .inputValidator((v) => talentSchema.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { error } = await sb.from("talent_applications").insert({
      role: data.role,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      city: data.city || null,
      headline: data.headline || null,
      bio: data.bio || null,
      links: data.links || null,
      portfolio_url: data.portfolio_url || null,
      showreel_url: data.showreel_url || null,
      expertise: data.expertise || null,
      firm: data.firm || null,
      ticket_size: data.ticket_size || null,
      sectors: data.sectors || null,
      availability: data.availability || null,
      why_join: data.why_join,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
