import { z } from "zod";

const optUrl = z.string().trim().url("Enter a valid URL").max(500).optional().or(z.literal(""));

export const panelistInviteSchema = z.object({
  // Nominator
  nominator_name: z.string().trim().min(2, "Your name is required").max(120),
  nominator_email: z.string().trim().email("Enter a valid email").max(255),
  nominator_role: z.string().trim().max(120).optional().or(z.literal("")),
  nominator_is_panelist: z.boolean().default(false),
  relationship: z.string().trim().max(200).optional().or(z.literal("")),

  // Nominee
  nominee_name: z.string().trim().min(2, "Nominee name is required").max(120),
  nominee_email: z.string().trim().email("Enter a valid nominee email").max(255),
  nominee_phone: z.string().trim().max(20).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  firm: z.string().trim().max(140).optional().or(z.literal("")),
  title: z.string().trim().max(140).optional().or(z.literal("")),
  expertise: z.string().trim().max(240).optional().or(z.literal("")),
  sectors: z.string().trim().max(240).optional().or(z.literal("")),
  ticket_size: z.string().trim().max(80).optional().or(z.literal("")),
  aum: z.string().trim().max(80).optional().or(z.literal("")),
  years_experience: z.coerce
    .number({ message: "Enter a number" })
    .int()
    .min(0)
    .max(70)
    .optional(),
  notable_deals: z.string().trim().max(600).optional().or(z.literal("")),
  linkedin_url: optUrl,
  website_url: optUrl,
  headshot_url: optUrl,
  bio: z.string().trim().max(1500).optional().or(z.literal("")),
  quote: z.string().trim().max(240).optional().or(z.literal("")),
  availability: z.string().trim().max(160).optional().or(z.literal("")),
  why_fit: z
    .string()
    .trim()
    .min(20, "Tell us at least a couple of sentences")
    .max(1500),
});

export type PanelistInviteInput = z.input<typeof panelistInviteSchema>;
export type PanelistInviteData = z.output<typeof panelistInviteSchema>;
