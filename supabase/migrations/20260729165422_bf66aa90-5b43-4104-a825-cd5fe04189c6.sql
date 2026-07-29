
CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  site_name text NOT NULL DEFAULT 'BKL Sharks',
  tagline text,
  contact_email text,
  support_email text,
  email_from_name text,
  email_from_address text,
  email_reply_to text,
  google_analytics_id text,
  gtm_id text,
  meta_pixel_id text,
  custom_head_scripts text,
  custom_body_scripts text,
  social_instagram text,
  social_x text,
  social_youtube text,
  social_linkedin text,
  maintenance_banner text,
  maintenance_banner_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site settings staff write" ON public.site_settings FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id, site_name, tagline, contact_email, support_email, email_from_name, email_from_address)
VALUES (true, 'BKL Sharks', 'India''s loudest pitch arena.', 'hello@bklsharks.app', 'support@bklsharks.app', 'BKL Sharks', 'no-reply@bklsharks.app');

CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email templates staff read" ON public.email_templates FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "email templates staff write" ON public.email_templates FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.email_templates (key, name, subject, body, description) VALUES
('welcome', 'Welcome', 'Welcome to BKL Sharks, {{name}}', 'Hi {{name}},

You are on the grid. Watch this space for Episode 01 from Siri Fort, New Delhi.

— Team BKL Sharks', 'Sent after a new account is created.'),
('application_received', 'Application received', 'We got your pitch, {{founder_name}}', 'Hi {{founder_name}},

Your pitch for {{startup_name}} is in the queue. Our team reviews every application within 7 working days.

— Team BKL Sharks', 'Sent when a founder submits the Apply form.'),
('ticket_inquiry', 'Ticket inquiry', 'Your seats at BKL Sharks', 'Hi {{name}},

Thanks for your interest in {{tier}} ({{seats}} seat(s)). Our box office will confirm availability shortly.

— Team BKL Sharks', 'Sent when a ticket inquiry is submitted.'),
('sponsor_inquiry', 'Sponsor inquiry', 'Partnership with BKL Sharks', 'Hi {{contact_name}},

Thanks for reaching out about partnering {{brand}} with BKL Sharks. Our partnerships lead will be in touch.

— Team BKL Sharks', 'Sent when a brand submits a sponsorship inquiry.'),
('panelist_nomination', 'Panelist nomination', 'Thanks for nominating {{nominee_name}}', 'Hi {{referrer_name}},

We received your nomination for {{nominee_name}}. Our casting team will review the dossier.

— Team BKL Sharks', 'Sent when someone nominates a panelist.');

CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  session_id text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_at_idx ON public.page_views (created_at DESC);
CREATE INDEX page_views_path_idx ON public.page_views (path);
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "page views public insert" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "page views staff read" ON public.page_views FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

UPDATE public.episodes SET hero_img = '/media/ep-0' || (1 + (abs(hashtext(slug)) % 3)) || '.jpg' WHERE hero_img IS NULL OR hero_img = '';
UPDATE public.panelists SET headshot = '/media/panel-0' || (1 + (abs(hashtext(slug)) % 5)) || '.jpg' WHERE headshot IS NULL OR headshot = '';
UPDATE public.founders SET headshot = '/media/ep-0' || (1 + (abs(hashtext(slug)) % 3)) || '.jpg' WHERE headshot IS NULL OR headshot = '';
