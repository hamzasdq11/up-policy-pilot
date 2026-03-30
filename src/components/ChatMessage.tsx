import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

export function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 py-4 px-4 md:px-6", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-gold"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : "bg-surface-chat border border-border rounded-tl-md"
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <div className="whitespace-pre-wrap prose-invert prose-sm max-w-none">
            <FormattedContent content={content} />
          </div>
        )}
      </div>
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, i) => {
        // Table row
        if (line.startsWith("|")) {
          const cells = line.split("|").filter(Boolean).map(c => c.trim());
          if (cells.every(c => /^[-]+$/.test(c))) return null; // separator row
          const isHeader = i > 0 && lines[i + 1]?.includes("---");
          return (
            <div key={i} className={cn("grid gap-2 py-1 text-xs", `grid-cols-${Math.min(cells.length, 4)}`)}>
              {cells.map((cell, j) => (
                <span key={j} className={cn(isHeader && "font-semibold text-gold")}>{cell}</span>
              ))}
            </div>
          );
        }
        // Bold headers
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-semibold text-gold mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
        }
        // Bullet points
        if (line.startsWith("- ")) {
          const text = line.slice(2);
          return (
            <div key={i} className="flex gap-2 py-0.5 pl-1">
              <span className="text-gold mt-1">•</span>
              <span><InlineFormat text={text} /></span>
            </div>
          );
        }
        // Numbered
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)\.\s/)?.[1];
          const text = line.replace(/^\d+\.\s/, "");
          return (
            <div key={i} className="flex gap-2 py-0.5 pl-1">
              <span className="text-gold font-semibold min-w-[1.2rem]">{num}.</span>
              <span><InlineFormat text={text} /></span>
            </div>
          );
        }
        // Empty line
        if (!line.trim()) return <div key={i} className="h-2" />;
        // Regular text
        return <p key={i} className="py-0.5"><InlineFormat text={line} /></p>;
      })}
    </>
  );
}

function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
