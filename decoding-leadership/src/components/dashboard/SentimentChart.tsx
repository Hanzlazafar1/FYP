"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, SectionHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { sentimentColor, sentimentBg } from "@/utils/formatters";
import { clsx } from "clsx";
import type { SentimentResult } from "@/types";

interface Props {
  data: SentimentResult | null;
  loading: boolean;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: { label: string } }[] }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const label = payload[0].payload.label;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="font-semibold text-white">{label}</p>
      <p style={{ color: sentimentColor(label) }}>
        Score: {(val * 100).toFixed(0)}%
      </p>
    </div>
  );
};

export function SentimentChart({ data, loading }: Props) {
  if (loading) return <CardSkeleton />;
  if (!data) return null;

  const chartData = data.segments.map((seg, i) => ({
    index: seg.index ?? i + 1,
    score: seg.score,
    label: seg.label,
    text: seg.text?.slice(0, 60) + "…",
  }));

  const pct = (data.score * 100).toFixed(0);
  const color = sentimentColor(data.overall);

  return (
    <Card glow>
      <SectionHeader
        icon={<TrendingUp className="w-5 h-5" />}
        title="Sentiment Analysis"
        subtitle="Emotional tone across the speech"
      />

      {/* Overall badge */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-semibold",
            sentimentBg(data.overall)
          )}
        >
          <span className="text-lg">
            {data.overall === "Positive" ? "😊" : data.overall === "Negative" ? "😟" : "😐"}
          </span>
          Overall: {data.overall}
        </div>

        {/* Score ring */}
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ffffff10" strokeWidth="3.5" />
            <motion.circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${data.score * 100} 100`}
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${data.score * 100} 100` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Area chart */}
      {chartData.length > 1 && (
        <>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
            Emotional trend over speech
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="index" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 1]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0.5} stroke="#ffffff15" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="score"
                stroke={color}
                strokeWidth={2.5}
                fill="url(#sentGrad)"
                dot={{ fill: color, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Segment breakdown */}
      {data.segments.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          {(["Positive", "Neutral", "Negative"] as const).map((lbl) => {
            const cnt = data.segments.filter((s) => s.label === lbl).length;
            const pct = data.segments.length
              ? Math.round((cnt / data.segments.length) * 100)
              : 0;
            return (
              <div
                key={lbl}
                className={clsx(
                  "rounded-xl border p-3 text-center",
                  sentimentBg(lbl)
                )}
              >
                <p className="text-xl font-bold">{pct}%</p>
                <p className="text-xs mt-0.5">{lbl}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
