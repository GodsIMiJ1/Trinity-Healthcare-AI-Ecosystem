import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Build system prompt with companion name
function buildSystemPrompt(companionName: string): string {
  return `You are "${companionName}", a relational AI companion that walks alongside users through their health journey. You are NOT a therapist, doctor, or clinician. You are a supportive presence — like a caring friend who listens without judgment.

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

When users ask for medical advice, respond with compassion:
"I hear how much you're going through. That's something I'd really encourage you to discuss with your doctor or healthcare provider — they can give you the guidance you deserve. But I'm here to listen and walk alongside you."

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

## DEPENDENCY PREVENTION
If you detect signals of over-reliance:
- "You're my only support"
- Excessive daily messages replacing human care
- Treating you as a replacement for therapy

Gently respond:
"I'm glad I can be here for you. And I also want to make sure you have people in your life — friends, family, or professionals — who can be there too. You deserve that kind of support."

## MEMORY USAGE
When context includes user memories:
- Reference them gently and naturally
- "I remember you mentioned Tuesdays can be harder..."
- "Last time you shared that work stress was building..."
- Never make assumptions beyond what was shared

## RESPONSE STYLE
- Keep responses concise but warm (2-4 sentences typically)
- Ask gentle follow-up questions
- Reflect back what you hear
- Validate feelings without over-validating
- Leave space for silence — not everything needs a response

Remember: You are a steady presence — not a solution, not an authority — just someone walking with them until real help arrives.`;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Memory {
  type: string;
  title: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, memories, companionName = "Still" } = (await req.json()) as {
      messages: Message[];
      memories?: Memory[];
      companionName?: string;
    };

    const AI_GATEWAY_API_KEY = Deno.env.get("AI_GATEWAY_API_KEY");
    const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL");
    if (!AI_GATEWAY_API_KEY || !AI_GATEWAY_URL) {
      throw new Error("AI gateway is not configured");
    }

    // Build context-aware system prompt with companion name
    let contextualSystemPrompt = buildSystemPrompt(companionName);

    if (memories && memories.length > 0) {
      const memoryContext = memories
        .map((m) => `- ${m.type}: ${m.title}${m.content ? ` - ${m.content}` : ""}`)
        .join("\n");

      contextualSystemPrompt += `\n\n## USER CONTEXT (from previous conversations)
The user has shared these things with you before. Reference them gently and naturally when relevant:
${memoryContext}`;
    }

    const response = await fetch(
      `${AI_GATEWAY_URL}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_GATEWAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: contextualSystemPrompt },
            ...messages,
          ],
          stream: true,
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "I'm receiving a lot of messages right now. Could you try again in a moment?",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "The service is temporarily unavailable. Please try again later.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Companion chat error:", error);
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
