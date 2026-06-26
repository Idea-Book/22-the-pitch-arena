
CREATE TABLE public.sponsor_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL,
  name text NOT NULL,
  scope text NOT NULL,
  price text NOT NULL,
  units text,
  color text,
  sort_order int NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sponsor_packages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sponsor_packages TO authenticated;
GRANT ALL ON public.sponsor_packages TO service_role;
ALTER TABLE public.sponsor_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sponsor_packages public read active"
  ON public.sponsor_packages FOR SELECT USING (active = true);
CREATE POLICY "sponsor_packages staff manage"
  ON public.sponsor_packages FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER sponsor_packages_updated_at
  BEFORE UPDATE ON public.sponsor_packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.sponsor_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website text,
  sort_order int NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sponsor_partners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sponsor_partners TO authenticated;
GRANT ALL ON public.sponsor_partners TO service_role;
ALTER TABLE public.sponsor_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sponsor_partners public read active"
  ON public.sponsor_partners FOR SELECT USING (active = true);
CREATE POLICY "sponsor_partners staff manage"
  ON public.sponsor_partners FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER sponsor_partners_updated_at
  BEFORE UPDATE ON public.sponsor_partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.sponsor_packages (tier, name, scope, price, units, color, sort_order) VALUES
('T1','Title Sponsor','Season-long brand presence. Stage naming rights. Post-show editorial.','₹18 Cr+','1 slot','text-[var(--crimson)]',10),
('T2','Circuit Sponsor','On-floor branding, audience badges, lobby activation, panel mention.','₹5.5 Cr','4 slots','text-[var(--gold)]',20),
('T3','Round Sponsor','Pre-roll, mid-show segment, founder-room branding for one round.','₹1.6 Cr','16 slots · 11 sold','text-foreground',30),
('T4','Founder Grant','Fund a non-dilutive ₹50 L stipend granted live on stage in your brand name.','₹1.1 Cr','8 slots','text-[var(--gold)]',40),
('T5','Community Partner','Creator network co-branding · meme-wall placement across the season.','₹40 L','Open','text-muted-foreground',50);

INSERT INTO public.sponsor_partners (name, sort_order) VALUES
('JioCinema',10),('Peak XV',20),('Razorpay',30),('Zomato',40),('Mahindra',50),('ICICI',60),
('Tata Cliq',70),('BoAt',80),('Boult',90),('GoMechanic',100),('CRED',110),('Swiggy',120);
