import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Menu, RotateCcw, Bot, AlertCircle } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { HeroSection } from "@/components/HeroSection";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickActionsGrid } from "@/components/QuickActionsGrid";
import { KnowledgeSidebar } from "@/components/KnowledgeSidebar";
import { FollowUpSuggestions, getFollowUps } from "@/components/FollowUpSuggestions";
import { streamChat, type ChatMsg } from "@/lib/aiService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const welcomeMessage = `Welcome! I'm your **UP IIEPP 2022 Policy Advisor** — powered by AI to give you strategic, personalized industrial investment guidance for Uttar Pradesh.

I can help you with:
- **Choosing the best incentive option** for your investment
- **Calculating applicable benefits** (subsidies, SGST, PLI)
- **Comparing UP with other states** (Gujarat, Tamil Nadu, Telangana)
- **Identifying real risks** and how to mitigate them
- **Regional zone analysis** (Bundelkhand, Poorvanchal, Defense Corridor)

Share your **investment amount**, **sector**, and **preferred location** for personalized advice — or tap a quick action below.`;

export default function Index() {
  const [showHero, setShowHero] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("google/gemini-3-flash-preview");
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  const startChat = useCallback(() => {
    setShowHero(false);
    setMessages([{ id: "welcome", role: "assistant", content: welcomeMessage }]);
  }, []);

  const handleSend = useCallback((query: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setShowQuickActions(false);
    setLastQuery(query);

    // Build conversation history for context (exclude welcome message)
    const chatHistory: ChatMsg[] = [];
    setMessages((prev) => {
      prev.forEach((m) => {
        if (m.id === "welcome" || m.id.startsWith("welcome-")) return;
        chatHistory.push({ role: m.role, content: m.content });
      });
      chatHistory.push({ role: "user", content: query });
      return [...prev]; // no change, just reading
    });

    // If chatHistory is empty (first message), just add the user msg
    if (chatHistory.length === 0) {
      chatHistory.push({ role: "user", content: query });
    }

    const assistantId = (Date.now() + 1).toString();
    let assistantContent = "";

    abortRef.current = new AbortController();

    streamChat({
      messages: chatHistory,
      model: selectedModel,
      signal: abortRef.current.signal,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.id === assistantId) {
            return prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { id: assistantId, role: "assistant", content: assistantContent }];
        });
      },
      onDone: () => {
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (error) => {
        setIsStreaming(false);
        abortRef.current = null;
        toast({
          title: "AI Error",
          description: error,
          variant: "destructive",
        });
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: `⚠️ **Error:** ${error}\n\nPlease try again or select a different model.`,
          },
        ]);
      },
    });
  }, [selectedModel, toast]);

  const handleReset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([{ id: "welcome-" + Date.now(), role: "assistant", content: welcomeMessage }]);
    setShowQuickActions(true);
    setLastQuery("");
    setIsStreaming(false);
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
            <header className="glass border-b-0 px-4 md:px-6 py-3 flex items-center gap-3 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl hover:bg-secondary/60"
              >
                <Menu className="w-4 h-4 text-muted-foreground" />
              </Button>

              <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center shadow-float">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <h1
                  className="text-base font-bold tracking-tight leading-tight text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  UP IIEPP 2022 Advisor
                </h1>
                <p className="text-[11px] text-muted-foreground truncate">
                  AI-Powered Industrial Policy Advisory
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="rounded-xl hover:bg-secondary/60"
                  title="New conversation"
                >
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                </Button>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground">
                  <Bot className="w-3 h-3 text-tint" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  AI Online
                </div>
              </div>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="max-w-3xl mx-auto py-2">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                  <ChatMessage role="assistant" content="" isTyping />
                )}

                <QuickActionsGrid onSelect={handleSend} visible={showQuickActions} />

                {!isStreaming && !showQuickActions && lastQuery && (
                  <FollowUpSuggestions
                    suggestions={getFollowUps(lastQuery)}
                    onSelect={handleSend}
                  />
                )}
              </div>
            </div>

            {/* Input */}
            <ChatInput
              onSend={handleSend}
              disabled={isStreaming}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

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
