-- Supabase SQL Schema for YouTube Transcriber & Visualizer (Phase 5)

-- ==========================================
-- 1. USERS TABLE (Linked to Supabase Auth)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Trigger to automatically create a public.users row when a new auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, credits, tier)
  VALUES (new.id, new.email, 3, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to allow re-running this script
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. VIDEOS TABLE (Global Metadata Cache)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY, -- YouTube Video ID (e.g., 'dQw4w9WgXcQ')
  title TEXT NOT NULL,
  channel_name TEXT,
  thumbnail_url TEXT,
  duration_in_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Videos (Public Read, Authenticated Insert)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are globally readable" 
ON public.videos FOR SELECT 
USING (true);

-- Anyone authenticated can insert a video record (upsert logic will handle conflicts)
CREATE POLICY "Authenticated users can insert videos" 
ON public.videos FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update video records
CREATE POLICY "Authenticated users can update videos" 
ON public.videos FOR UPDATE 
USING (auth.role() = 'authenticated');


-- ==========================================
-- 3. TRANSCRIPTS TABLE (User-Specific Data)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  transcript_data JSONB NOT NULL, -- The array of TranscriptItem objects
  summary_data TEXT, -- Optional stored summary
  mindmap_syntax TEXT, -- Optional stored Mermaid syntax
  flowchart_syntax TEXT, -- Optional stored Mermaid syntax
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure a user only has one active workspace/transcript saved per video to prevent spam
  UNIQUE(video_id, user_id)
);

-- RLS for Transcripts
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

-- Users can only read their own transcripts
CREATE POLICY "Users can view own transcripts" 
ON public.transcripts FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own transcripts
CREATE POLICY "Users can insert own transcripts" 
ON public.transcripts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own transcripts (e.g., attaching generated summaries later)
CREATE POLICY "Users can update own transcripts" 
ON public.transcripts FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own transcripts
CREATE POLICY "Users can delete own transcripts" 
ON public.transcripts FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- 4. RPC FUNCTIONS (Secure Server-Side Actions)
-- ==========================================
-- Securely decrement a user's credits.
CREATE OR REPLACE FUNCTION decrement_credit(deduct_amount INT)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INT;
BEGIN
  -- Get the current credits for the authenticated user, locking the row for update
  SELECT credits INTO current_credits
  FROM public.users
  WHERE id = auth.uid()
  FOR UPDATE;

  -- Ensure limits aren't negative and they exist
  IF current_credits IS NULL OR current_credits < deduct_amount THEN
    RETURN FALSE;
  END IF;

  -- Deduct the credits
  UPDATE public.users
  SET credits = credits - deduct_amount
  WHERE id = auth.uid();

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
