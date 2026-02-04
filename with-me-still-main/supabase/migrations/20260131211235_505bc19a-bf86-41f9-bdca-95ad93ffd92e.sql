-- Create sessions table for anonymous + authenticated users
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id TEXT,
  region TEXT DEFAULT 'US',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT session_identity CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

-- Create messages table for conversation history
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  is_crisis_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memories table for longitudinal memory
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('emotional_state', 'physical_state', 'appointment', 'coping_strategy', 'milestone', 'personal_win', 'pattern', 'preference')),
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  source_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create check_ins table for daily check-ins
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  notes TEXT,
  skipped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crisis_events table for governance logging
CREATE TABLE public.crisis_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  trigger_content TEXT NOT NULL,
  detected_signals TEXT[] NOT NULL,
  resources_shown JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_events ENABLE ROW LEVEL SECURITY;

-- Sessions: Users can access their own sessions (by user_id or anonymous_id stored in localStorage)
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (
    auth.uid() = user_id OR 
    anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
  );

CREATE POLICY "Users can create sessions" ON public.sessions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

CREATE POLICY "Users can update own sessions" ON public.sessions
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
  );

-- Messages: Users can access messages in their sessions
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

CREATE POLICY "Users can create messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

-- Memories: Users can fully manage their own memories
CREATE POLICY "Users can view own memories" ON public.memories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

CREATE POLICY "Users can create memories" ON public.memories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

CREATE POLICY "Users can update own memories" ON public.memories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

CREATE POLICY "Users can delete own memories" ON public.memories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

-- Check-ins: Users can manage their own check-ins
CREATE POLICY "Users can view own check_ins" ON public.check_ins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

CREATE POLICY "Users can create check_ins" ON public.check_ins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

-- Crisis events: Only insertable (for governance), viewable by session owner
CREATE POLICY "Users can view own crisis_events" ON public.crisis_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

CREATE POLICY "Users can create crisis_events" ON public.crisis_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = session_id 
      AND (s.user_id = auth.uid() OR s.anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_messages_session_id ON public.messages(session_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_memories_session_id ON public.memories(session_id);
CREATE INDEX idx_memories_type ON public.memories(memory_type);
CREATE INDEX idx_check_ins_session_id ON public.check_ins(session_id);
CREATE INDEX idx_check_ins_created_at ON public.check_ins(created_at);
CREATE INDEX idx_sessions_anonymous_id ON public.sessions(anonymous_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();