-- Add companion name field to sessions
ALTER TABLE public.sessions 
ADD COLUMN companion_name TEXT DEFAULT 'Still';

-- Add companion persona preferences
ALTER TABLE public.sessions 
ADD COLUMN companion_traits JSONB DEFAULT '{"warmth": "high", "formality": "casual", "verbosity": "concise"}'::jsonb;