import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Cpu, Check } from "lucide-react";
import { availableModels } from "@/lib/aiService";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const current = availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  return (
    <div className="relative z-[70]">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-xs hover:shadow-glass-lg transition-all"
      >
        <Cpu className="w-3 h-3 text-foreground/50" />
        <span className="text-foreground/70 font-medium">{current.label}</span>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-label="Close model menu"
              className="fixed inset-0 z-[60] cursor-default"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-2 w-72 bg-card border border-border rounded-2xl z-[70] py-1 overflow-hidden shadow-glass-lg"
            >
              <p className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border/50">
                Select AI Model
              </p>
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelect(model.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-secondary/60 transition-colors",
                    model.id === selectedModel && "bg-secondary"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{model.label}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{model.description}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{model.provider}</p>
                  </div>
                  {model.id === selectedModel && (
                    <Check className="w-4 h-4 text-foreground mt-0.5 shrink-0" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
