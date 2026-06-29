ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS monthly_revenue numeric,
  ADD COLUMN IF NOT EXISTS burn_rate numeric,
  ADD COLUMN IF NOT EXISTS product_service text,
  ADD COLUMN IF NOT EXISTS product_stage text,
  ADD COLUMN IF NOT EXISTS customer_segment text;