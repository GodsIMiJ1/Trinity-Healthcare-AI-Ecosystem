import { useState, useEffect, useCallback } from "react";
import { getOrCreateSession, updateSession, SessionData, SessionUpdateFields } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initSession = useCallback(async () => {
    try {
      setLoading(true);
      const sessionData = await getOrCreateSession();
      setSession(sessionData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to initialize session"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      initSession();
    });

    return () => subscription.unsubscribe();
  }, [initSession]);

  const update = useCallback(
    async (updates: Partial<Pick<SessionData, SessionUpdateFields>>) => {
      if (!session) return;
      try {
        const updated = await updateSession(session.id, updates);
        setSession(updated);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to update session"));
        throw err;
      }
    },
    [session]
  );

  return {
    session,
    loading,
    error,
    update,
    refresh: initSession,
  };
}
