import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (query: string) => void;
}

export function FollowUpSuggestions({ suggestions, onSelect }: FollowUpSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="px-4 md:px-6 pb-3 ml-12"
    >
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
        Follow-up questions
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
            onClick={() => onSelect(s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:shadow-glass-lg transition-all group"
          >
            {s}
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

type ResponseKey = 'incentive' | 'msme' | 'comparison' | 'risks' | 'land' | 'export' | 'default';

export const followUpMap: Record<ResponseKey, string[]> = {
  incentive: [
    "Compare with Gujarat incentives",
    "What are the risks?",
    "MSME-specific benefits",
    "Land & stamp duty details",
  ],
  msme: [
    "Best zone for MSMEs?",
    "How to register on Nivesh Mitra?",
    "MSME risks & challenges",
    "Compare with Karnataka MSME policy",
  ],
  comparison: [
    "Deep dive into UP advantages",
    "What are UP's risks?",
    "Best incentive for my sector",
    "Export infrastructure comparison",
  ],
  risks: [
    "How to mitigate these risks?",
    "Compare UP risk vs Gujarat",
    "MSME-specific risks",
    "Land acquisition challenges",
  ],
  land: [
    "Best regions for land subsidy",
    "Industrial park options",
    "Stamp duty for MSMEs",
    "Compare land costs across states",
  ],
  export: [
    "Compare with Gujarat for exports",
    "Jewar airport timeline",
    "SEZ benefits in UP",
    "Best export-linked incentive option",
  ],
  default: [
    "Best incentive for ₹100Cr investment",
    "MSME benefits overview",
    "UP vs other states",
    "Key risks to consider",
  ],
};

export function getFollowUps(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes('incentive') || q.includes('option') || q.includes('invest') || q.includes('crore')) return followUpMap.incentive;
  if (q.includes('msme') || q.includes('small') || q.includes('micro')) return followUpMap.msme;
  if (q.includes('compar') || q.includes('gujarat') || q.includes('tamil') || q.includes('vs')) return followUpMap.comparison;
  if (q.includes('risk') || q.includes('challenge') || q.includes('delay')) return followUpMap.risks;
  if (q.includes('land') || q.includes('stamp') || q.includes('duty')) return followUpMap.land;
  if (q.includes('export') || q.includes('international')) return followUpMap.export;
  return followUpMap.default;
}
