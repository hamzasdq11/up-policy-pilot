import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/ModelSelector";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ChatInput({ onSend, disabled, selectedModel, onModelChange }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-t border-border glass p-3 md:p-4"
    >
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask about incentives, risks, comparisons, land policy..."
            className="w-full resize-none bg-secondary/80 border border-border rounded-xl px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all scrollbar-thin"
            rows={1}
            disabled={disabled}
          />
          <Sparkles className="absolute right-3 top-3.5 w-4 h-4 text-gold-dim" />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          size="icon"
          className="rounded-xl h-11 w-11 shrink-0 gradient-gold shadow-gold hover:shadow-gold-lg transition-all disabled:opacity-30"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between max-w-3xl mx-auto mt-2">
        <ModelSelector selectedModel={selectedModel} onSelect={onModelChange} />
        <p className="text-[10px] text-muted-foreground opacity-60">
          AI-powered • Not legal advice
        </p>
      </div>
    </motion.div>
  );
}
