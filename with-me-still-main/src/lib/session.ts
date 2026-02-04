// Session management for anonymous + authenticated users
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

const ANONYMOUS_ID_KEY = "withme_anonymous_id";

export function getAnonymousId(): string {
  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

export function clearAnonymousId(): void {
  localStorage.removeItem(ANONYMOUS_ID_KEY);
}

export interface CompanionTraits {
  warmth: "high" | "medium" | "low";
  formality: "casual" | "balanced" | "formal";
  verbosity: "concise" | "balanced" | "detailed";
}

export interface SessionData {
  id: string;
  user_id: string | null;
  anonymous_id: string | null;
  region: string;
  onboarding_completed: boolean;
  theme: string;
  companion_name: string;
  companion_traits: CompanionTraits;
  created_at: string;
  updated_at: string;
}

const defaultTraits: CompanionTraits = { warmth: "high", formality: "casual", verbosity: "concise" };

// Safely parse companion traits from JSON
function parseCompanionTraits(traits: Json | null): CompanionTraits {
  if (!traits || typeof traits !== "object" || Array.isArray(traits)) {
    return defaultTraits;
  }
  
  const obj = traits as Record<string, unknown>;
  return {
    warmth: (obj.warmth as CompanionTraits["warmth"]) || "high",
    formality: (obj.formality as CompanionTraits["formality"]) || "casual",
    verbosity: (obj.verbosity as CompanionTraits["verbosity"]) || "concise",
  };
}

// Convert database row to SessionData with proper typing
function toSessionData(row: {
  id: string;
  user_id: string | null;
  anonymous_id: string | null;
  region: string | null;
  onboarding_completed: boolean | null;
  theme: string | null;
  companion_name: string | null;
  companion_traits: Json | null;
  created_at: string;
  updated_at: string;
}): SessionData {
  return {
    id: row.id,
    user_id: row.user_id,
    anonymous_id: row.anonymous_id,
    region: row.region || "US",
    onboarding_completed: row.onboarding_completed || false,
    theme: row.theme || "system",
    companion_name: row.companion_name || "Still",
    companion_traits: parseCompanionTraits(row.companion_traits),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getOrCreateSession(): Promise<SessionData> {
  const { data: authData } = await supabase.auth.getSession();
  const userId = authData.session?.user?.id || null;
  const anonymousId = userId ? null : getAnonymousId();

  // Try to find existing session
  let query = supabase.from("sessions").select("*");
  
  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("anonymous_id", anonymousId);
  }

  const { data: existingSession, error: fetchError } = await query.maybeSingle();

  if (existingSession) {
    return toSessionData(existingSession);
  }

  // Create new session
  const { data: newSession, error: createError } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      anonymous_id: anonymousId,
      region: "US",
      onboarding_completed: false,
      theme: "system",
      companion_name: "Still",
      companion_traits: defaultTraits as unknown as Json,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create session: ${createError.message}`);
  }

  return toSessionData(newSession);
}

export type SessionUpdateFields = "region" | "onboarding_completed" | "theme" | "companion_name" | "companion_traits";

export async function updateSession(
  sessionId: string,
  updates: Partial<Pick<SessionData, SessionUpdateFields>>
): Promise<SessionData> {
  // Convert CompanionTraits to Json for database
  const dbUpdates: Record<string, unknown> = {};
  
  if (updates.region !== undefined) dbUpdates.region = updates.region;
  if (updates.onboarding_completed !== undefined) dbUpdates.onboarding_completed = updates.onboarding_completed;
  if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
  if (updates.companion_name !== undefined) dbUpdates.companion_name = updates.companion_name;
  if (updates.companion_traits !== undefined) {
    dbUpdates.companion_traits = updates.companion_traits as unknown as Json;
  }

  const { data, error } = await supabase
    .from("sessions")
    .update(dbUpdates)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update session: ${error.message}`);
  }

  return toSessionData(data);
}

export async function migrateAnonymousToUser(
  anonymousSessionId: string,
  userId: string
): Promise<SessionData> {
  const { data, error } = await supabase
    .from("sessions")
    .update({
      user_id: userId,
      anonymous_id: null,
    })
    .eq("id", anonymousSessionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to migrate session: ${error.message}`);
  }

  clearAnonymousId();
  return toSessionData(data);
}
