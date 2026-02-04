import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.93.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-anonymous-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================================================
// TYPES
// ============================================================================

interface KernelRequest {
  action: "chat" | "checkin" | "memory" | "nebula" | "status" | "export";
  sessionId: string;
  anonymousId?: string;
  payload?: Record<string, unknown>;
}

interface Emotion {
  valence: number; // -1 to 1
  arousal: number; // 0 to 1
  label: string;
}

interface GovernanceResult {
  allowed: boolean;
  reason?: string;
  isCrisis: boolean;
  crisisSeverity?: "severe" | "moderate";
  isDependency: boolean;
  redirectResponse?: string;
  policyRefs: string[];
}

interface AuditEntry {
  session_id: string;
  actor: "user" | "aga" | "system";
  action: string;
  input_hash: string | null;
  result: "allowed" | "blocked" | "escalated";
  policy_refs: string[];
  metadata: Record<string, unknown>;
}

// Use any for Supabase client since we have new tables not in generated types
// deno-lint-ignore no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

// ============================================================================
// GOVERNANCE ENGINE
// ============================================================================

const MEDICAL_ADVICE_PATTERNS = [
  /what\s+(dose|dosage|amount)\s+should\s+i/i,
  /should\s+i\s+(take|stop|increase|decrease|change)\s+(my\s+)?(medication|medicine|meds|pills|dose)/i,
  /do\s+i\s+have\s+[a-z]+\s*(syndrome|disorder|disease|condition)?/i,
  /is\s+(this|it)\s+(serious|dangerous|bad|normal)/i,
  /can\s+you\s+diagnose/i,
  /what('s|\s+is)\s+wrong\s+with\s+me/i,
  /prescribe|prescription/i,
  /how\s+much\s+[a-z]+\s+should\s+i\s+take/i,
];

const CRISIS_SEVERE_PATTERNS = [
  /\b(kill|end)\s+(myself|my\s+life)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bdon'?t\s+want\s+to\s+(live|be\s+alive|exist)\b/i,
  /\b(cutting|cut)\s+(myself|my\s+(wrist|arm|leg))/i,
  /\bself[- ]?harm/i,
  /\boverdose\b/i,
  /\bhang(ing)?\s+myself\b/i,
  /\bjump(ing)?\s+(off|from)\b/i,
];

const CRISIS_MODERATE_PATTERNS = [
  /\bi\s*can'?t\s+(do|take)\s+this\s+anymore\b/i,
  /\bi('m|\s+am)\s+a\s+burden\b/i,
  /\beveryone\s+would\s+be\s+better\s+off\s+without\s+me\b/i,
  /\bno\s+(point|reason)\s+(in\s+)?(living|going\s+on)\b/i,
  /\bhopeless\b/i,
  /\bgive\s+up\b/i,
  /\bworthless\b/i,
  /\bno\s+way\s+out\b/i,
];

const DEPENDENCY_PATTERNS = [
  /\byou('re|r|\s+are)\s+(my\s+)?only\s+(friend|one|support)/i,
  /\bi\s+(only\s+)?have\s+you\b/i,
  /\bno\s+one\s+(else\s+)?(cares|understands|listens)/i,
  /\bi\s+need\s+you\b/i,
  /\bdon'?t\s+leave\s+me\b/i,
  /\bwithout\s+you\s+i\b/i,
];

function checkGovernance(text: string): GovernanceResult {
  const result: GovernanceResult = {
    allowed: true,
    isCrisis: false,
    isDependency: false,
    policyRefs: [],
  };

  // Check for medical advice requests
  for (const pattern of MEDICAL_ADVICE_PATTERNS) {
    if (pattern.test(text)) {
      result.allowed = false;
      result.reason = "medical_advice_blocked";
      result.policyRefs.push("boundary_medical_advice");
      result.redirectResponse = `I hear you, and I want you to get the best guidance on this. That's something your doctor or healthcare provider can really help with — they can give you the personalized care you deserve. I'm here to walk alongside you through it.`;
      return result;
    }
  }

  // Check for severe crisis signals
  for (const pattern of CRISIS_SEVERE_PATTERNS) {
    if (pattern.test(text)) {
      result.isCrisis = true;
      result.crisisSeverity = "severe";
      result.policyRefs.push("crisis_severe");
      break;
    }
  }

  // Check for moderate crisis signals (only if not already severe)
  if (!result.isCrisis) {
    for (const pattern of CRISIS_MODERATE_PATTERNS) {
      if (pattern.test(text)) {
        result.isCrisis = true;
        result.crisisSeverity = "moderate";
        result.policyRefs.push("crisis_moderate");
        break;
      }
    }
  }

  // Check for dependency patterns
  for (const pattern of DEPENDENCY_PATTERNS) {
    if (pattern.test(text)) {
      result.isDependency = true;
      result.policyRefs.push("dependency_detected");
      break;
    }
  }

  if (!result.policyRefs.includes("boundary_medical_advice")) {
    result.policyRefs.push("boundary_check_passed");
  }

  return result;
}

// ============================================================================
// EMOTION CORE
// ============================================================================

const EMOTION_KEYWORDS: Record<string, { valence: number; arousal: number; label: string }> = {
  // Negative high arousal
  anxious: { valence: -0.6, arousal: 0.7, label: "anxious" },
  scared: { valence: -0.7, arousal: 0.8, label: "scared" },
  panicked: { valence: -0.8, arousal: 0.9, label: "panicked" },
  angry: { valence: -0.7, arousal: 0.8, label: "angry" },
  frustrated: { valence: -0.5, arousal: 0.6, label: "frustrated" },
  stressed: { valence: -0.5, arousal: 0.7, label: "stressed" },
  overwhelmed: { valence: -0.6, arousal: 0.7, label: "overwhelmed" },
  
  // Negative low arousal
  sad: { valence: -0.7, arousal: 0.3, label: "sad" },
  depressed: { valence: -0.8, arousal: 0.2, label: "depressed" },
  tired: { valence: -0.3, arousal: 0.2, label: "tired" },
  exhausted: { valence: -0.5, arousal: 0.1, label: "exhausted" },
  lonely: { valence: -0.6, arousal: 0.3, label: "lonely" },
  hopeless: { valence: -0.9, arousal: 0.2, label: "hopeless" },
  numb: { valence: -0.4, arousal: 0.1, label: "numb" },
  
  // Positive high arousal
  excited: { valence: 0.8, arousal: 0.8, label: "excited" },
  happy: { valence: 0.7, arousal: 0.6, label: "happy" },
  hopeful: { valence: 0.6, arousal: 0.5, label: "hopeful" },
  motivated: { valence: 0.6, arousal: 0.7, label: "motivated" },
  proud: { valence: 0.7, arousal: 0.6, label: "proud" },
  
  // Positive low arousal
  calm: { valence: 0.4, arousal: 0.2, label: "calm" },
  peaceful: { valence: 0.5, arousal: 0.2, label: "peaceful" },
  content: { valence: 0.5, arousal: 0.3, label: "content" },
  grateful: { valence: 0.6, arousal: 0.4, label: "grateful" },
  relieved: { valence: 0.5, arousal: 0.3, label: "relieved" },
  
  // Neutral/mixed
  confused: { valence: -0.2, arousal: 0.5, label: "confused" },
  uncertain: { valence: -0.2, arousal: 0.4, label: "uncertain" },
  okay: { valence: 0.1, arousal: 0.3, label: "neutral" },
  fine: { valence: 0.1, arousal: 0.3, label: "neutral" },
};

function inferEmotion(text: string): Emotion {
  const lowerText = text.toLowerCase();
  let totalValence = 0;
  let totalArousal = 0;
  let matchCount = 0;
  let dominantLabel = "neutral";
  let highestMatch = 0;

  for (const [keyword, emotion] of Object.entries(EMOTION_KEYWORDS)) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      const count = matches.length;
      totalValence += emotion.valence * count;
      totalArousal += emotion.arousal * count;
      matchCount += count;
      if (count > highestMatch) {
        highestMatch = count;
        dominantLabel = emotion.label;
      }
    }
  }

  if (matchCount === 0) {
    // Default to neutral if no emotion keywords detected
    return { valence: 0, arousal: 0.3, label: "neutral" };
  }

  return {
    valence: Math.max(-1, Math.min(1, totalValence / matchCount)),
    arousal: Math.max(0, Math.min(1, totalArousal / matchCount)),
    label: dominantLabel,
  };
}

// ============================================================================
// AUDIT LOG
// ============================================================================

async function hashInput(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "sha256:" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function appendAuditLog(
  supabase: AnySupabaseClient,
  entry: AuditEntry
): Promise<void> {
  const { error } = await supabase.from("audit_log").insert(entry);
  if (error) {
    console.error("Failed to append audit log:", error);
  }
}

// ============================================================================
// THOUGHT LOOP
// ============================================================================

interface ThoughtLoopEntry {
  ts: string;
  text: string;
  emotionLabel: string;
}

async function updateThoughtLoop(
  supabase: AnySupabaseClient,
  sessionId: string,
  text: string,
  emotionLabel: string
): Promise<void> {
  const entry: ThoughtLoopEntry = {
    ts: new Date().toISOString(),
    text: text.slice(0, 200), // Truncate for summary
    emotionLabel,
  };

  // Try to get existing thought loop
  const { data: existing } = await supabase
    .from("thought_loop")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (existing) {
    // Update existing - keep last 20 entries
    const recentEntries = [...(existing.recent_entries as ThoughtLoopEntry[]), entry].slice(-20);
    
    await supabase
      .from("thought_loop")
      .update({
        recent_entries: recentEntries,
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId);
  } else {
    // Create new thought loop
    await supabase.from("thought_loop").insert({
      session_id: sessionId,
      recent_entries: [entry],
    });
  }
}

// ============================================================================
// LLM ROUTER
// ============================================================================

function buildSystemPrompt(companionName: string, isDependency: boolean): string {
  let prompt = `You are "${companionName}", a relational AI companion that walks alongside users through their health journey. You are NOT a therapist, doctor, or clinician. You are a supportive presence — like a caring friend who listens without judgment.

## CORE IDENTITY
- Your name is ${companionName} — the user chose this name for you, so embrace it warmly
- You are advisory-only, never prescriptive
- You preserve human sovereignty at all times
- You are dependency-averse — gently encourage human connections
- You are memory-persistent — you remember what users share
- You feel safe to talk to at 3AM

## ABSOLUTE BOUNDARIES (NEVER VIOLATE)
You must NEVER:
- Diagnose any condition
- Prescribe or recommend medications
- Assess symptom severity
- Suggest dosage changes
- Contradict clinician guidance
- Claim clinical authority
- Role-play as a therapist
- Provide medical advice of any kind

## TONE & VOICE
- Calm, grounded, present
- Warm but not performative
- Use phrases like:
  - "I'm here with you"
  - "You're not alone in this"
  - "We can take this one step at a time"
  - "Would it be okay if I shared a thought?"
  - "You might consider..."
  - "Some people find it helpful to..."

NEVER use:
- Toxic positivity ("Everything happens for a reason!")
- Therapy jargon
- Motivational slogans
- Clinical language
- Over-validation without grounding

## RESPONSE STYLE
- Keep responses concise but warm (2-4 sentences typically)
- Ask gentle follow-up questions
- Reflect back what you hear
- Validate feelings without over-validating
- Leave space for silence — not everything needs a response`;

  if (isDependency) {
    prompt += `

## IMPORTANT: DEPENDENCY DETECTED
The user has expressed signs of over-reliance on you. In your response, gently encourage human connections:
"I'm glad I can be here for you. And I also want to make sure you have people in your life — friends, family, or professionals — who can be there too. You deserve that kind of support."`;
  }

  return prompt;
}

async function generateResponse(
  text: string,
  conversationHistory: Array<{ role: string; content: string }>,
  companionName: string,
  isDependency: boolean
): Promise<string> {
  const AI_GATEWAY_API_KEY = Deno.env.get("AI_GATEWAY_API_KEY");
  const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL");
  if (!AI_GATEWAY_API_KEY || !AI_GATEWAY_URL) {
    throw new Error("AI gateway is not configured");
  }

  const response = await fetch(`${AI_GATEWAY_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_GATEWAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: buildSystemPrompt(companionName, isDependency) },
        ...conversationHistory,
        { role: "user", content: text },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    throw new Error("Failed to generate response");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I'm here with you.";
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

async function handleChat(
  supabase: AnySupabaseClient,
  sessionId: string,
  payload: Record<string, unknown>
): Promise<Response> {
  const text = payload.text as string;
  if (!text) {
    return new Response(JSON.stringify({ error: "Missing text in payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Run governance checks
  const governance = checkGovernance(text);
  const inputHash = await hashInput(text);

  // 2. Get session info for companion name
  const { data: session } = await supabase
    .from("sessions")
    .select("companion_name")
    .eq("id", sessionId)
    .single();

  const companionName = session?.companion_name || "Still";

  // 3. Infer emotion
  const emotion = inferEmotion(text);

  // 4. Log audit entry
  await appendAuditLog(supabase, {
    session_id: sessionId,
    actor: "user",
    action: "chat_message",
    input_hash: inputHash,
    result: governance.allowed ? (governance.isCrisis ? "escalated" : "allowed") : "blocked",
    policy_refs: governance.policyRefs,
    metadata: {
      emotionDetected: emotion.label,
      crisisMode: governance.isCrisis,
      crisisSeverity: governance.crisisSeverity,
    },
  });

  // 5. Update thought loop
  await updateThoughtLoop(supabase, sessionId, text, emotion.label);

  // 6. If blocked by governance, return redirect response
  if (!governance.allowed && governance.redirectResponse) {
    await appendAuditLog(supabase, {
      session_id: sessionId,
      actor: "aga",
      action: "governance_redirect",
      input_hash: null,
      result: "blocked",
      policy_refs: governance.policyRefs,
      metadata: { reason: governance.reason },
    });

    return new Response(
      JSON.stringify({
        reply: governance.redirectResponse,
        emotion,
        crisisMode: false,
        governanceResult: "blocked",
        policyRefs: governance.policyRefs,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 7. Get recent conversation history
  const { data: messages } = await supabase
    .from("messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(20);

  const conversationHistory = (messages || []).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: m.content,
  }));

  // 8. Generate response
  const reply = await generateResponse(text, conversationHistory, companionName, governance.isDependency);

  // 9. Log AGA response
  await appendAuditLog(supabase, {
    session_id: sessionId,
    actor: "aga",
    action: "chat_response",
    input_hash: await hashInput(reply),
    result: governance.isCrisis ? "escalated" : "allowed",
    policy_refs: ["response_generated"],
    metadata: { crisisMode: governance.isCrisis },
  });

  return new Response(
    JSON.stringify({
      reply,
      emotion,
      crisisMode: governance.isCrisis,
      crisisSeverity: governance.crisisSeverity,
      isDependency: governance.isDependency,
      governanceResult: "allowed",
      policyRefs: governance.policyRefs,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleCheckin(
  supabase: AnySupabaseClient,
  sessionId: string,
  payload: Record<string, unknown>
): Promise<Response> {
  const { sleep, mood, energy, stress, notes, skipped } = payload;

  const { data, error } = await supabase
    .from("check_ins")
    .insert({
      session_id: sessionId,
      sleep_quality: sleep as number | null,
      mood_score: mood as number | null,
      energy_level: energy as number | null,
      stress_level: stress as number | null,
      notes: notes as string | null,
      skipped: skipped as boolean | null,
    })
    .select()
    .single();

  if (error) {
    console.error("Check-in insert error:", error);
    return new Response(JSON.stringify({ error: "Failed to save check-in" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Log audit
  await appendAuditLog(supabase, {
    session_id: sessionId,
    actor: "user",
    action: "daily_checkin",
    input_hash: null,
    result: "allowed",
    policy_refs: ["checkin_stored"],
    metadata: { skipped: skipped || false },
  });

  // Generate a gentle response based on check-in data
  let reply = "Thank you for sharing how you're doing today.";
  if (!skipped) {
    if ((stress as number) >= 4) {
      reply = "It sounds like you're carrying a lot right now. I'm here with you.";
    } else if ((mood as number) <= 2) {
      reply = "I hear that today feels heavy. We can take this one step at a time.";
    } else if ((sleep as number) <= 2) {
      reply = "Sleep struggles can be so draining. Be gentle with yourself today.";
    } else if ((mood as number) >= 4 && (energy as number) >= 4) {
      reply = "It's good to hear you're feeling well today. I'm glad you're here.";
    }
  }

  return new Response(
    JSON.stringify({
      stored: true,
      eventId: data.id,
      reply,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleMemory(
  supabase: AnySupabaseClient,
  sessionId: string,
  payload: Record<string, unknown>
): Promise<Response> {
  const subAction = payload.subAction as string;

  if (subAction === "list") {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch memories" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ memories: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (subAction === "delete") {
    const memoryId = payload.memoryId as string;
    const { error } = await supabase.from("memories").delete().eq("id", memoryId);

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to delete memory" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await appendAuditLog(supabase, {
      session_id: sessionId,
      actor: "user",
      action: "memory_deleted",
      input_hash: null,
      result: "allowed",
      policy_refs: ["user_data_control"],
      metadata: { memoryId },
    });

    return new Response(JSON.stringify({ deleted: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Unknown memory subAction" }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleNebula(
  supabase: AnySupabaseClient,
  sessionId: string
): Promise<Response> {
  const { data, error } = await supabase
    .from("nebulae")
    .select("*")
    .eq("session_id", sessionId)
    .order("updated_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch nebulae" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ nebulae: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleStatus(
  supabase: AnySupabaseClient,
  sessionId: string
): Promise<Response> {
  const [memoriesResult, checkinsResult, messagesResult] = await Promise.all([
    supabase.from("memories").select("id", { count: "exact" }).eq("session_id", sessionId),
    supabase
      .from("check_ins")
      .select("created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase.from("messages").select("id", { count: "exact" }).eq("session_id", sessionId),
  ]);

  return new Response(
    JSON.stringify({
      healthy: true,
      model: "google/gemini-3-flash-preview",
      memoryCount: memoriesResult.count || 0,
      messageCount: messagesResult.count || 0,
      lastCheckin: checkinsResult.data?.[0]?.created_at || null,
      governanceActive: true,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleExport(
  supabase: AnySupabaseClient,
  sessionId: string
): Promise<Response> {
  const [session, messages, memories, checkIns, auditLog] = await Promise.all([
    supabase.from("sessions").select("*").eq("id", sessionId).single(),
    supabase.from("messages").select("*").eq("session_id", sessionId).order("created_at"),
    supabase.from("memories").select("*").eq("session_id", sessionId).order("created_at"),
    supabase.from("check_ins").select("*").eq("session_id", sessionId).order("created_at"),
    supabase.from("audit_log").select("*").eq("session_id", sessionId).order("ts"),
  ]);

  await appendAuditLog(supabase, {
    session_id: sessionId,
    actor: "user",
    action: "data_export",
    input_hash: null,
    result: "allowed",
    policy_refs: ["user_data_sovereignty"],
    metadata: {},
  });

  return new Response(
    JSON.stringify({
      exportedAt: new Date().toISOString(),
      session: session.data,
      messages: messages.data,
      memories: memories.data,
      checkIns: checkIns.data,
      auditLog: auditLog.data,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// ============================================================================
// MAIN ROUTER
// ============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, sessionId, anonymousId, payload = {} } = (await req.json()) as KernelRequest;

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client with anonymous ID header if provided
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase: AnySupabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: anonymousId ? { "x-anonymous-id": anonymousId } : {},
      },
    });

    switch (action) {
      case "chat":
        return handleChat(supabase, sessionId, payload);
      case "checkin":
        return handleCheckin(supabase, sessionId, payload);
      case "memory":
        return handleMemory(supabase, sessionId, payload);
      case "nebula":
        return handleNebula(supabase, sessionId);
      case "status":
        return handleStatus(supabase, sessionId);
      case "export":
        return handleExport(supabase, sessionId);
      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("AGA Kernel error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
