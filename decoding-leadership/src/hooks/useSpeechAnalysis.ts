import { useCallback, useRef } from "react";
import { useSpeechStore } from "@/store/speechStore";
import { uploadAudio, runAllAnalyses } from "@/services/api";

export function useSpeechAnalysis() {
  const {
    step,
    uploadProgress,
    transcript,
    results,
    error,
    setStep,
    setUploadProgress,
    setTranscript,
    setResults,
    setError,
    saveToHistory,
    reset,
  } = useSpeechStore();

  const fileNameRef = useRef<string>("");

  // ── STEP 1: Upload → Vosk transcription ──────────────────────────────────
  const handleUpload = useCallback(
    async (file: File) => {
      try {
        fileNameRef.current = file.name;
        reset();
        setStep("uploading");

        const { speech_id, transcript: text } = await uploadAudio(
          file,
          (pct) => {
            setUploadProgress(pct);
            if (pct === 100) setStep("transcribing");
          }
        );

        setTranscript(speech_id, text);
      } catch (err) {
        setError({
          message: (err as Error).message,
          step: "uploading",
        });
      }
    },
    [reset, setStep, setUploadProgress, setTranscript, setError]
  );

  // ── STEP 2: LLM analyses (only after transcript exists) ──────────────────
  const handleAnalyse = useCallback(async () => {
    if (!transcript) return;
    try {
      setStep("analyzing");
      const analysisResults = await runAllAnalyses(transcript);
      setResults(analysisResults);
      saveToHistory(fileNameRef.current);
    } catch (err) {
      setError({
        message: (err as Error).message,
        step: "analyzing",
      });
    }
  }, [transcript, setStep, setResults, setError, saveToHistory]);

  return {
    step,
    uploadProgress,
    transcript,
    results,
    error,
    handleUpload,
    handleAnalyse,
    reset,
  };
}
