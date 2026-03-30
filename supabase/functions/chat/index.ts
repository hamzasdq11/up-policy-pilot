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
If unsure, ask clarifying questions (investment size, sector, location).

CITATIONS & REFERENCES (MANDATORY):
Every response MUST end with a **📎 Sources & References** section containing 2-5 relevant links. Use real, authoritative sources:
- UP IIEPP 2022 official policy document: https://invest.up.gov.in
- UP Nivesh Mitra portal: https://niveshmitra.up.nic.in
- DPIIT / Make in India: https://www.makeinindia.com
- Ministry of MSME: https://msme.gov.in
- RBI / Economic Survey data: https://rbi.org.in
- State comparison data: https://www.ibef.org
- NITI Aayog reports: https://niti.gov.in
- World Bank Ease of Doing Business: https://www.doingbusiness.org

Format each citation as a numbered markdown link:
1. [Source Title](URL) — brief relevance note
2. [Source Title](URL) — brief relevance note

Also embed inline citations within the answer text using markdown links where specific claims, statistics, or policy clauses are referenced. Example: "The capital subsidy under [Option 1](https://invest.up.gov.in) offers up to 25% of FCI."

STRICT BOUNDARIES:
- You ONLY answer questions related to UP IIEPP 2022, industrial policy, business investment in UP, and closely related economic/legal topics.
- If a user asks about unrelated topics (personal advice, coding, recipes, etc.), politely redirect them to ask about UP industrial policy.
- Never generate harmful, misleading, or speculative financial advice. Always caveat with "consult a qualified professional for legal/financial decisions."`;

const ALLOWED_MODELS = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash-lite",
  "openai/gpt-5",
  "openai/gpt-5-mini",
];

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

// Model mapping for direct API fallbacks
const GEMINI_MODEL_MAP: Record<string, string> = {
  "google/gemini-3-flash-preview": "gemini-2.0-flash",
  "google/gemini-2.5-flash-lite": "gemini-2.0-flash-lite",
};

const OPENAI_MODEL_MAP: Record<string, string> = {
  "openai/gpt-5": "gpt-4o",
  "openai/gpt-5-mini": "gpt-4o-mini",
};

function sanitizeMessages(messages: unknown): { role: string; content: string }[] | null {
  if (!Array.isArray(messages)) return null;
  if (messages.length === 0 || messages.length > MAX_MESSAGES) return null;

  const sanitized: { role: string; content: string }[] = [];
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") return null;
    const { role, content } = msg as Record<string, unknown>;
    if (typeof role !== "string" || typeof content !== "string") return null;
    if (!["user", "assistant"].includes(role)) return null;
    if (content.length === 0 || content.length > MAX_MESSAGE_LENGTH) return null;
    sanitized.push({ role, content: content.trim() });
  }

  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== "user") return null;
  return sanitized;
}

interface ChatPayload {
  messages: { role: string; content: string }[];
  model: string;
}

/** Try Lovable AI Gateway (primary) */
async function tryLovableGateway(payload: ChatPayload, signal: AbortSignal): Promise<Response | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return null;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: payload.model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...payload.messages],
        stream: true,
        max_tokens: 4096,
      }),
      signal,
    });

    if (resp.ok) return resp;

    // Don't fallback on 429/402 — those are user-level limits
    if (resp.status === 429 || resp.status === 402) return resp;

    console.warn("Lovable gateway failed:", resp.status);
    await resp.text(); // consume body
    return null;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    console.warn("Lovable gateway error:", e);
    return null;
  }
}

/** Try Google Gemini API directly (fallback 1) */
async function tryGeminiDirect(payload: ChatPayload, signal: AbortSignal): Promise<Response | null> {
  const GEMINI_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
  if (!GEMINI_KEY) return null;

  const geminiModel = GEMINI_MODEL_MAP[payload.model] || "gemini-2.0-flash";

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GEMINI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: geminiModel,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...payload.messages],
          stream: true,
          max_tokens: 4096,
        }),
        signal,
      }
    );

    if (resp.ok) {
      console.log("Using Gemini direct fallback with model:", geminiModel);
      return resp;
    }
    console.warn("Gemini direct failed:", resp.status);
    await resp.text();
    return null;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    console.warn("Gemini direct error:", e);
    return null;
  }
}

/** Try OpenAI API directly (fallback 2) */
async function tryOpenAIDirect(payload: ChatPayload, signal: AbortSignal): Promise<Response | null> {
  const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_KEY) return null;

  const openaiModel = OPENAI_MODEL_MAP[payload.model] || "gpt-4o-mini";

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openaiModel,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...payload.messages],
        stream: true,
        max_tokens: 4096,
      }),
      signal,
    });

    if (resp.ok) {
      console.log("Using OpenAI direct fallback with model:", openaiModel);
      return resp;
    }
    console.warn("OpenAI direct failed:", resp.status);
    await resp.text();
    return null;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    console.warn("OpenAI direct error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = sanitizeMessages(body.messages);
    if (!messages) {
      return new Response(
        JSON.stringify({ error: "Invalid messages: must be an array of {role, content} objects (max 50 messages, max 4000 chars each)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const model = typeof body.model === "string" ? body.model : "";
    const selectedModel = ALLOWED_MODELS.includes(model) ? model : "google/gemini-3-flash-preview";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const payload: ChatPayload = { messages, model: selectedModel };

      // Try providers in order: Lovable Gateway → Gemini Direct → OpenAI Direct
      let response = await tryLovableGateway(payload, controller.signal);

      // If gateway returned 429/402, pass through immediately
      if (response && !response.ok) {
        clearTimeout(timeout);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Fallback chain
      if (!response || !response.ok) {
        response = await tryGeminiDirect(payload, controller.signal);
      }
      if (!response || !response.ok) {
        response = await tryOpenAIDirect(payload, controller.signal);
      }

      clearTimeout(timeout);

      if (!response || !response.ok) {
        return new Response(
          JSON.stringify({ error: "All AI providers are unavailable. Please try again later." }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({ error: "Request timed out. Please try a shorter question." }),
          { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw fetchError;
    }
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
