import { cn } from "@/lib/utils";
import { Bot, User, CheckCircle2, AlertTriangle, Target, BarChart3, FileText } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

const sectionIcons: Record<string, React.ReactNode> = {
  "Direct Answer": <FileText className="w-3.5 h-3.5" />,
  "Best Strategy": <Target className="w-3.5 h-3.5" />,
  "Recommendation": <Target className="w-3.5 h-3.5" />,
  "Policy Benefits": <CheckCircle2 className="w-3.5 h-3.5" />,
  "Risks": <AlertTriangle className="w-3.5 h-3.5" />,
  "Practical Challenges": <AlertTriangle className="w-3.5 h-3.5" />,
  "Comparative Insight": <BarChart3 className="w-3.5 h-3.5" />,
};

function getSectionIcon(title: string) {
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (title.includes(key)) return icon;
  }
  return <FileText className="w-3.5 h-3.5" />;
}

const mdComponents = (isRisk: boolean) => ({
  strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
  p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }: any) => <ul className="space-y-1 my-1">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-1 my-1 list-decimal list-inside">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex gap-2">
      <span className={cn("mt-0.5 shrink-0", isRisk ? "text-destructive" : "text-gold")}>
        {isRisk ? "▸" : "•"}
      </span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-border">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-secondary/80">{children}</thead>,
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr className="border-b border-border/40 last:border-0">{children}</tr>,
  th: ({ children }: any) => (
    <th className="px-3 py-2.5 text-left font-semibold text-gold text-[11px] uppercase tracking-wider border-b border-border whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-3 py-2 text-secondary-foreground border-b border-border/30 align-top">
      {children}
    </td>
  ),
  h1: ({ children }: any) => <h1 className="text-base font-bold text-foreground mt-2 mb-1">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-sm font-bold text-foreground mt-2 mb-1">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-sm font-semibold text-gold mt-2 mb-1">{children}</h3>,
  code: ({ children }: any) => (
    <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono text-gold">{children}</code>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-gold/40 pl-3 my-2 text-muted-foreground italic">{children}</blockquote>
  ),
  hr: () => <hr className="border-border/50 my-3" />,
  a: ({ children, href }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2 hover:text-gold-light transition-colors">
      {children}
    </a>
  ),
});

const simpleMdComponents = {
  strong: ({ children }: any) => <strong className="font-semibold text-gold">{children}</strong>,
  p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }: any) => <ul className="space-y-1 my-2">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-1 my-2 list-decimal list-inside">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex gap-2">
      <span className="text-gold mt-0.5 shrink-0">•</span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-border">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-secondary/80">{children}</thead>,
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr className="border-b border-border/40 last:border-0">{children}</tr>,
  th: ({ children }: any) => (
    <th className="px-3 py-2.5 text-left font-semibold text-gold text-[11px] uppercase tracking-wider border-b border-border whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-3 py-2 text-secondary-foreground border-b border-border/30 align-top">
      {children}
    </td>
  ),
  h3: ({ children }: any) => <h3 className="text-sm font-semibold text-gold mt-2 mb-1">{children}</h3>,
  a: ({ children, href }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2">
      {children}
    </a>
  ),
};

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
    // Simple message (like welcome, greetings, or streaming partial)
    return (
      <div className="glass rounded-2xl rounded-tl-md border border-border px-5 py-4">
        <div className="text-sm leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={simpleMdComponents}>
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
        const isRisk = title.includes("Risk") || title.includes("⚠️") || title.includes("Challenge");
        const isBenefit = title.includes("Benefit") || title.includes("✅");
        const isComparison = title.includes("Comparative") || title.includes("📊");

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className={cn(
              "glass rounded-xl border px-4 py-3",
              isRisk ? "border-destructive/20" :
              isBenefit ? "border-primary/20" :
              isComparison ? "border-gold/15" :
              "border-border"
            )}
          >
            {title && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-md",
                  isRisk ? "bg-destructive/10 text-destructive" :
                  isBenefit ? "bg-primary/10 text-gold" :
                  isComparison ? "bg-primary/10 text-gold" :
                  "bg-secondary text-gold"
                )}>
                  {icon}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {title.replace(/[📋🎯✅⚠️📊]\s?/g, "")}
                </span>
              </div>
            )}
            <div className="text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents(isRisk)}>
                {sectionContent}
              </ReactMarkdown>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
