CREATE TABLE public.panelist_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominator_name text NOT NULL,
  nominator_email text NOT NULL,
  nominator_role text,
  nominator_is_panelist boolean NOT NULL DEFAULT false,
  relationship text,
  nominee_name text NOT NULL,
  nominee_email text NOT NULL,
  nominee_phone text,
  city text,
  firm text,
  title text,
  expertise text,
  sectors text,
  ticket_size text,
  aum text,
  years_experience integer,
  notable_deals text,
  linkedin_url text,
  website_url text,
  headshot_url text,
  bio text,
  quote text,
  availability text,
  why_fit text NOT NULL,
  status submission_status NOT NULL DEFAULT 'new',
  reviewer_notes text,
  reviewed_by uuid,
  created_panelist_id uuid REFERENCES public.panelists(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.panelist_invitations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panelist_invitations TO authenticated;
GRANT ALL ON public.panelist_invitations TO service_role;

ALTER TABLE public.panelist_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "panelist_invites anon insert" ON public.panelist_invitations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "panelist_invites auth insert" ON public.panelist_invitations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "panelist_invites staff read" ON public.panelist_invitations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "panelist_invites staff update" ON public.panelist_invitations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "panelist_invites admin delete" ON public.panelist_invitations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER panelist_invitations_updated_at BEFORE UPDATE ON public.panelist_invitations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();