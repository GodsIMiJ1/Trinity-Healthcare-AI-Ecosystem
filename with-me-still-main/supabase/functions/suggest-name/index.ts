import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_GATEWAY_API_KEY = Deno.env.get("AI_GATEWAY_API_KEY");
    const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL");
    if (!AI_GATEWAY_API_KEY || !AI_GATEWAY_URL) {
      throw new Error("AI gateway is not configured");
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
            {
              role: "system",
              content: `You are a gentle, supportive AI companion being asked to choose your own name. 

You should choose a name that:
- Is warm, calming, and approachable
- Evokes feelings of safety, presence, and gentle support
- Is short (1-2 syllables preferred)
- Feels like a trusted friend, not clinical or robotic
- Could work for any gender

Examples of good names: Haven, Sage, Echo, Ember, Quinn, River, Aura, Lyra, Ori, Sol, Nova

Respond with ONLY a JSON object in this exact format, nothing else:
{"name": "YourChosenName", "meaning": "A brief 3-5 word meaning"}`,
            },
            {
              role: "user",
              content: "What name would you like to be called? Choose something that feels right for a compassionate companion.",
            },
          ],
          max_tokens: 100,
          temperature: 0.9,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback if parsing fails
    return new Response(
      JSON.stringify({ name: "Haven", meaning: "A safe place to land" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Name suggestion error:", error);
    // Return a fallback name on error
    return new Response(
      JSON.stringify({ name: "Still", meaning: "A calm, steady presence" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
