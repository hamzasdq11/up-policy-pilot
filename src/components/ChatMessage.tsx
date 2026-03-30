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
      <span className={cn("mt-0.5 shrink-0", isRisk ? "text-destructive" : "text-tint")}>
        {isRisk ? "▸" : "•"}
      </span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3 rounded-xl glass-subtle border border-border">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-tint-light">{children}</thead>,
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr className="border-b border-border/50 last:border-0">{children}</tr>,
  th: ({ children }: any) => (
    <th className="px-3 py-2.5 text-left font-semibold text-tint text-[11px] uppercase tracking-wider border-b border-border whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-3 py-2 text-foreground/80 border-b border-border/30 align-top">
      {children}
    </td>
  ),
  h3: ({ children }: any) => <h3 className="text-sm font-semibold text-tint mt-2 mb-1">{children}</h3>,
  code: ({ children }: any) => (
    <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono text-tint">{children}</code>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-tint/30 pl-3 my-2 text-muted-foreground italic">{children}</blockquote>
  ),
  a: ({ children, href }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-tint underline underline-offset-2 hover:text-primary transition-colors">
      {children}
    </a>
  ),
});

const simpleMdComponents = {
  strong: ({ children }: any) => <strong className="font-semibold text-tint">{children}</strong>,
  p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }: any) => <ul className="space-y-1 my-2">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-1 my-2 list-decimal list-inside">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex gap-2">
      <span className="text-tint mt-0.5 shrink-0">•</span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3 rounded-xl glass-subtle border border-border">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-tint-light">{children}</thead>,
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr className="border-b border-border/50 last:border-0">{children}</tr>,
  th: ({ children }: any) => (
    <th className="px-3 py-2.5 text-left font-semibold text-tint text-[11px] uppercase tracking-wider border-b border-border whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-3 py-2 text-foreground/80 border-b border-border/30 align-top">
      {children}
    </td>
  ),
  h3: ({ children }: any) => <h3 className="text-sm font-semibold text-tint mt-2 mb-1">{children}</h3>,
  a: ({ children, href }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-tint underline underline-offset-2">
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
          "flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center mt-1",
          isUser ? "gradient-cta shadow-float" : "glass"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-tint" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[88%] md:max-w-[78%]",
          isUser
            ? "gradient-cta text-primary-foreground rounded-2xl rounded-tr-lg px-4 py-3 shadow-glass"
            : ""
        )}
      >
        {isTyping ? (
          <div className="glass rounded-2xl rounded-tl-lg px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-tint rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-tint rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-tint rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
  const sections = content.split(/\n\n(?=\*\*[📋🎯✅⚠️📊])/);

  if (sections.length <= 1) {
    return (
      <div className="glass rounded-2xl rounded-tl-lg px-5 py-4">
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
              "glass rounded-2xl px-4 py-3",
              isRisk ? "!border-destructive/15" :
              isBenefit ? "!border-primary/15" :
              isComparison ? "!border-primary/10" : ""
            )}
          >
            {title && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-lg",
                  isRisk ? "bg-destructive/8 text-destructive" :
                  isBenefit ? "bg-primary/8 text-tint" :
                  isComparison ? "bg-primary/8 text-tint" :
                  "bg-secondary text-tint"
                )}>
                  {icon}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {title.replace(/[📋🎯✅⚠️📊]\s?/g, "")}
                </span>
              </div>
            )}
            <div className="text-sm leading-relaxed text-foreground/80">
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
