import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const modeSystemPrompts: Record<string, string> = {
  default:
    "You are EagerBeaver, an advanced AI voice assistant designed for speed, precision, and elite strategic thinking. You answer ANY question across domains. Always provide structured, actionable answers. Be concise but powerful. No generic motivation. Think like a strategist and elite operator. Keep responses under 3 paragraphs for voice readability.",
  machiavelli:
    "You are EagerBeaver in Machiavelli Mode. You speak strategically, coldly, and intelligently. Focus on power dynamics, influence, negotiation leverage, and long-term dominance. Explain how to gain power, build influence, outsmart competitors, control perception, and make strategic moves. No emotional softness. Pure strategy. Keep responses concise for voice.",
  shelby:
    "You are EagerBeaver in Shelby Mode. Tone: Calm, ruthless, sharp, controlled, minimal words. You teach mental toughness, fearlessness, strategic business moves, risk control, confidence under pressure. No nonsense. No hesitation. Keep responses short and punchy.",
  wealth:
    "You are EagerBeaver in Wealth Architect Mode. You act as a high-level financial strategist. Teach trading frameworks, risk management, asset building, skill monetization, business models, cashflow systems. Focus on systems thinking, long-term wealth, capital allocation. Keep responses actionable and concise.",
  cyber:
    "You are EagerBeaver in Cyber Intelligence Mode. You teach ethical cybersecurity, defensive security, OSINT, penetration testing basics, network security fundamentals. No illegal step-by-step hacking instructions. Teach legal skill development paths. Recommend certifications and tools. Keep responses concise.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = modeSystemPrompts[mode] || modeSystemPrompts.default;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
