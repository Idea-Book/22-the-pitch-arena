import { z } from "zod";

export const slugSchema = z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/i, "Lowercase letters, numbers and dashes only");

export const postSchema = z.object({
  body: z.string().trim().min(2, "Say something").max(1000, "Max 1000 characters"),
  episode_id: z.string().uuid().optional().nullable(),
  media_url: z.string().url().optional().nullable(),
});
export type PostInput = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  post_id: z.string().uuid(),
  body: z.string().trim().min(1).max(500),
});

export const reactionSchema = z.object({
  post_id: z.string().uuid(),
  kind: z.enum(["fire", "roast", "clap"]),
});

export const reportSchema = z.object({
  target_type: z.enum(["post", "comment"]),
  target_id: z.string().uuid(),
  reason: z.string().trim().min(4).max(400),
});

export const applicationSchema = z.object({
  founder_name: z.string().trim().min(2, "Founder name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20).optional().or(z.literal("")),
  startup_name: z.string().trim().min(2, "Startup name is required").max(120),
  sector: z.string().trim().max(60).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  stage: z.string().trim().max(40).optional().or(z.literal("")),
  mrr: z.coerce.number().min(0).optional().nullable(),
  monthly_revenue: z.coerce.number().min(0, "Revenue cannot be negative").optional().nullable(),
  burn_rate: z.coerce.number().min(0, "Burn cannot be negative").optional().nullable(),
  ask_amount: z.coerce.number().min(0).optional().nullable(),
  valuation: z.coerce.number().min(0).optional().nullable(),
  product_service: z.string().trim().min(10, "Describe your product/service in at least 10 characters").max(600),
  product_stage: z.enum(["ideation", "mvp", "traction"], { message: "Pick a product stage" }),
  customer_segment: z.enum(["b2b", "b2c", "b2b2c"], { message: "Pick a customer segment" }),
  pitch: z.string().trim().min(40, "Tell us at least a paragraph").max(2000),
  deck_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const ticketInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  tier: z.enum(["Grandstand", "Paddock", "Paddock Club VIP"]),
  seats: z.coerce.number().int().min(1).max(20),
  episode_round: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const sponsorInquirySchema = z.object({
  brand: z.string().trim().min(2).max(120),
  contact_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  tier: z.string().trim().max(40).optional().or(z.literal("")),
  budget_range: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const episodeUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  round_code: z.string().trim().min(1).max(8),
  title: z.string().trim().min(2).max(160),
  city: z.string().trim().min(2).max(60),
  sector: z.string().trim().max(60).optional().or(z.literal("")),
  air_date: z.string().optional().or(z.literal("")),
  lap_time: z.string().trim().max(12).optional().or(z.literal("")),
  outcome: z.enum(["TERMINATED","TERM SHEET","VIRAL","STANDING OVATION","WALK-OFF"]).optional().nullable(),
  recap: z.string().trim().max(4000).optional().or(z.literal("")),
  hero_img: z.string().trim().max(500).optional().or(z.literal("")),
  video_url: z.string().url().optional().or(z.literal("")),
  funded_label: z.string().trim().max(40).optional().or(z.literal("")),
  status: z.enum(["draft","scheduled","aired"]).default("aired"),
});

export const panelistUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  name: z.string().trim().min(2).max(120),
  tag: z.string().trim().max(40).optional().or(z.literal("")),
  aka: z.string().trim().max(40).optional().or(z.literal("")),
  firm: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  quote: z.string().trim().max(400).optional().or(z.literal("")),
  headshot: z.string().trim().max(500).optional().or(z.literal("")),
  roast_meter: z.coerce.number().int().min(0).max(100).default(0),
  appetite: z.string().trim().max(120).optional().or(z.literal("")),
  record_wins: z.coerce.number().int().min(0).default(0),
  record_kos: z.coerce.number().int().min(0).default(0),
  aum: z.string().trim().max(40).optional().or(z.literal("")),
  years: z.coerce.number().int().min(0).max(80).optional().nullable(),
  deals: z.coerce.number().int().min(0).optional().nullable(),
});

export const founderUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  name: z.string().trim().min(2).max(120),
  startup: z.string().trim().min(1).max(120),
  sector: z.string().trim().max(60).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  stage: z.string().trim().max(40).optional().or(z.literal("")),
  ask: z.string().trim().max(40).optional().or(z.literal("")),
  valuation: z.string().trim().max(40).optional().or(z.literal("")),
  traction: z.string().trim().max(400).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  headshot: z.string().trim().max(500).optional().or(z.literal("")),
  position: z.coerce.number().int().min(1).max(999).optional().nullable(),
  position_delta: z.string().trim().max(8).default("—"),
  heat: z.coerce.number().int().min(0).max(100).default(50),
  funded_label: z.string().trim().max(40).optional().or(z.literal("")),
  status: z.enum(["active","eliminated","champion","withdrew"]).default("active"),
});

export const sponsorPackageSchema = z.object({
  id: z.string().uuid().optional(),
  tier: z.string().trim().min(1).max(10),
  name: z.string().trim().min(2).max(120),
  scope: z.string().trim().min(2).max(600),
  price: z.string().trim().min(1).max(40),
  units: z.string().trim().max(80).optional().or(z.literal("")),
  color: z.string().trim().max(80).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(9999).default(100),
  active: z.boolean().default(true),
});

export const sponsorPartnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(80),
  logo_url: z.string().url().max(500).optional().or(z.literal("")),
  website: z.string().url().max(500).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(9999).default(100),
  active: z.boolean().default(true),
});