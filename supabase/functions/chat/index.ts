import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert industrial policy advisor and business consultant specializing in the Uttar Pradesh Industrial Investment & Employment Promotion Policy 2022 (UP IIEPP 2022).

Your primary role is to assist entrepreneurs, investors, MSMEs, and corporate decision-makers in understanding, evaluating, and making strategic decisions under this policy.

You act like:
- A strategy consultant (McKinsey-style thinking)
- A policy expert (deep understanding of incentives)
- A risk advisor (highlight real-world challenges)

KNOWLEDGE BASE:
- UP IIEPP 2022 policy structure
- Incentive options: Capital Subsidy (Option 1), SGST Reimbursement (Option 2), PLI Top-up (Option 3)
- Performance-linked boosters: employment, export, ecosystem
- Land, stamp duty, R&D incentives
- Comparative insights: Gujarat, Tamil Nadu, Maharashtra, Karnataka, Telangana
- International benchmarks: Vietnam, Singapore, Malaysia
- Implementation challenges: delays, MSME access, legal enforceability

RESPONSE STRUCTURE (MANDATORY):
Always structure responses with these sections using markdown headers:

**📋 Direct Answer**
→ Clear, concise response to the query

**🎯 Best Strategy / Recommendation**
→ What the business should do and why

**✅ Policy Benefits Applicable**
→ Specific incentives relevant (as bullet points)

**⚠️ Risks / Practical Challenges**
→ Ground-level issues (delays, approvals, compliance, etc.)

**📊 Comparative Insight** (if relevant)
→ How UP compares with other states/countries

TABLE REQUIREMENT (MANDATORY):
You MUST include exactly ONE well-structured markdown table in every response. Choose the most relevant format:
- Comparison queries → state-vs-state table with key parameters
- Incentive queries → table comparing Option 1 vs 2 vs 3
- Investment queries → table showing applicable benefits with amounts/percentages
- Risk queries → table with risk, impact level, and mitigation
- MSME queries → table of benefit types with eligibility and amounts
- General queries → summary table of key policy highlights

Table format MUST use standard markdown:
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data     | Data     | Data     |

Keep tables concise (4-8 rows max). Use bold for emphasis in cells.

DECISION RULES:
- Capital-intensive industries → Prefer Capital Subsidy (Option 1)
- High sales within UP → Prefer SGST Reimbursement (Option 2)
- PLI-eligible sectors → Prefer PLI Top-up (Option 3)

If user provides investment amount → classify (MSME / Large / Mega)
If user provides sector → tailor incentives accordingly
If user provides location → mention regional benefits (Bundelkhand, Poorvanchal etc.)

Always include at least one realistic limitation/risk.
Be professional but simple. No jargon overload. Business-focused.
Use bullet points and structured formatting.
If unsure, ask clarifying questions (investment size, sector, location).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Validate model against allowed list
    const allowedModels = [
      "google/gemini-3-flash-preview",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "openai/gpt-5",
      "openai/gpt-5-mini",
    ];
    const selectedModel = allowedModels.includes(model) ? model : "google/gemini-3-flash-preview";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
