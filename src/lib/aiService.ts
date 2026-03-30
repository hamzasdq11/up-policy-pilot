import { supabase } from "@/integrations/supabase/client";
import { getResponse, type PolicyResponse } from "@/lib/policyKnowledge";

export interface AIModel {
  id: string;
  label: string;
  provider: string;
  description: string;
}

export const availableModels: AIModel[] = [
  {
    id: "google/gemini-3-flash-preview",
    label: "Gemini 3 Flash",
    provider: "Google",
    description: "Fast & capable — best for most queries",
  },
  {
    id: "google/gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Balanced speed & quality",
  },
  {
    id: "google/gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Top-tier reasoning & analysis",
  },
  {
    id: "openai/gpt-5",
    label: "GPT-5",
    provider: "OpenAI",
    description: "Powerful all-rounder, excellent reasoning",
  },
  {
    id: "openai/gpt-5-mini",
    label: "GPT-5 Mini",
    provider: "OpenAI",
    description: "Strong performance, lower cost",
  },
];

/**
 * Determines if a query needs the LLM or can be answered locally.
 * Returns local response if possible, null if LLM is needed.
 */
function tryLocalResponse(query: string): string | null {
  const q = query.toLowerCase().trim();

  // Greetings / trivial — don't waste an LLM call
  const trivialPatterns = [
    /^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening))[\s!.?]*$/,
    /^(thanks|thank\s*you|ok|okay|got\s*it|understood|sure|great|cool)[\s!.?]*$/,
    /^(who\s*are\s*you|what\s*(can|do)\s*you\s*do)[\s!?.]*$/,
  ];

  for (const p of trivialPatterns) {
    if (p.test(q)) {
      if (/^(hi|hello|hey|namaste|good)/.test(q)) {
        return "Hello! I'm your **UP IIEPP 2022 Policy Advisor**. Share your **investment amount**, **sector**, and **preferred location** in UP, and I'll recommend the best incentive option with a detailed analysis.\n\nOr ask me anything about the policy — incentives, risks, comparisons, land benefits, MSME support, and more.";
      }
      if (/^(thanks|thank)/.test(q)) {
        return "You're welcome! Feel free to ask more about UP IIEPP 2022 — whether it's about incentives, risks, regional benefits, or state comparisons. I'm here to help you make the best investment decision.";
      }
      if (/^(who|what)/.test(q)) {
        return "I'm an **AI-powered policy advisor** specializing in the **UP Industrial Investment & Employment Promotion Policy 2022**.\n\nI can help you:\n- Choose the best incentive option for your investment\n- Calculate applicable benefits\n- Compare UP with other states\n- Identify risks and mitigation strategies\n- Analyze regional zone benefits\n\nJust share your investment details and I'll get to work!";
      }
      return "Got it! Let me know if you have any other questions about UP IIEPP 2022.";
    }
  }

  return null; // needs LLM
}

/**
 * Auto-selects the best model based on query complexity.
 * The user's selected model in the UI is ignored — this runs silently.
 */
function autoSelectModel(query: string): string {
  const q = query.toLowerCase();
  const len = query.length;

  // Complex: comparisons, multi-state, detailed analysis, large investments
  const needsDeepReasoning =
    (q.includes("compar") && (q.includes("gujarat") || q.includes("tamil") || q.includes("telangana") || q.includes("karnataka"))) ||
    (q.includes("vs") && q.includes("state")) ||
    q.includes("detailed analysis") ||
    q.includes("calculate") ||
    q.includes("roi") ||
    q.includes("payback") ||
    (q.includes("₹") && /\d{3,}/.test(q)) ||
    len > 300;

  if (needsDeepReasoning) {
    return "google/gemini-2.5-pro";
  }

  // Standard: specific policy questions, sector analysis, moderate complexity
  const isModerate =
    q.includes("incentive") ||
    q.includes("subsidy") ||
    q.includes("sgst") ||
    q.includes("pli") ||
    q.includes("mega project") ||
    q.includes("defense corridor") ||
    q.includes("bundelkhand") ||
    q.includes("poorvanchal") ||
    len > 150;

  if (isModerate) {
    return "google/gemini-3-flash-preview";
  }

  // Simple/short queries — use the fastest model
  return "google/gemini-2.5-flash";
}

export type ChatMsg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export async function streamChat({
  messages,
  model: _userModel, // ignored — auto-selected internally
  onDelta,
  onDone,
  onError,
  signal,
}: {
  messages: ChatMsg[];
  model: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
}) {
  // Check if latest user message can be answered locally
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg?.role === "user") {
    const localAnswer = tryLocalResponse(lastUserMsg.content);
    if (localAnswer) {
      // Simulate brief "thinking" then deliver locally
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
      onDelta(localAnswer);
      onDone();
      return;
    }
  }

  // Auto-select best model for this query
  const bestModel = autoSelectModel(lastUserMsg?.content || "");

  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, model: bestModel }),
      signal,
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(errorData.error || `Error ${resp.status}`);
      return;
    }

    if (!resp.body) {
      onError("No response stream");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e: any) {
    if (e.name === "AbortError") {
      onDone();
      return;
    }
    onError(e.message || "Connection failed");
  }
}
