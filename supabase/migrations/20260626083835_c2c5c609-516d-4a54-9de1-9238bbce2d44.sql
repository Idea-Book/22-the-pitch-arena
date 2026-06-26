
-- Default new community posts to pending so they hit the moderation queue
ALTER TABLE public.community_posts ALTER COLUMN status SET DEFAULT 'pending';

-- Enable realtime streaming on episodes and community_posts
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.episodes REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='community_posts') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='episodes') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.episodes;
  END IF;
END $$;
