// ─── Upload & Transcription ─────────────────────────────────────────────────

export interface UploadResponse {
  speech_id: string;
  transcript: string;
}

// ─── Analysis Results ────────────────────────────────────────────────────────

export interface SummaryResult {
  summary: string;
}

export interface Topic {
  name: string;
  score?: number;
}

export interface TopicsResult {
  topics: Topic[];
}

export interface Keyword {
  word: string;
  count: number;
}

export interface KeywordsResult {
  keywords: Keyword[];
}

export interface Promise {
  text: string;
  category?: string;
  status?: "fulfilled" | "pending" | "broken";
}

export interface Achievement {
  text: string;
  category?: string;
}

export interface PromisesResult {
  promises: Promise[];
  achievements: Achievement[];
}

export interface SentimentSegment {
  label: "Positive" | "Neutral" | "Negative";
  score: number;
  text?: string;
  index?: number;
}

export interface SentimentResult {
  overall: "Positive" | "Neutral" | "Negative";
  score: number;
  segments: SentimentSegment[];
}

// ─── Pipeline State ──────────────────────────────────────────────────────────

export type PipelineStep =
  | "idle"
  | "uploading"
  | "transcribing"
  | "transcript_ready"
  | "analyzing"
  | "done"
  | "error";

export interface AnalysisResults {
  summary: SummaryResult | null;
  topics: TopicsResult | null;
  keywords: KeywordsResult | null;
  promises: PromisesResult | null;
  sentiment: SentimentResult | null;
}

export interface SpeechRecord {
  id: string;
  fileName: string;
  uploadedAt: string;
  transcript: string;
  results: AnalysisResults;
}

export interface AppError {
  message: string;
  step?: PipelineStep;
}
