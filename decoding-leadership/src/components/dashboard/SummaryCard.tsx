"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import type { SummaryResult } from "@/types";

interface Props {
  data: SummaryResult | null;
  loading: boolean;
}

export function SummaryCard({ data, loading }: Props) {
  const [expanded, setExpanded] = useState(true);

  if (loading) return <CardSkeleton />;
  if (!data) return null;

  const isLong = data.summary.length > 400;
  const preview = data.summary.slice(0, 400);

  return (
    <Card glow>
      <SectionHeader
        icon={<BookOpen className="w-5 h-5" />}
        title="Speech Summary"
        subtitle="AI-generated concise overview"
      />

      <AnimatePresence initial={false}>
        <motion.div
          key={expanded ? "expanded" : "collapsed"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="text-slate-300 text-sm leading-relaxed"
        >
          {expanded || !isLong ? data.summary : preview + "…"}
        </motion.div>
      </AnimatePresence>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
        >
          {expanded ? (
            <><ChevronUp className="w-3 h-3" /> Collapse</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> Read more</>
          )}
        </button>
      )}
    </Card>
  );
}
