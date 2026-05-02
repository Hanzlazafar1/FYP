"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import type { PipelineStep } from "@/types";

const STEPS: { id: PipelineStep; label: string; desc: string }[] = [
  { id: "uploading",        label: "Upload",      desc: "Sending audio to server" },
  { id: "transcribing",     label: "Transcribe",  desc: "Vosk speech recognition" },
  { id: "transcript_ready", label: "Review",      desc: "Inspect transcript" },
  { id: "analyzing",        label: "Analyse",     desc: "LLM multidimensional analysis" },
  { id: "done",             label: "Results",     desc: "Dashboard ready" },
];

const ORDER: PipelineStep[] = [
  "idle", "uploading", "transcribing", "transcript_ready", "analyzing", "done",
];

function stepIndex(step: PipelineStep) {
  return ORDER.indexOf(step);
}

interface Props { step: PipelineStep }

export function PipelineStepper({ step }: Props) {
  const current = stepIndex(step);

  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const sIdx = stepIndex(s.id);
        const done    = current > sIdx;
        const active  = current === sIdx;
        const pending = current < sIdx;

        return (
          <div key={s.id} className="flex items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <motion.div
                animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  done    && "border-purple-500 bg-purple-500",
                  active  && "border-purple-400 bg-purple-500/20",
                  pending && "border-white/20 bg-white/5"
                )}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : active ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <Circle className="w-3 h-3 text-slate-500" />
                )}
              </motion.div>

              <div className="text-center hidden sm:block">
                <p className={clsx(
                  "text-xs font-semibold leading-tight",
                  done || active ? "text-white" : "text-slate-500"
                )}>
                  {s.label}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight max-w-[72px] truncate">
                  {s.desc}
                </p>
              </div>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 rounded-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: done ? "100%" : active ? "50%" : "0%" }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Animated step transition label ──────────────────────────────────────────
const LABELS: Partial<Record<PipelineStep, string>> = {
  uploading:        "📤  Uploading audio…",
  transcribing:     "🎙️  Transcribing speech using Vosk…",
  transcript_ready: "✅  Transcript ready — review below",
  analyzing:        "🧠  Analyzing speech with AI models…",
  done:             "🎉  Analysis complete!",
  error:            "❌  Something went wrong",
};

export function StepLabel({ step }: Props) {
  const label = LABELS[step];
  if (!label) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={step}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.3 }}
        className="text-sm font-medium text-slate-300 text-center"
      >
        {label}
      </motion.p>
    </AnimatePresence>
  );
}
