import axios from "axios";
import type {
  UploadResponse,
  SummaryResult,
  TopicsResult,
  KeywordsResult,
  PromisesResult,
  SentimentResult,
  AnalysisResults,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  // Removed timeout: Vosk transcription on CPU can take a long time for large files
});

// ─── Request interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  return config;
});

// ─── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Unknown error occurred";
    return Promise.reject(new Error(message));
  }
);

// ─── Upload & Transcription ──────────────────────────────────────────────────

export async function uploadAudio(
  file: File,
  onUploadProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<UploadResponse>("/upload-audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (evt.total && onUploadProgress) {
        onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });

  return data;
}

// ─── Individual Analysis Calls ───────────────────────────────────────────────

export async function fetchSummary(text: string): Promise<SummaryResult> {
  const { data } = await api.post<SummaryResult>("/summarize", { text });
  return data;
}

export async function fetchTopics(text: string): Promise<TopicsResult> {
  const { data } = await api.post<TopicsResult>("/topics", { text });
  return data;
}

export async function fetchKeywords(text: string): Promise<KeywordsResult> {
  const { data } = await api.post<KeywordsResult>("/keywords", { text });
  return data;
}

export async function fetchPromises(text: string): Promise<PromisesResult> {
  const { data } = await api.post<PromisesResult>("/promises", { text });
  return data;
}

export async function fetchSentiment(text: string): Promise<SentimentResult> {
  const { data } = await api.post<SentimentResult>("/sentiment", { text });
  return data;
}

// ─── Parallel Analysis Orchestrator ─────────────────────────────────────────

export async function runAllAnalyses(text: string): Promise<AnalysisResults> {
  const [summary, topics, keywords, promises, sentiment] = await Promise.all([
    fetchSummary(text),
    fetchTopics(text),
    fetchKeywords(text),
    fetchPromises(text),
    fetchSentiment(text),
  ]);

  return { summary, topics, keywords, promises, sentiment };
}
