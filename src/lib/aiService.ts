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
    label: "Gemini 3.1 Flash",
    provider: "Google",
    description: "Fast & capable — best for most queries",
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
 * Local responses for trivial queries — saves API calls.
 */
function tryLocalResponse(query: string): string | null {
  const q = query.toLowerCase().trim();

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

  return null;
}

/**
 * Auto-selects the best model based on query complexity.
 */
function autoSelectModel(query: string): string {
  const q = query.toLowerCase();
  const len = query.length;

  const needsDeepReasoning =
    (q.includes("compar") && (q.includes("gujarat") || q.includes("tamil") || q.includes("telangana") || q.includes("karnataka"))) ||
    (q.includes("vs") && q.includes("state")) ||
    q.includes("detailed analysis") ||
    q.includes("calculate") ||
    q.includes("roi") ||
    q.includes("payback") ||
    (q.includes("₹") && /\d{3,}/.test(q)) ||
    len > 300;

  if (needsDeepReasoning) return "google/gemini-2.5-pro";

  const isModerate =
    q.includes("incentive") || q.includes("subsidy") || q.includes("sgst") ||
    q.includes("pli") || q.includes("mega project") || q.includes("defense corridor") ||
    q.includes("bundelkhand") || q.includes("poorvanchal") || len > 150;

  if (isModerate) return "google/gemini-3-flash-preview";

  return "google/gemini-2.5-flash";
}

export type ChatMsg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1500;

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url, options);
      // Don't retry client errors (4xx) except 429
      if (resp.ok || (resp.status >= 400 && resp.status < 500 && resp.status !== 429)) {
        return resp;
      }
      // Retry on 429 and 5xx
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
        continue;
      }
      return resp;
    } catch (e: any) {
      if (e.name === "AbortError") throw e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
        continue;
      }
      throw e;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function streamChat({
  messages,
  model: _userModel,
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
  // Validate input
  if (!messages || messages.length === 0) {
    onError("No messages to send.");
    return;
  }

  const lastUserMsg = messages[messages.length - 1];
  if (!lastUserMsg || lastUserMsg.role !== "user" || !lastUserMsg.content.trim()) {
    onError("Please enter a message.");
    return;
  }

  // Trim overly long messages client-side
  const sanitizedMessages = messages.map((m) => ({
    role: m.role,
    content: m.content.slice(0, 4000),
  }));

  // Keep conversation context manageable (last 40 messages)
  const trimmedMessages = sanitizedMessages.slice(-40);

  // Try local response first
  const localAnswer = tryLocalResponse(lastUserMsg.content);
  if (localAnswer) {
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
    if (signal?.aborted) { onDone(); return; }
    onDelta(localAnswer);
    onDone();
    return;
  }

  const bestModel = autoSelectModel(lastUserMsg.content);

  try {
    const resp = await fetchWithRetry(
      CHAT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: trimmedMessages, model: bestModel }),
        signal,
      }
    );

    if (!resp.ok) {
      let errorMsg = "Something went wrong. Please try again.";
      try {
        const errorData = await resp.json();
        errorMsg = errorData.error || errorMsg;
      } catch { /* use default */ }

      if (resp.status === 429) {
        errorMsg = "Too many requests. Please wait a moment and try again.";
      } else if (resp.status === 402) {
        errorMsg = "AI service credits exhausted. Please try again later.";
      } else if (resp.status === 504) {
        errorMsg = "Request timed out. Try asking a shorter question.";
      }

      onError(errorMsg);
      return;
    }

    if (!resp.body) {
      onError("No response received from AI. Please try again.");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let receivedAnyContent = false;

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
          if (content) {
            receivedAnyContent = true;
            onDelta(content);
          }
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
          if (content) {
            receivedAnyContent = true;
            onDelta(content);
          }
        } catch { /* ignore partial leftovers */ }
      }
    }

    // If stream completed but no content was received, that's an error
    if (!receivedAnyContent) {
      onError("AI returned an empty response. Please try rephrasing your question.");
      return;
    }

    onDone();
  } catch (e: any) {
    if (e.name === "AbortError") {
      onDone();
      return;
    }
    // Network errors
    if (!navigator.onLine) {
      onError("You appear to be offline. Please check your internet connection.");
    } else {
      onError("Connection failed. Please check your internet and try again.");
    }
  }
}
