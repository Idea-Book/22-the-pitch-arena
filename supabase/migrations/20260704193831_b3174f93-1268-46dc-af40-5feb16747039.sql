CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TYPE public.talent_role AS ENUM ('creator','panelist','investor');

CREATE TABLE public.talent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.talent_role NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  headline TEXT,
  bio TEXT,
  links TEXT,
  portfolio_url TEXT,
  showreel_url TEXT,
  expertise TEXT,
  firm TEXT,
  ticket_size TEXT,
  sectors TEXT,
  availability TEXT,
  why_join TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.talent_applications TO authenticated;
GRANT INSERT ON public.talent_applications TO anon;
GRANT ALL ON public.talent_applications TO service_role;

ALTER TABLE public.talent_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit talent application"
  ON public.talent_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view talent applications"
  ON public.talent_applications FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Staff can update talent applications"
  ON public.talent_applications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can delete talent applications"
  ON public.talent_applications FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_talent_applications_updated_at
  BEFORE UPDATE ON public.talent_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_talent_applications_role_created ON public.talent_applications (role, created_at DESC);