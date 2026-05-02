"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { wordFrequency } from "@/utils/formatters";
import type { KeywordsResult } from "@/types";

interface Props {
  data: KeywordsResult | null;
  transcript: string | null;
  loading: boolean;
}

const PALETTE = [
  "#a855f7","#818cf8","#38bdf8","#34d399","#fb923c",
  "#f472b6","#facc15","#60a5fa","#f87171","#4ade80",
];

interface WordEntry { word: string; count: number }

export function WordCloud({ data, transcript, loading }: Props) {
  const [words, setWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    if (data?.keywords?.length) {
      setWords(data.keywords.slice(0, 50));
    } else if (transcript) {
      setWords(wordFrequency(transcript).slice(0, 50));
    }
  }, [data, transcript]);

  if (loading) return <CardSkeleton />;
  if (!words.length) return null;

  const max = words[0]?.count || 1;

  return (
    <Card glow>
      <SectionHeader
        icon={<Zap className="w-5 h-5" />}
        title="Buzz Words"
        subtitle="Most prominent words extracted from the speech"
        badge={`${words.length} words`}
      />

      {/* Visual word cloud */}
      <div className="flex flex-wrap gap-2 justify-center py-4 min-h-[180px] items-center">
        {words.map((w, i) => {
          const ratio = w.count / max;
          const size = 12 + ratio * 28; // 12px – 40px
          const color = PALETTE[i % PALETTE.length];
          return (
            <motion.span
              key={w.word}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, type: "spring", stiffness: 200 }}
              title={`${w.word}: ${w.count}`}
              className="cursor-default font-semibold hover:scale-110 transition-transform select-none"
              style={{ fontSize: size, color, lineHeight: 1.3 }}
            >
              {w.word}
            </motion.span>
          );
        })}
      </div>

      {/* Top 10 bar chart */}
      <div className="mt-6 space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
          Top 10 by frequency
        </p>
        {words.slice(0, 10).map((w, i) => {
          const pct = Math.round((w.count / max) * 100);
          return (
            <div key={w.word} className="flex items-center gap-3">
              <span
                className="text-xs font-medium w-24 truncate text-right flex-shrink-0"
                style={{ color: PALETTE[i % PALETTE.length] }}
              >
                {w.word}
              </span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: PALETTE[i % PALETTE.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                />
              </div>
              <span className="text-xs text-slate-400 w-6 text-right flex-shrink-0">
                {w.count}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
