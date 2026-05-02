"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, Award, GitCompare } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { clsx } from "clsx";
import type { PromisesResult, Promise as PromiseType, Achievement } from "@/types";

interface Props {
  data: PromisesResult | null;
  loading: boolean;
}

const statusConfig = {
  fulfilled: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    label: "Fulfilled",
  },
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    label: "Pending",
  },
  broken: {
    icon: <XCircle className="w-4 h-4" />,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    label: "Broken",
  },
};

function PromiseItem({ item, index }: { item: PromiseType; index: number }) {
  const status = item.status ?? "pending";
  const cfg = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={clsx(
        "flex items-start gap-3 rounded-xl border p-3",
        cfg.bg
      )}
    >
      <span className={clsx("mt-0.5 flex-shrink-0", cfg.color)}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 leading-relaxed">{item.text}</p>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {item.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
              {item.category}
            </span>
          )}
          <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", cfg.color, "bg-white/5")}>
            {cfg.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AchievementItem({ item, index }: { item: Achievement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3"
    >
      <Award className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 leading-relaxed">{item.text}</p>
        {item.category && (
          <span className="text-xs px-2 py-0.5 mt-1.5 inline-block rounded-full bg-white/10 text-slate-400">
            {item.category}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function PromisesSection({ data, loading }: Props) {
  if (loading) return <CardSkeleton />;
  if (!data) return null;

  return (
    <Card glow>
      <SectionHeader
        icon={<GitCompare className="w-5 h-5" />}
        title="Promises vs Achievements"
        subtitle="Political commitments identified and classified"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Promises */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2">
              Promises ({data.promises.length})
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="space-y-2">
            {data.promises.length ? (
              data.promises.map((p, i) => (
                <PromiseItem key={i} item={p} index={i} />
              ))
            ) : (
              <p className="text-sm text-slate-500 italic text-center py-6">
                No promises detected
              </p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2">
              Achievements ({data.achievements.length})
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="space-y-2">
            {data.achievements.length ? (
              data.achievements.map((a, i) => (
                <AchievementItem key={i} item={a} index={i} />
              ))
            ) : (
              <p className="text-sm text-slate-500 italic text-center py-6">
                No achievements detected
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
