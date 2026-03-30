import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { getResponse, quickActions, type PolicyResponse } from "@/lib/policyKnowledge";
import { Building2, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const welcomeMessage = `Welcome! I'm your **UP IIEPP 2022 Policy Advisor** — think of me as your strategy consultant for industrial investment in Uttar Pradesh.

I can help you with:
- **Choosing the best incentive option** for your investment
- **Calculating applicable benefits** (subsidies, SGST, PLI)
- **Comparing UP with other states** (Gujarat, Tamil Nadu, Telangana)
- **Identifying real risks** and how to mitigate them

To give you the most relevant advice, share your **investment amount**, **sector**, and **preferred location** in UP.

Or tap a quick action below to get started 👇`;

function formatResponse(r: PolicyResponse): string {
  let text = `**📋 Direct Answer**\n${r.directAnswer}\n\n`;
  text += `**🎯 Best Strategy / Recommendation**\n${r.strategy}\n\n`;
  text += `**✅ Policy Benefits Applicable**\n`;
  r.benefits.forEach((b) => { text += `- ${b}\n`; });
  text += `\n**⚠️ Risks / Practical Challenges**\n`;
  r.risks.forEach((ri) => { text += `- ${ri}\n`; });
  if (r.comparison) {
    text += `\n**📊 Comparative Insight**\n${r.comparison}`;
  }
  return text;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: welcomeMessage },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback((query: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setShowQuickActions(false);

    setTimeout(() => {
      const response = getResponse(query);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatResponse(response),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 md:px-6 py-3 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-gold">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            UP IIEPP 2022 Advisor
          </h1>
          <p className="text-xs text-muted-foreground truncate">
            Industrial Investment & Employment Promotion Policy
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Online
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {isTyping && <ChatMessage role="assistant" content="" isTyping />}

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="px-4 md:px-6 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl ml-12">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.query)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary border border-border hover:border-primary/40 hover:bg-secondary/80 transition-all text-left group"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-sm text-secondary-foreground flex-1">{action.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-gold transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
