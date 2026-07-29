import { z } from "zod";

const opt = (max = 300) => z.string().trim().max(max).optional().or(z.literal(""));

export const siteSettingsSchema = z.object({
  site_name: z.string().trim().min(2, "Site name is required").max(80),
  tagline: opt(160),
  contact_email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  support_email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  email_from_name: opt(80),
  email_from_address: z.string().trim().email("Enter a valid sender address").max(255).optional().or(z.literal("")),
  email_reply_to: z.string().trim().email("Enter a valid reply-to address").max(255).optional().or(z.literal("")),
  google_analytics_id: z.string().trim().max(40).regex(/^(G-[A-Z0-9]+|UA-\d+-\d+)?$/i, "Use a GA4 ID like G-XXXXXXX").optional().or(z.literal("")),
  gtm_id: z.string().trim().max(40).regex(/^(GTM-[A-Z0-9]+)?$/i, "Use a GTM ID like GTM-XXXXXX").optional().or(z.literal("")),
  meta_pixel_id: z.string().trim().max(40).regex(/^\d*$/, "Pixel ID is numeric").optional().or(z.literal("")),
  custom_head_scripts: z.string().max(8000, "Max 8000 characters").optional().or(z.literal("")),
  custom_body_scripts: z.string().max(8000, "Max 8000 characters").optional().or(z.literal("")),
  social_instagram: z.string().trim().url("Enter a full URL").max(300).optional().or(z.literal("")),
  social_x: z.string().trim().url("Enter a full URL").max(300).optional().or(z.literal("")),
  social_youtube: z.string().trim().url("Enter a full URL").max(300).optional().or(z.literal("")),
  social_linkedin: z.string().trim().url("Enter a full URL").max(300).optional().or(z.literal("")),
  maintenance_banner: opt(240),
  maintenance_banner_enabled: z.boolean().default(false),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const emailTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().trim().min(2, "Key is required").max(60).regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores"),
  name: z.string().trim().min(2, "Name is required").max(80),
  subject: z.string().trim().min(2, "Subject is required").max(200),
  body: z.string().trim().min(10, "Body must be at least 10 characters").max(8000),
  description: opt(240),
  enabled: z.boolean().default(true),
});
export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
