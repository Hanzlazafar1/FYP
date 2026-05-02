"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, SectionHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import type { TopicsResult } from "@/types";

interface Props {
  data: TopicsResult | null;
  loading: boolean;
}

const COLORS = [
  "#a855f7","#818cf8","#38bdf8","#34d399","#fb923c",
  "#f472b6","#facc15","#60a5fa","#f87171","#4ade80",
];

export function TopicsSection({ data, loading }: Props) {
  if (loading) return <CardSkeleton />;
  if (!data) return null;

  const chartData = data.topics.map((t) => ({
    name: t.name,
    score: t.score ?? 1,
  }));

  return (
    <Card glow>
      <SectionHeader
        icon={<Tag className="w-5 h-5" />}
        title="Key Topics"
        subtitle="Main themes identified in the speech"
        badge={`${data.topics.length} topics`}
      />

      {/* Tag cloud */}
      <div className="flex flex-wrap gap-2 mb-6">
        {data.topics.map((topic, i) => (
          <motion.span
            key={topic.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{ borderColor: COLORS[i % COLORS.length] + "40" }}
            className="px-3 py-1.5 rounded-full text-sm font-medium border bg-white/5 text-slate-200 hover:bg-white/10 transition-colors cursor-default"
          >
            <span
              style={{ color: COLORS[i % COLORS.length] }}
              className="mr-1.5 font-bold"
            >
              #
            </span>
            {topic.name}
          </motion.span>
        ))}
      </div>

      {/* Bar chart (only when scores present) */}
      {data.topics.some((t) => t.score) && (
        <>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
            Relevance Scores
          </p>
          <ResponsiveContainer width="100%" height={Math.min(data.topics.length * 40, 300)}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 1]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
                formatter={(v: number) => [v.toFixed(2), "Score"]}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={24}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Card>
  );
}
