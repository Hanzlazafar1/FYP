"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AppError } from "@/types";

interface Props {
  error: AppError;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center space-y-4"
    >
      <div className="inline-flex p-4 rounded-full bg-red-500/20">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-red-300 mb-1">
          {error.step === "uploading"
            ? "Upload / Transcription Failed"
            : error.step === "analyzing"
            ? "Analysis Failed"
            : "Something went wrong"}
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">{error.message}</p>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button
          variant="secondary"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}
