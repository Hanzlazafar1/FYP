"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Trash2, ArrowRight } from "lucide-react";
import { useSpeechStore } from "@/store/speechStore";
import { formatDate } from "@/utils/formatters";
import type { SpeechRecord } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function HistoryPanel({ open, onClose }: Props) {
  const { history, deleteFromHistory, loadFromHistory } = useSpeechStore();

  const handleLoad = (record: SpeechRecord) => {
    loadFromHistory(record);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-bold text-lg">Speech History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <div className="p-4 rounded-full bg-white/5">
                    <Clock className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400">No speeches analysed yet</p>
                  <p className="text-xs text-slate-500">
                    Upload and analyse a speech to see it here
                  </p>
                </div>
              ) : (
                history.map((record, i) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {record.fileName}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(record.uploadedAt)}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                          {record.transcript.slice(0, 120)}…
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleLoad(record)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-colors"
                      >
                        Load <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteFromHistory(record.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
