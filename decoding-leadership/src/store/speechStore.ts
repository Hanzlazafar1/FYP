import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PipelineStep,
  AnalysisResults,
  SpeechRecord,
  AppError,
} from "@/types";

interface SpeechState {
  // ── Pipeline ──────────────────────────────────────────────────────────────
  step: PipelineStep;
  uploadProgress: number;
  speechId: string | null;
  transcript: string | null;
  results: AnalysisResults;
  error: AppError | null;

  // ── History ───────────────────────────────────────────────────────────────
  history: SpeechRecord[];

  // ── Theme ─────────────────────────────────────────────────────────────────
  theme: "dark" | "light";

  // ── Actions ───────────────────────────────────────────────────────────────
  setStep: (step: PipelineStep) => void;
  setUploadProgress: (pct: number) => void;
  setTranscript: (id: string, text: string) => void;
  setResults: (results: AnalysisResults) => void;
  setError: (error: AppError | null) => void;
  toggleTheme: () => void;
  reset: () => void;
  saveToHistory: (fileName: string) => void;
  deleteFromHistory: (id: string) => void;
  loadFromHistory: (record: SpeechRecord) => void;
}

const emptyResults: AnalysisResults = {
  summary: null,
  topics: null,
  keywords: null,
  promises: null,
  sentiment: null,
};

export const useSpeechStore = create<SpeechState>()(
  persist(
    (set, get) => ({
      step: "idle",
      uploadProgress: 0,
      speechId: null,
      transcript: null,
      results: emptyResults,
      error: null,
      history: [],
      theme: "dark",

      setStep: (step) => set({ step, error: null }),

      setUploadProgress: (pct) => set({ uploadProgress: pct }),

      setTranscript: (id, text) =>
        set({ speechId: id, transcript: text, step: "transcript_ready" }),

      setResults: (results) => set({ results, step: "done" }),

      setError: (error) => set({ error, step: "error" }),

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      reset: () =>
        set({
          step: "idle",
          uploadProgress: 0,
          speechId: null,
          transcript: null,
          results: emptyResults,
          error: null,
        }),

      saveToHistory: (fileName) => {
        const { speechId, transcript, results } = get();
        if (!speechId || !transcript) return;
        const record: SpeechRecord = {
          id: speechId,
          fileName,
          uploadedAt: new Date().toISOString(),
          transcript,
          results,
        };
        set((s) => ({
          history: [record, ...s.history].slice(0, 20), // keep last 20
        }));
      },

      deleteFromHistory: (id) =>
        set((s) => ({ history: s.history.filter((r) => r.id !== id) })),

      loadFromHistory: (record) =>
        set({
          speechId: record.id,
          transcript: record.transcript,
          results: record.results,
          step: "done",
          error: null,
        }),
    }),
    {
      name: "decoding-leadership-store",
      partialize: (s) => ({ history: s.history, theme: s.theme }),
    }
  )
);
