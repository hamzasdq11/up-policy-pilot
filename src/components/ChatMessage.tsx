import { cn } from "@/lib/utils";
import { Bot, User, CheckCircle2, AlertTriangle, Target, BarChart3, FileText } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

const sectionIcons: Record<string, React.ReactNode> = {
  "📋 Direct Answer": <FileText className="w-3.5 h-3.5" />,
  "🎯 Best Strategy / Recommendation": <Target className="w-3.5 h-3.5" />,
  "✅ Policy Benefits Applicable": <CheckCircle2 className="w-3.5 h-3.5" />,
  "⚠️ Risks / Practical Challenges": <AlertTriangle className="w-3.5 h-3.5" />,
  "📊 Comparative Insight": <BarChart3 className="w-3.5 h-3.5" />,
};

function getSectionIcon(title: string) {
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (title.includes(key.replace(/^.+\s/, ""))) return icon;
  }
  return null;
}

export function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("flex gap-3 py-3 px-4 md:px-6", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-1 ring-1 ring-border",
          isUser ? "gradient-gold shadow-gold" : "glass border border-border"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-gold" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[88%] md:max-w-[78%]",
          isUser
            ? "gradient-gold text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 shadow-gold"
            : ""
        )}
      >
        {isTyping ? (
          <div className="glass rounded-2xl rounded-tl-md border border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-muted-foreground ml-2">Analyzing policy...</span>
            </div>
          </div>
        ) : isUser ? (
          <p className="text-sm leading-relaxed font-medium">{content}</p>
        ) : (
          <AssistantContent content={content} />
        )}
      </div>
    </motion.div>
  );
}

function AssistantContent({ content }: { content: string }) {
  // Split into sections based on bold headers with emoji
  const sections = content.split(/\n\n(?=\*\*[📋🎯✅⚠️📊])/);

  if (sections.length <= 1) {
    // Simple message (like welcome)
    return (
      <div className="glass rounded-2xl rounded-tl-md border border-border px-5 py-4">
        <div className="text-sm leading-relaxed prose-custom">
          <ReactMarkdown
            components={{
              strong: ({ children }) => <strong className="font-semibold text-gold">{children}</strong>,
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="space-y-1 my-2">{children}</ul>,
              li: ({ children }) => (
                <li className="flex gap-2">
                  <span className="text-gold mt-0.5 shrink-0">•</span>
                  <span>{children}</span>
                </li>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sections.map((section, i) => {
        const headerMatch = section.match(/^\*\*(.+?)\*\*/);
        const title = headerMatch?.[1] || "";
        const sectionContent = headerMatch
          ? section.replace(/^\*\*(.+?)\*\*\n?/, "")
          : section;

        const icon = getSectionIcon(title);
        const isRisk = title.includes("Risk") || title.includes("⚠️");
        const isBenefit = title.includes("Benefit") || title.includes("✅");

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className={cn(
              "glass rounded-xl border px-4 py-3",
              isRisk ? "border-destructive/20" : isBenefit ? "border-primary/20" : "border-border"
            )}
          >
            {title && (
              <div className={cn(
                "flex items-center gap-2 mb-2 pb-2 border-b border-border/50",
              )}>
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-md",
                  isRisk ? "bg-destructive/10 text-destructive" : isBenefit ? "bg-primary/10 text-gold" : "bg-secondary text-gold"
                )}>
                  {icon || <FileText className="w-3.5 h-3.5" />}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {title.replace(/[📋🎯✅⚠️📊]\s?/g, "")}
                </span>
              </div>
            )}
            <div className="text-sm leading-relaxed">
              <ReactMarkdown
                components={{
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="space-y-1 my-1">{children}</ul>,
                  li: ({ children }) => (
                    <li className="flex gap-2">
                      <span className={cn("mt-0.5 shrink-0", isRisk ? "text-destructive" : "text-gold")}>
                        {isRisk ? "▸" : "•"}
                      </span>
                      <span>{children}</span>
                    </li>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2 rounded-lg border border-border">
                      <table className="w-full text-xs">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-secondary">{children}</thead>,
                  th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-gold border-b border-border">{children}</th>,
                  td: ({ children }) => <td className="px-3 py-2 border-b border-border/50">{children}</td>,
                }}
              >
                {sectionContent}
              </ReactMarkdown>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
