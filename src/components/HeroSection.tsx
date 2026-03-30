import { motion, useScroll, useTransform } from "framer-motion";
import { Building2, ArrowRight, TrendingUp, MapPin, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center z-10 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: bgY }}
      >
        <img
          src={heroBg}
          alt=""
          className="w-full h-[130%] object-cover"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </motion.div>
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-tint tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI-POWERED POLICY ADVISORY
        </span>
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-20 h-20 rounded-3xl gradient-cta flex items-center justify-center shadow-float mb-8"
      >
        <Building2 className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-[1.1]"
      >
        <span className="text-foreground">UP IIEPP</span>{" "}
        <span className="text-gradient-hero">2022</span>
        <br />
        <span className="text-foreground text-3xl md:text-4xl lg:text-5xl">Policy Advisor</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
      >
        Your strategic consultant for industrial investment in Uttar Pradesh.
        Get personalized incentive analysis, risk assessment, and state comparisons.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="h-14 px-8 text-base font-semibold rounded-2xl gradient-cta shadow-float hover:shadow-glass-lg transition-all duration-300 group text-primary-foreground"
        >
          Start Advisory Session
          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
            className="glass rounded-2xl p-4 hover:shadow-glass-lg transition-all group"
          >
            <stat.icon className="w-4 h-4 text-tint mb-2 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Academic Credit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-16 mb-8 glass rounded-2xl px-6 py-5 max-w-lg w-full text-center space-y-1"
      >
        <p className="text-[11px] text-muted-foreground/70 italic leading-relaxed">
          Engineered in partial fulfilment of the requirements for the AI Assignment under the course <span className="font-semibold text-foreground/70">Business Law</span>
        </p>
        <p className="text-xs font-semibold text-foreground/80 tracking-wide">Indian Institute of Management Ranchi</p>
        <p className="text-[11px] text-muted-foreground/70">Faculty: <span className="font-medium text-foreground/70">Prof. Angshuman Hazarika</span></p>
        <div className="pt-2 border-t border-border/40 mt-2">
          <p className="text-xs font-bold text-foreground/85 tracking-tight">Mohammad Hamza Siddiqui</p>
          <p className="text-[10px] text-muted-foreground/60 font-medium">IPM29-24</p>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
