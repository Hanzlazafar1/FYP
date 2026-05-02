"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { AudioUpload } from "@/components/AudioUpload";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { Dashboard } from "@/components/Dashboard";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { PipelineStepper, StepLabel } from "@/components/PipelineStepper";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSpeechAnalysis } from "@/hooks/useSpeechAnalysis";
import { exportDashboardPDF } from "@/utils/pdfExport";

export default function Home() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const {
    step,
    uploadProgress,
    transcript,
    results,
    error,
    handleUpload,
    handleAnalyse,
    reset,
  } = useSpeechAnalysis();

  const handleDownload = useCallback(async () => {
    await exportDashboardPDF("dashboard-root", "speech-analysis-report");
  }, []);

  const isUploading   = step === "uploading" || step === "transcribing";
  const isAnalysing   = step === "analyzing";
  const showTranscript = ["transcript_ready", "analyzing", "done"].includes(step);
  const showDashboard  = step === "done" || isAnalysing;

  return (
    <>
      <Header
        onHistoryClick={() => setHistoryOpen(true)}
        onDownload={handleDownload}
        showDownload={step === "done"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-20">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {step === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Powered by Vosk + Fine-tuned LLMs
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Decode{" "}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                  Leadership
                </span>
              </motion.h1>

              <motion.p
                className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Upload any political speech audio. Our pipeline transcribes it
                with <strong className="text-slate-200">Vosk</strong>, then
                unleashes fine-tuned LLMs to reveal sentiments, topics, promises,
                and key insights — all in one dashboard.
              </motion.p>

              {/* Feature pills */}
              <motion.div
                className="flex flex-wrap justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  "🎙️ Vosk Transcription",
                  "📊 Sentiment Analysis",
                  "🏷️ Topic Detection",
                  "💬 Keyword Cloud",
                  "✅ Promise Tracker",
                  "📄 PDF Export",
                ].map((feat) => (
                  <span
                    key={feat}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
                  >
                    {feat}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pipeline Stepper ──────────────────────────────────────────── */}
        {step !== "idle" && step !== "error" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-3"
          >
            <PipelineStepper step={step} />
            <StepLabel step={step} />
          </motion.div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {step === "error" && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <ErrorDisplay error={error} onRetry={reset} />
          </motion.div>
        )}

        {/* ── Upload Card ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {(step === "idle" || step === "uploading" || step === "transcribing" || step === "error") && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 glow-pulse">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <h2 className="text-white font-bold text-lg">Upload Speech Audio</h2>
                </div>
                <AudioUpload
                  onUpload={handleUpload}
                  uploading={isUploading}
                  uploadProgress={uploadProgress}
                  disabled={step === "transcribing"}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Transcribing spinner (full-page loader while Vosk runs) ───── */}
        <AnimatePresence>
          {step === "transcribing" && (
            <motion.div
              key="vosk-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center my-6"
            >
              <LoadingSpinner
                size={48}
                label="Vosk is converting audio to text. This may take a moment for longer files…"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Transcript Viewer ─────────────────────────────────────────── */}
        <AnimatePresence>
          {showTranscript && transcript && (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto mb-10"
            >
              <TranscriptViewer
                transcript={transcript}
                onAnalyse={handleAnalyse}
                analysing={isAnalysing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Analysis loader ───────────────────────────────────────────── */}
        <AnimatePresence>
          {isAnalysing && (
            <motion.div
              key="analysis-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 my-8"
            >
              <LoadingSpinner
                size={56}
                label="Running all 5 LLM models in parallel: summarize · topics · keywords · promises · sentiment…"
              />
              {/* skeleton cards while waiting */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {["Summary", "Sentiment", "Topics", "Keywords", "Promises", ""].map((lbl, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="h-40 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 relative overflow-hidden"
                  >
                    {lbl && (
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3">
                        {lbl}
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="h-3 rounded-full bg-white/10 w-3/4" />
                      <div className="h-3 rounded-full bg-white/10 w-full" />
                      <div className="h-3 rounded-full bg-white/10 w-5/6" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dashboard ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {step === "done" && (
            <motion.div
              key="dashboard"
              id="dashboard-root"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Dashboard
                results={results}
                transcript={transcript}
                loading={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── History Drawer ────────────────────────────────────────────────── */}
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </>
  );
}
