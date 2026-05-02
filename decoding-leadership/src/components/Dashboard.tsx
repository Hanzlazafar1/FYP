"use client";

import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { SummaryCard } from "./dashboard/SummaryCard";
import { TopicsSection } from "./dashboard/TopicsSection";
import { WordCloud } from "./dashboard/WordCloud";
import { PromisesSection } from "./dashboard/PromisesSection";
import { SentimentChart } from "./dashboard/SentimentChart";
import { CardSkeleton } from "@/components/ui/Skeleton";
import type { AnalysisResults } from "@/types";

interface Props {
  results: AnalysisResults;
  transcript: string | null;
  loading: boolean;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

export function Dashboard({ results, transcript, loading }: Props) {
  const isLoading = loading;

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 pb-2 border-b border-white/10"
      >
        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Analysis Dashboard</h2>
          <p className="text-xs text-slate-400">
            AI-powered multidimensional political speech insights
          </p>
        </div>
      </motion.div>

      {/* Row 1: Summary + Sentiment */}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard data={results.summary} loading={false} />
            <SentimentChart data={results.sentiment} loading={false} />
          </>
        )}
      </div>

      {/* Row 2: Topics + Word Cloud */}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <TopicsSection data={results.topics} loading={false} />
            <WordCloud
              data={results.keywords}
              transcript={transcript}
              loading={false}
            />
          </>
        )}
      </div>

      {/* Row 3: Promises (full width) */}
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <PromisesSection data={results.promises} loading={false} />
      )}
    </motion.div>
  );
}
