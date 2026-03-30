import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, MapPin, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpeg";

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
    <div className="relative flex flex-col items-center px-4 pt-8 pb-16 z-10 overflow-y-auto min-h-0 flex-1">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground/60 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
          AI-POWERED POLICY ADVISORY
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 leading-[1.1] text-center text-foreground"
      >
        UP IIEPP 2022
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-2xl md:text-3xl font-bold text-foreground/70 mb-4 text-center"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Policy Advisor
      </motion.p>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed text-center"
      >
        Your strategic consultant for industrial investment in Uttar Pradesh.
        Get personalized incentive analysis, risk assessment, and state comparisons.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="h-14 px-8 text-base font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90 shadow-float transition-all duration-300 group"
        >
          Start Advisory Session
          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-4 hover:shadow-glass-lg transition-all group text-center"
          >
            <stat.icon className="w-4 h-4 text-foreground/50 mb-2 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Course & Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="mt-14 max-w-3xl w-full rounded-3xl overflow-hidden border border-border bg-card"
      >
        <div className="w-full aspect-video bg-muted/30">
          <img
            src={heroBg}
            alt="Industrial landscape of Uttar Pradesh"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Business Law & Industrial Policy
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            This AI-powered advisory tool explores the <strong className="text-foreground">Uttar Pradesh Industrial Investment and Employment Promotion Policy (IIEPP) 2022</strong> — a landmark framework designed to attract ₹10 lakh crore in investment and generate 40 lakh jobs. Built as part of the <strong className="text-foreground">Business Law</strong> curriculum, it demonstrates how legal and regulatory frameworks shape industrial strategy, investor incentives, and economic development at the state level.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
