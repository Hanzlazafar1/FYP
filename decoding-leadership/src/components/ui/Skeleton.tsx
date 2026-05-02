"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface Props {
  className?: string;
}

export function Skeleton({ className }: Props) {
  return (
    <motion.div
      className={clsx(
        "rounded-lg bg-white/5 dark:bg-white/5 relative overflow-hidden",
        className
      )}
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
    </motion.div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}
