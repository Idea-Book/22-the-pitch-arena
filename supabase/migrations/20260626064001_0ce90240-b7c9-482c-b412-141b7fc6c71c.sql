
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.episode_status AS ENUM ('draft', 'scheduled', 'aired');
CREATE TYPE public.episode_outcome AS ENUM ('TERMINATED','TERM SHEET','VIRAL','STANDING OVATION','WALK-OFF');
CREATE TYPE public.founder_status AS ENUM ('active','eliminated','champion','withdrew');
CREATE TYPE public.post_status AS ENUM ('live','removed','pending');
CREATE TYPE public.reaction_kind AS ENUM ('fire','roast','clap');
CREATE TYPE public.report_target AS ENUM ('post','comment');
CREATE TYPE public.report_status AS ENUM ('open','resolved','dismissed');
CREATE TYPE public.submission_status AS ENUM ('new','reviewing','accepted','rejected','archived');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  handle TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','moderator'))
$$;

-- Admin-only policy for user_roles management
CREATE POLICY "user_roles admin manage" ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Auto-create profile + default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, handle, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    'u_' || substr(NEW.id::text,1,8),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ EPISODES ============
CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  round_code TEXT NOT NULL,
  title TEXT NOT NULL,
  city TEXT NOT NULL,
  sector TEXT,
  air_date DATE,
  lap_time TEXT,
  outcome public.episode_outcome,
  recap TEXT,
  hero_img TEXT,
  video_url TEXT,
  funded_label TEXT,
  status public.episode_status NOT NULL DEFAULT 'aired',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.episodes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.episodes TO authenticated;
GRANT ALL ON public.episodes TO service_role;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "episodes public read" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "episodes staff write" ON public.episodes FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_episodes_updated BEFORE UPDATE ON public.episodes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PANELISTS ============
CREATE TABLE public.panelists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tag TEXT,
  aka TEXT,
  firm TEXT,
  city TEXT,
  bio TEXT,
  quote TEXT,
  headshot TEXT,
  roast_meter INT DEFAULT 0,
  appetite TEXT,
  record_wins INT DEFAULT 0,
  record_kos INT DEFAULT 0,
  aum TEXT,
  years INT,
  deals INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.panelists TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.panelists TO authenticated;
GRANT ALL ON public.panelists TO service_role;
ALTER TABLE public.panelists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "panelists public read" ON public.panelists FOR SELECT USING (true);
CREATE POLICY "panelists staff write" ON public.panelists FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_panelists_updated BEFORE UPDATE ON public.panelists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ FOUNDERS ============
CREATE TABLE public.founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  startup TEXT NOT NULL,
  sector TEXT,
  city TEXT,
  stage TEXT,
  ask TEXT,
  valuation TEXT,
  traction TEXT,
  bio TEXT,
  headshot TEXT,
  position INT,
  position_delta TEXT DEFAULT '—',
  heat INT DEFAULT 50,
  funded_label TEXT,
  status public.founder_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.founders TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.founders TO authenticated;
GRANT ALL ON public.founders TO service_role;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founders public read" ON public.founders FOR SELECT USING (true);
CREATE POLICY "founders staff write" ON public.founders FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_founders_updated BEFORE UPDATE ON public.founders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ EPISODE ↔ PANELISTS ============
CREATE TABLE public.episode_panelists (
  episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  panelist_id UUID NOT NULL REFERENCES public.panelists(id) ON DELETE CASCADE,
  verdict TEXT,
  investment_amount NUMERIC,
  equity_pct NUMERIC,
  notes TEXT,
  PRIMARY KEY (episode_id, panelist_id)
);
GRANT SELECT ON public.episode_panelists TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.episode_panelists TO authenticated;
GRANT ALL ON public.episode_panelists TO service_role;
ALTER TABLE public.episode_panelists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ep_pan public read" ON public.episode_panelists FOR SELECT USING (true);
CREATE POLICY "ep_pan staff write" ON public.episode_panelists FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ EPISODE ↔ FOUNDERS ============
CREATE TABLE public.episode_founders (
  episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES public.founders(id) ON DELETE CASCADE,
  verdict public.episode_outcome,
  feedback TEXT,
  PRIMARY KEY (episode_id, founder_id)
);
GRANT SELECT ON public.episode_founders TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.episode_founders TO authenticated;
GRANT ALL ON public.episode_founders TO service_role;
ALTER TABLE public.episode_founders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ep_fnd public read" ON public.episode_founders FOR SELECT USING (true);
CREATE POLICY "ep_fnd staff write" ON public.episode_founders FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ COMMUNITY POSTS ============
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.episodes(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  media_url TEXT,
  status public.post_status NOT NULL DEFAULT 'live',
  reaction_count INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts public read live" ON public.community_posts FOR SELECT USING (status = 'live' OR author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "posts author insert" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "posts author update" ON public.community_posts FOR UPDATE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "posts staff delete" ON public.community_posts FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX idx_posts_episode ON public.community_posts(episode_id);

-- ============ COMMENTS ============
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  status public.post_status NOT NULL DEFAULT 'live',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.post_comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments public read live" ON public.post_comments FOR SELECT USING (status = 'live' OR author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "comments author insert" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "comments author or staff update" ON public.post_comments FOR UPDATE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "comments author or staff delete" ON public.post_comments FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE INDEX idx_comments_post ON public.post_comments(post_id, created_at);

-- ============ REACTIONS ============
CREATE TABLE public.post_reactions (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind public.reaction_kind NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id, kind)
);
GRANT SELECT ON public.post_reactions TO anon, authenticated;
GRANT INSERT, DELETE ON public.post_reactions TO authenticated;
GRANT ALL ON public.post_reactions TO service_role;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reactions public read" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "reactions self insert" ON public.post_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "reactions self delete" ON public.post_reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.bump_reaction_count() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN UPDATE public.community_posts SET reaction_count = reaction_count + 1 WHERE id = NEW.post_id; RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN UPDATE public.community_posts SET reaction_count = GREATEST(0, reaction_count - 1) WHERE id = OLD.post_id; RETURN OLD;
  END IF; RETURN NULL;
END; $$;
CREATE TRIGGER trg_reaction_count AFTER INSERT OR DELETE ON public.post_reactions FOR EACH ROW EXECUTE FUNCTION public.bump_reaction_count();

CREATE OR REPLACE FUNCTION public.bump_comment_count() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN UPDATE public.community_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id; RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN UPDATE public.community_posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.post_id; RETURN OLD;
  END IF; RETURN NULL;
END; $$;
CREATE TRIGGER trg_comment_count AFTER INSERT OR DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.bump_comment_count();

-- ============ REPORTS ============
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type public.report_target NOT NULL,
  target_id UUID NOT NULL,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status public.report_status NOT NULL DEFAULT 'open',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports self read" ON public.reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "reports self insert" ON public.reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "reports staff update" ON public.reports FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ USER BANS ============
CREATE TABLE public.user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_bans TO authenticated;
GRANT ALL ON public.user_bans TO service_role;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bans self read" ON public.user_bans FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "bans staff manage" ON public.user_bans FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ APPLICATIONS ============
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  startup_name TEXT NOT NULL,
  sector TEXT,
  city TEXT,
  stage TEXT,
  mrr NUMERIC,
  ask_amount NUMERIC,
  valuation NUMERIC,
  pitch TEXT NOT NULL,
  deck_url TEXT,
  status public.submission_status NOT NULL DEFAULT 'new',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications anon insert" ON public.applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "applications auth insert" ON public.applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "applications staff read" ON public.applications FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "applications staff update" ON public.applications FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "applications staff delete" ON public.applications FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- ============ TICKET INQUIRIES ============
CREATE TABLE public.ticket_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tier TEXT NOT NULL,
  seats INT NOT NULL DEFAULT 1,
  episode_round TEXT,
  notes TEXT,
  status public.submission_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.ticket_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.ticket_inquiries TO authenticated;
GRANT ALL ON public.ticket_inquiries TO service_role;
ALTER TABLE public.ticket_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tickets anon insert" ON public.ticket_inquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "tickets auth insert" ON public.ticket_inquiries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tickets staff manage" ON public.ticket_inquiries FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ SPONSOR INQUIRIES ============
CREATE TABLE public.sponsor_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tier TEXT,
  budget_range TEXT,
  message TEXT,
  status public.submission_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.sponsor_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.sponsor_inquiries TO authenticated;
GRANT ALL ON public.sponsor_inquiries TO service_role;
ALTER TABLE public.sponsor_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sponsors anon insert" ON public.sponsor_inquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sponsors auth insert" ON public.sponsor_inquiries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "sponsors staff manage" ON public.sponsor_inquiries FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ SEED DATA ============
INSERT INTO public.panelists (slug, name, tag, aka, firm, city, bio, quote, headshot, roast_meter, appetite, record_wins, record_kos, aum, years, deals) VALUES
('vikram-mehra','Vikram Mehra','The Hammer','MUM · #01','MehraCo Capital','Mumbai','Founder of two unicorns, one IPO. Sits on six boards. Has terminated more pitches on this show than anyone else.','Profit is not a strategy. It is the only requirement to exist in my room.','/src/assets/panel-01.jpg',95,'B2B Infra · Manufacturing',12,4,'₹2,400 Cr',27,44),
('riya-kapoor','Riya Kapoor','The Architect','BLR · #02','Kapoor Solo GP','Bengaluru','Ex-Sequoia partner turned solo GP. Backed 11 of India''s top 50 SaaS exits. Patient until she isn''t.','I don''t invest in products. I invest in founders who''ve survived a near-death experience.','/src/assets/panel-02.jpg',62,'Vertical SaaS · Climate',9,2,'₹3,800 Cr',18,61),
('arjun-shetty','Arjun Shetty','Velocity','BLR · #03','Shetty Ventures','Bengaluru','Founded a quick-commerce unicorn at 26. Sold at 31. Now hunts for the next one — and is brutal about it.','If your Bharat go-to-market fits on a slide, you don''t have one. Show me the WhatsApp groups.','/src/assets/panel-03.jpg',88,'Consumer · Bharat AI',6,8,'₹950 Cr',11,29),
('nikhil-joshi','Nikhil Joshi','The Closer','MUM · #04','Joshi Payments Fund','Mumbai','Ex-RBI working group, two payments exits. Closes deals on stage in under 11 minutes — or not at all.','Show me the door you walk through when the round doesn''t close. That''s the founder I back.','/src/assets/panel-01.jpg',91,'Fintech · Payments',11,5,'₹1,700 Cr',20,38),
('aisha-khan','Dr. Aisha Khan','The Algorithm','HYD · #05','Algorithm Labs','Hyderabad','PhD in computational biology. Built two healthtech companies. Has the calmest voice in the worst moments.','Every founder lies on revenue. The unit economics don''t. I''ll wait while you do the math.','/src/assets/panel-02.jpg',74,'Deep Tech · Healthtech',7,3,'₹1,200 Cr',15,22);

INSERT INTO public.episodes (slug, round_code, title, city, sector, lap_time, outcome, recap, hero_img, funded_label, status, air_date) VALUES
('r04-the-10-minute-lie','R04','The 10-Minute Lie','Mumbai','Quick-Commerce','42:11','TERMINATED','A solo founder defends ₹40 Cr GMV against three sharks who already pulled his Razorpay statements. Mehra cuts the pitch at minute eleven. Kapoor walks. Shetty refuses to look up from his notes.','/src/assets/ep-01.jpg','—','aired','2026-02-12'),
('r07-bharat-bites-goes-global','R07','Bharat Bites Goes Global','Bengaluru','D2C · Bharat','38:02','TERM SHEET','Twin co-founders walk in selling tier-3 snacks. Walk out with US distribution money on the table. Joshi closes in four minutes flat — a season record.','/src/assets/ep-02.jpg','₹3.2 Cr','aired','2026-02-19'),
('r02-the-valuation-standoff','R02','The Valuation Standoff','Delhi','Fintech','51:34','VIRAL','A 22-year-old IIT dropout pitches ₹600 Cr cap. The panel does not laugh — at first. Clip racked up 50M views in 72 hours.','/src/assets/ep-03.jpg','—','aired','2026-01-29'),
('r09-bare-soil','R09','Bare Soil','Mumbai','AgriTech','47:18','STANDING OVATION','A founder reveals her cofounder walked four hours before stage call. She still pitched solo. Five sharks stood. ₹1.8 Cr closed live.','/src/assets/ep-01.jpg','₹1.8 Cr','aired','2026-03-05'),
('r11-the-refusal','R11','The Refusal','Hyderabad','SaaS','29:04','WALK-OFF','A founder walks off stage at minute six. Mehra throws his pen. The crowd erupts. No deal. No regret.','/src/assets/ep-02.jpg','—','aired','2026-03-12'),
('r13-the-finale','R13','The Finale','Mumbai','Bharat AI','78:22','TERM SHEET','Three survivors. One arena. A live ₹10 Cr cheque on the table from Peak XV.','/src/assets/ep-03.jpg','₹10 Cr','aired','2026-03-26'),
('r05-the-tutor-wars','R05','The Tutor Wars','Pune','EdTech','44:51','VIRAL','A coaching-class founder vs. an AI tutor founder. Both go down. The clip hits 50M views.','/src/assets/ep-02.jpg','—','aired','2026-02-05'),
('r12-the-burn-rate-problem','R12','The Burn Rate Problem','Bengaluru','Healthtech','33:09','TERMINATED','₹4 Cr/month burn. Three sharks demand the cofounder list. It does not go well.','/src/assets/ep-01.jpg','—','aired','2026-03-19');

INSERT INTO public.founders (slug, name, startup, sector, city, stage, ask, valuation, traction, bio, headshot, position, position_delta, heat, funded_label, status) VALUES
('aarav-iyer','Aarav Iyer','GridSpark','Climate','Bengaluru','Series A','₹15 Cr','₹120 Cr','40 MW grid-tied installs · 18 cities · ₹6.4 Cr ARR','Solo founder. Ex-Tesla India. Built GridSpark out of a 2-person garage in Whitefield. Won S01 with the highest panel vote.','/src/assets/ep-01.jpg',1,'▲2',98,'₹3.4 Cr','champion'),
('meera-nair','Meera Nair','Bharat Bites','D2C','Mumbai','Seed+','₹5 Cr','₹40 Cr','12,000 SKUs · 240 distributors · ₹2.1 Cr MRR','Twin co-founders. Tier-3 snack brand serving 1,800 small shops. Fastest close in BKL Sharks history at 4 min 11 sec.','/src/assets/ep-02.jpg',2,'▲5',94,'₹2.0 Cr','active'),
('rohit-singh','Rohit Singh','Lattice Labs','Deep Tech','Pune','Pre-A','₹8 Cr','₹65 Cr','3 enterprise pilots · 2 patents · ISRO partnership','Material scientist. Lattice Labs builds composite panels for satellite payloads.','/src/assets/ep-03.jpg',3,'—',89,'₹1.8 Cr','active'),
('anaya-reddy','Anaya Reddy','KrishiOS','AgriTech','Hyderabad','Seed','₹3 Cr','₹24 Cr','11,000 farmers onboarded · 4 state govt MoUs','Built KrishiOS while finishing her MSc Agronomy. Manages 11,000 small farmers via WhatsApp + IVR.','/src/assets/ep-01.jpg',4,'▼1',86,'—','active'),
('tara-joshi','Tara Joshi','Hinglish.ai','AI','Bengaluru','Pre-Seed','₹2 Cr','₹16 Cr','1.4 M sessions/mo · 47% Hindi · 32% Tamil','Voice-first LLM that switches Indian languages mid-utterance.','/src/assets/ep-02.jpg',5,'▲3',81,'₹90 L','active'),
('devansh-patel','Devansh Patel','10x Tutor','EdTech','Ahmedabad','Seed','₹4 Cr','₹30 Cr','82,000 students · ₹1.1 Cr MRR · 71% retention','Built 10x Tutor in his hostel room. Standing ovation on Episode 5.','/src/assets/ep-03.jpg',6,'▲1',77,'—','active'),
('sneha-bose','Sneha Bose','NovaCare','Healthtech','Kolkata','Seed','₹6 Cr','₹50 Cr','24 clinics · 11,000 patient records · NABH compliant','Tier-2 clinic chain operator. Built NovaCare to digitize 24 partner clinics in Eastern India.','/src/assets/ep-01.jpg',7,'▼4',72,'₹60 L','active'),
('ishaan-malhotra','Ishaan Malhotra','RouteOne','Logistics','Delhi','Pre-A','₹10 Cr','₹85 Cr','220 fleet · 8 cities · ₹3.4 Cr MRR','Ex-Delhivery operator. RouteOne handles inter-city LTL.','/src/assets/ep-02.jpg',8,'▲2',68,'₹1.2 Cr','active'),
('priya-sen','Priya Sen','Mehndi Studio','Creator','Mumbai','Pre-Seed','₹80 L','₹6 Cr','420k subscribers · 12 creators onboarded','Creator economy infra for Indian beauty creators.','/src/assets/ep-03.jpg',9,'▼2',61,'—','active'),
('yuvraj-khanna','Yuvraj Khanna','Slate Audio','Consumer','Bengaluru','Seed','₹3 Cr','₹22 Cr','12,000 units shipped','Audiophile-grade speakers manufactured in India.','/src/assets/ep-01.jpg',10,'—',54,'—','active'),
('jaya-bauer','Jaya Bauer','Protocol','Crypto','Mumbai','Pre-Seed','₹2 Cr','₹18 Cr','Closed beta · 1,400 wallets','On-chain INR settlement protocol. Terminated after panel pulled compliance docs live on stage.','/src/assets/ep-02.jpg',11,'▼3',41,'—','eliminated'),
('kabir-verma','Kabir Verma','DropPay','Fintech','Delhi','Seed','₹5 Cr','₹600 Cr','2,400 MAU · 0 revenue','Walked off stage at minute six of Episode 11. The clip went viral.','/src/assets/ep-03.jpg',12,'▼7',22,'—','withdrew');
