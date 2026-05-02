"use client";

import { motion } from "framer-motion";

interface Props {
  size?: number;
  label?: string;
}

export function LoadingSpinner({ size = 40, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        style={{ width: size, height: size }}
        className="rounded-full border-2 border-purple-500/30 border-t-purple-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
      {label && (
        <motion.p
          className="text-sm text-slate-400 font-medium text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
