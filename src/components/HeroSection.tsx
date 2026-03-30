import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, MapPin, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStart: () => void;
}

const stats = [
  { label: "Policy Period", value: "2022–2027", icon: Shield },
  { label: "Max Capital Subsidy", value: "25% FCI", icon: TrendingUp },
  { label: "SGST Reimbursement", value: "Up to 100%", icon: Zap },
  { label: "Priority Zones", value: "Bundelkhand+", icon: MapPin },
];

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <div className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10 overflow-y-auto min-h-0 flex-1">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 sm:mb-6"
      >
        <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-[10px] sm:text-xs font-medium text-foreground/60 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
          AI-POWERED POLICY ADVISORY
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 sm:mb-3 leading-[1.1] text-center text-foreground"
      >
        UP IIEPP 2022
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12 }}
        className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground/70 mb-3 sm:mb-4 text-center"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Policy Advisor
      </motion.p>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mb-6 sm:mb-8 leading-relaxed text-center px-2"
      >
        Your strategic consultant for industrial investment in Uttar Pradesh.
        Get personalized incentive analysis, risk assessment, and state comparisons.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90 shadow-float transition-all duration-300 group"
        >
          Start Advisory Session
          <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-2xl w-full"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            className="rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 hover:shadow-glass-lg transition-all group text-center"
          >
            <stat.icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-foreground/50 mb-1.5 sm:mb-2 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-sm sm:text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Course Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 sm:mt-12 max-w-2xl w-full rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6"
      >
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Business Law & Industrial Policy
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          This AI-powered advisory tool explores the <strong className="text-foreground">Uttar Pradesh Industrial Investment and Employment Promotion Policy (IIEPP) 2022</strong> — a landmark framework designed to attract ₹10 lakh crore in investment and generate 40 lakh jobs. Built as part of the <strong className="text-foreground">Business Law</strong> curriculum, it demonstrates how legal and regulatory frameworks shape industrial strategy, investor incentives, and economic development at the state level.
        </p>
      </motion.div>
    </div>
  );
}
