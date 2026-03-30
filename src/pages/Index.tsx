import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Menu, BookOpen, RotateCcw, Bot } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { HeroSection } from "@/components/HeroSection";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickActionsGrid } from "@/components/QuickActionsGrid";
import { KnowledgeSidebar } from "@/components/KnowledgeSidebar";
import { FollowUpSuggestions, getFollowUps } from "@/components/FollowUpSuggestions";
import { getResponse, type PolicyResponse } from "@/lib/policyKnowledge";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const welcomeMessage = `Welcome! I'm your **UP IIEPP 2022 Policy Advisor** — your strategic consultant for industrial investment in Uttar Pradesh.

I can help you with:
- **Choosing the best incentive option** for your investment
- **Calculating applicable benefits** (subsidies, SGST, PLI)
- **Comparing UP with other states** (Gujarat, Tamil Nadu, Telangana)
- **Identifying real risks** and how to mitigate them
- **Regional zone analysis** (Bundelkhand, Poorvanchal, Defense Corridor)

Share your **investment amount**, **sector**, and **preferred location** for personalized advice — or tap a quick action below.`;

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
  const [showHero, setShowHero] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const startChat = useCallback(() => {
    setShowHero(false);
    setMessages([{ id: "welcome", role: "assistant", content: welcomeMessage }]);
  }, []);

  const handleSend = useCallback((query: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setShowQuickActions(false);
    setLastQuery(query);

    setTimeout(() => {
      const response = getResponse(query);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatResponse(response),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  }, []);

  const handleReset = useCallback(() => {
    setMessages([{ id: "welcome-" + Date.now(), role: "assistant", content: welcomeMessage }]);
    setShowQuickActions(true);
    setLastQuery("");
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      <AnimatePresence mode="wait">
        {showHero ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <HeroSection onStart={startChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-screen relative z-10"
          >
            {/* Header */}
            <header className="border-b border-border glass px-4 md:px-6 py-3 flex items-center gap-3 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl hover:bg-secondary"
              >
                <Menu className="w-4 h-4" />
              </Button>

              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <h1
                  className="text-base font-bold tracking-tight leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  UP IIEPP 2022 Advisor
                </h1>
                <p className="text-[11px] text-muted-foreground truncate">
                  Industrial Investment & Employment Promotion Policy
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="rounded-xl hover:bg-secondary"
                  title="New conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-border text-xs text-muted-foreground">
                  <Bot className="w-3 h-3 text-gold" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Online
                </div>
              </div>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="max-w-3xl mx-auto py-2">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {isTyping && <ChatMessage role="assistant" content="" isTyping />}

                <QuickActionsGrid onSelect={handleSend} visible={showQuickActions} />

                {/* Follow-up suggestions after last assistant message */}
                {!isTyping && !showQuickActions && lastQuery && (
                  <FollowUpSuggestions
                    suggestions={getFollowUps(lastQuery)}
                    onSelect={handleSend}
                  />
                )}
              </div>
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={isTyping} />

            {/* Sidebar */}
            <KnowledgeSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onTopicSelect={handleSend}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
