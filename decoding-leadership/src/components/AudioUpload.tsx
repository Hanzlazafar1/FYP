"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileAudio, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

const MAX_SIZE_MB = 100;
const ACCEPTED = { "audio/mpeg": [".mp3"], "audio/wav": [".wav"], "audio/x-wav": [".wav"] };

interface Props {
  onUpload: (file: File) => void;
  uploading: boolean;
  uploadProgress: number;
  disabled?: boolean;
}

export function AudioUpload({ onUpload, uploading, uploadProgress, disabled }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: { errors: { message: string }[] }[]) => {
      setFileError(null);
      if (rejected.length) {
        const msg = rejected[0]?.errors?.[0]?.message || "Invalid file";
        setFileError(msg);
        return;
      }
      const f = accepted[0];
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`File must be under ${MAX_SIZE_MB} MB`);
        return;
      }
      setFile(f);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    disabled: uploading || disabled,
  });

  const handleSubmit = () => {
    if (file) onUpload(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setFileError(null);
  };

  const fmtSize = (bytes: number) =>
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={clsx(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300",
          isDragActive
            ? "border-purple-400 bg-purple-500/10 scale-[1.01]"
            : file
            ? "border-green-500/50 bg-green-500/5"
            : "border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5",
          (uploading || disabled) && "opacity-60 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="p-3 rounded-full bg-green-500/20">
                <FileAudio className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white truncate max-w-xs mx-auto">
                  {file.name}
                </p>
                <p className="text-sm text-slate-400">{fmtSize(file.size)}</p>
              </div>
              {!uploading && (
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                animate={isDragActive ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
                className="p-4 rounded-full bg-purple-500/20"
              >
                <UploadCloud className="w-10 h-10 text-purple-400" />
              </motion.div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {isDragActive ? "Drop it here!" : "Drag & drop your audio file"}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  MP3 or WAV · Max {MAX_SIZE_MB} MB
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                or click to browse
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {fileError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {fileError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-xs text-slate-400">
              <span>
                {uploadProgress < 100
                  ? "Uploading…"
                  : "Transcribing with Vosk (This can take several minutes for large files)…"}
              </span>
              {uploadProgress < 100 && <span>{uploadProgress}%</span>}
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{
                  width:
                    uploadProgress < 100
                      ? `${uploadProgress}%`
                      : "100%",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {uploadProgress === 100 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-purple-400 flex items-center gap-1.5"
              >
                <span className="w-3 h-3 rounded-full border border-purple-400 border-t-transparent animate-spin" />
                Vosk is processing audio — this may take a moment…
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      {file && !uploading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            icon={<CheckCircle className="w-5 h-5" />}
            disabled={disabled}
          >
            Upload &amp; Transcribe
          </Button>
        </motion.div>
      )}
    </div>
  );
}
