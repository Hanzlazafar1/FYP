"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  animate?: boolean;
}

export function Card({ children, className, glow = false, animate = true }: CardProps) {
  const Wrapper = animate ? motion.div : "div";
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" as const },
      }
    : {};

  return (
    <Wrapper
      {...animProps}
      className={clsx(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6",
        glow && "shadow-lg shadow-purple-500/10 border-purple-500/20",
        className
      )}
    >
      {children}
    </Wrapper>
  );
}

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function SectionHeader({ icon, title, subtitle, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
