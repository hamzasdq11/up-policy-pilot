import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, BookOpen, Scale, MapPin, TrendingUp,
  Factory, Globe2, FileText, X, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeSidebarProps {
  open: boolean;
  onClose: () => void;
  onTopicSelect: (query: string) => void;
}

const policyTopics = [
  {
    category: "Incentive Options",
    icon: TrendingUp,
    items: [
      { label: "Option 1 – Capital Subsidy", query: "Explain Capital Subsidy option under UP IIEPP 2022 in detail" },
      { label: "Option 2 – SGST Reimbursement", query: "Explain SGST reimbursement option under UP IIEPP 2022" },
      { label: "Option 3 – PLI Top-up", query: "Explain PLI top-up option under UP IIEPP 2022" },
    ],
  },
  {
    category: "Investment Categories",
    icon: Factory,
    items: [
      { label: "MSME Benefits", query: "What benefits do MSMEs get under UP IIEPP 2022?" },
      { label: "Large Industries", query: "What incentives are available for large industries investing ₹500+ crore in UP?" },
      { label: "Mega Projects", query: "How to qualify for Mega Project status under UP IIEPP 2022?" },
    ],
  },
  {
    category: "Regional Benefits",
    icon: MapPin,
    items: [
      { label: "Bundelkhand Zone", query: "What special benefits are available for investment in Bundelkhand region?" },
      { label: "Poorvanchal Zone", query: "What incentives are available in Poorvanchal region of UP?" },
      { label: "Defense Corridor", query: "What are the benefits of investing in the UP Defense Corridor?" },
    ],
  },
  {
    category: "Land & Infrastructure",
    icon: Building2,
    items: [
      { label: "Land & Stamp Duty", query: "What land and stamp duty incentives are available under UP IIEPP 2022?" },
      { label: "Industrial Parks", query: "What plug-and-play industrial parks are available in UP?" },
    ],
  },
  {
    category: "Boosters & Add-ons",
    icon: Scale,
    items: [
      { label: "Employment Booster", query: "How does the employment-linked booster work under UP IIEPP 2022?" },
      { label: "Export Booster", query: "What additional benefits do export-oriented units get under the UP policy?" },
      { label: "R&D & Patents", query: "What R&D and patent filing support does UP IIEPP 2022 offer?" },
    ],
  },
  {
    category: "Comparisons",
    icon: Globe2,
    items: [
      { label: "UP vs Gujarat", query: "Compare UP IIEPP 2022 with Gujarat industrial policy for manufacturing" },
      { label: "UP vs Tamil Nadu", query: "Compare UP with Tamil Nadu for industrial investment" },
      { label: "UP vs Telangana", query: "How does UP compare with Telangana TS-iPASS for ease of doing business?" },
    ],
  },
  {
    category: "Risk & Compliance",
    icon: FileText,
    items: [
      { label: "Investment Risks", query: "What are the real risks of investing under UP IIEPP 2022?" },
      { label: "Nivesh Mitra Portal", query: "How to use Nivesh Mitra portal for UP industrial investment?" },
      { label: "Compliance Checklist", query: "What compliance requirements must businesses meet under UP IIEPP 2022?" },
    ],
  },
];

export function KnowledgeSidebar({ open, onClose, onTopicSelect }: KnowledgeSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/5 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col shadow-glass-lg"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-foreground/60" />
                <span className="text-sm font-semibold text-foreground">Policy Knowledge Base</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
              {policyTopics.map((topic) => (
                <div key={topic.category} className="mb-1">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <topic.icon className="w-3.5 h-3.5 text-foreground/50" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {topic.category}
                    </span>
                  </div>
                  {topic.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        onTopicSelect(item.query);
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-6 py-2 text-sm text-foreground/60",
                        "hover:bg-secondary hover:text-foreground transition-colors group text-left"
                      )}
                    >
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-border shrink-0">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Based on the UP Industrial Investment & Employment Promotion Policy 2022.
                For official documents, visit{" "}
                <span className="text-foreground font-medium">invest.up.gov.in</span>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
