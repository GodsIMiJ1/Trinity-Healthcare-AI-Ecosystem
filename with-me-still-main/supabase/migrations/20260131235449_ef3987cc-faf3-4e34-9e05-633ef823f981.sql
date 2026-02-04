-- Fix sessions RLS policy to allow anonymous session creation
DROP POLICY IF EXISTS "Users can create sessions" ON public.sessions;
CREATE POLICY "Users can create sessions" 
ON public.sessions 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND anonymous_id IS NOT NULL)
);

-- Create thought_loop table (rolling window of recent context)
CREATE TABLE public.thought_loop (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  recent_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  themes TEXT[] NOT NULL DEFAULT '{}',
  open_loops TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id)
);

-- Create nebulae table (semantic memory clusters)
CREATE TABLE public.nebulae (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  summary TEXT,
  dominant_emotion TEXT,
  memory_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_log table (immutable append-only)
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  ts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actor TEXT NOT NULL CHECK (actor IN ('user', 'aga', 'system')),
  action TEXT NOT NULL,
  input_hash TEXT,
  result TEXT NOT NULL CHECK (result IN ('allowed', 'blocked', 'escalated')),
  policy_refs TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add new columns to memories table
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS emotion JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS consent JSONB DEFAULT '{"share_with_clinic": false, "share_with_memory": true}'::jsonb,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'chat' CHECK (source IN ('chat', 'checkin', 'note'));

-- Enable RLS on new tables
ALTER TABLE public.thought_loop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nebulae ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for thought_loop
CREATE POLICY "Users can view own thought_loop" 
ON public.thought_loop 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = thought_loop.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

CREATE POLICY "Users can create thought_loop" 
ON public.thought_loop 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = thought_loop.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

CREATE POLICY "Users can update own thought_loop" 
ON public.thought_loop 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = thought_loop.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

-- RLS policies for nebulae
CREATE POLICY "Users can view own nebulae" 
ON public.nebulae 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = nebulae.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

CREATE POLICY "Users can create nebulae" 
ON public.nebulae 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = nebulae.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

CREATE POLICY "Users can update own nebulae" 
ON public.nebulae 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = nebulae.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

CREATE POLICY "Users can delete own nebulae" 
ON public.nebulae 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = nebulae.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

-- RLS policies for audit_log (INSERT only - immutable)
CREATE POLICY "Users can view own audit_log" 
ON public.audit_log 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = audit_log.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

CREATE POLICY "Users can create audit_log" 
ON public.audit_log 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.id = audit_log.session_id 
  AND (s.user_id = auth.uid() OR s.anonymous_id = ((current_setting('request.headers'::text, true))::json ->> 'x-anonymous-id'))
));

-- NO UPDATE or DELETE policies for audit_log - it's immutable

-- Create indexes for performance
CREATE INDEX idx_thought_loop_session ON public.thought_loop(session_id);
CREATE INDEX idx_nebulae_session ON public.nebulae(session_id);
CREATE INDEX idx_audit_log_session ON public.audit_log(session_id);
CREATE INDEX idx_audit_log_ts ON public.audit_log(ts DESC);
CREATE INDEX idx_memories_emotion ON public.memories USING gin(emotion);
CREATE INDEX idx_memories_tags ON public.memories USING gin(tags);

-- Add triggers for updated_at
CREATE TRIGGER update_thought_loop_updated_at
BEFORE UPDATE ON public.thought_loop
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nebulae_updated_at
BEFORE UPDATE ON public.nebulae
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();