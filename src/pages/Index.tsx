import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Menu, RotateCcw, Bot } from "lucide-react";
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
import iimLogo from "@/assets/iim-ranchi-logo.png";

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

function AcademicHeader() {
  return (
    <div className="w-full bg-background border-b border-border px-4 py-2 shrink-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img src={iimLogo} alt="IIM Ranchi" className="h-10 w-10 object-contain" />
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight">Indian Institute of</p>
            <p className="text-xs font-semibold text-foreground leading-tight">Management Ranchi</p>
          </div>
        </div>

        {/* Center: Course Info */}
        <div className="text-center flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground italic truncate">
            AI Assignment · <span className="font-semibold text-foreground/80">Business Law</span> · Prof. Angshuman Hazarika
          </p>
        </div>

        {/* Right: Student */}
        <div className="text-right shrink-0">
          <p className="text-xs font-bold text-foreground leading-tight">Mohammad Hamza Siddiqui</p>
          <p className="text-[10px] text-muted-foreground font-medium">IPM29-24</p>
        </div>
      </div>
    </div>
  );
}

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
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isStreaming) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmedQuery };
    
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      
      // Build chat history from the updated messages (excluding welcome)
      const chatHistory: ChatMsg[] = updated
        .filter((m) => !m.id.startsWith("welcome"))
        .map((m) => ({ role: m.role, content: m.content }));

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
          toast({ title: "Error", description: error, variant: "destructive" });
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 2).toString(), role: "assistant", content: `⚠️ **Error:** ${error}\n\nPlease try again or select a different model.` },
          ]);
        },
      });

      return updated;
    });

    setIsStreaming(true);
    setShowQuickActions(false);
    setLastQuery(trimmedQuery);
  }, [selectedModel, toast, isStreaming]);

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

      {/* Persistent Academic Header */}
      <AcademicHeader />

      <AnimatePresence mode="wait">
        {showHero ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col overflow-y-auto"
          >
            <HeroSection onStart={startChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col flex-1 relative z-10 min-h-0"
          >
            {/* Header */}
            <header className="bg-background border-b border-border px-4 md:px-6 py-3 flex items-center gap-3 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl hover:bg-secondary"
              >
                <Menu className="w-4 h-4 text-muted-foreground" />
              </Button>

              <div className="w-10 h-10 rounded-2xl bg-foreground flex items-center justify-center">
                <Building2 className="w-5 h-5 text-background" />
              </div>

              <div className="flex-1 min-w-0">
                <h1
                  className="text-base font-bold tracking-tight leading-tight text-foreground"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
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
                  className="rounded-xl hover:bg-secondary"
                  title="New conversation"
                >
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                </Button>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground">
                  <Bot className="w-3 h-3 text-foreground/50" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                  AI Online
                </div>
              </div>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="w-full max-w-none px-2 md:px-[10%] lg:px-[15%] py-2">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                  <ChatMessage role="assistant" content="" isTyping />
                )}
                <QuickActionsGrid onSelect={handleSend} visible={showQuickActions} />
                {!isStreaming && !showQuickActions && lastQuery && (
                  <FollowUpSuggestions suggestions={getFollowUps(lastQuery)} onSelect={handleSend} />
                )}
              </div>
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={isStreaming} selectedModel={selectedModel} onModelChange={setSelectedModel} />

            {/* Sidebar */}
            <KnowledgeSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onTopicSelect={handleSend} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
