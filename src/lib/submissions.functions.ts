import { createServerFn } from "@tanstack/react-start";
import { applicationSchema, ticketInquirySchema, sponsorInquirySchema } from "./schemas";

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((v) => applicationSchema.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { error } = await sb.from("applications").insert({
      founder_name: data.founder_name, email: data.email, phone: data.phone || null,
      startup_name: data.startup_name, sector: data.sector || null, city: data.city || null,
      stage: data.stage || null, mrr: data.mrr ?? null, ask_amount: data.ask_amount ?? null,
      valuation: data.valuation ?? null, pitch: data.pitch, deck_url: data.deck_url || null,
      monthly_revenue: data.monthly_revenue ?? null,
      burn_rate: data.burn_rate ?? null,
      product_service: data.product_service,
      product_stage: data.product_stage,
      customer_segment: data.customer_segment,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitTicketInquiry = createServerFn({ method: "POST" })
  .inputValidator((v) => ticketInquirySchema.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { error } = await sb.from("ticket_inquiries").insert({
      name: data.name, email: data.email, phone: data.phone || null,
      tier: data.tier, seats: data.seats, episode_round: data.episode_round || null, notes: data.notes || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitSponsorInquiry = createServerFn({ method: "POST" })
  .inputValidator((v) => sponsorInquirySchema.parse(v))
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const { error } = await sb.from("sponsor_inquiries").insert({
      brand: data.brand, contact_name: data.contact_name, email: data.email,
      phone: data.phone || null, tier: data.tier || null, budget_range: data.budget_range || null, message: data.message || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });