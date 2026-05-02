"use client";

import { motion } from "framer-motion";
import { Sun, Moon, History, RotateCcw, Download } from "lucide-react";
import { useSpeechStore } from "@/store/speechStore";
import { Button } from "@/components/ui/Button";

interface Props {
  onHistoryClick: () => void;
  onDownload: () => void;
  showDownload: boolean;
}

export function Header({ onHistoryClick, onDownload, showDownload }: Props) {
  const { theme, toggleTheme, reset, step } = useSpeechStore();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-950" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-base leading-tight truncate">
              Decoding Leadership
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              LLM-based Political Speech Analysis
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showDownload && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={onDownload}
            >
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          )}

          <button
            onClick={onHistoryClick}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Speech history"
          >
            <History className="w-5 h-5" />
          </button>

          {step !== "idle" && (
            <button
              onClick={reset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
              title="Start over"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
