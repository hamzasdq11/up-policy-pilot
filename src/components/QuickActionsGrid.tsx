import { motion, AnimatePresence } from "framer-motion";
import { quickActions } from "@/lib/policyKnowledge";
import { ChevronRight } from "lucide-react";

interface QuickActionsGridProps {
  onSelect: (query: string) => void;
  visible: boolean;
}

export function QuickActionsGrid({ onSelect, visible }: QuickActionsGridProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="px-4 md:px-6 pb-4"
        >
          <p className="text-xs text-muted-foreground mb-3 ml-12 font-medium uppercase tracking-wider">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl ml-12">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                onClick={() => onSelect(action.query)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl glass hover:shadow-glass-lg transition-all text-left group"
              >
                <span className="text-lg w-8 h-8 flex items-center justify-center rounded-xl bg-tint-light group-hover:scale-110 transition-transform">
                  {action.icon}
                </span>
                <span className="text-sm text-foreground/70 flex-1 font-medium">{action.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-tint group-hover:translate-x-0.5 transition-all" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
