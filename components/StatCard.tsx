"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { SocStat } from "@/lib/data";
import { threatFeedSources } from "@/lib/data";
import CountUp from "./CountUp";
import Sparkline from "./charts/Sparkline";

export default function StatCard({ stat }: { stat: SocStat }) {
  const isFeeds = stat.series.length === 0;
  const TrendIcon = stat.trend === "down" ? TrendingDown : TrendingUp;

  return (
    <div className="glass glass-hover flex flex-col rounded-2xl p-4">
      <span className="text-[0.72rem] font-medium text-muted">{stat.label}</span>

      <div className="mt-1.5 flex items-end gap-2">
        <span
          className="font-display text-[1.9rem] font-bold leading-none"
          style={{ color: stat.color }}
        >
          <CountUp to={stat.value} suffix={stat.suffix ?? ""} />
        </span>
        {stat.delta && (
          <span
            className="mb-1 inline-flex items-center gap-0.5 text-[0.72rem] font-semibold text-ok"
          >
            <TrendIcon size={13} />
            {stat.delta}
          </span>
        )}
      </div>

      {isFeeds ? (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-[0.7rem] text-ok">
            <span className="dot" />
            {stat.note}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {threatFeedSources.map((s) => (
              <span
                key={s}
                className="rounded border border-white/8 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[0.6rem] text-dim"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <Sparkline
            data={stat.series}
            width={160}
            height={34}
            color={stat.color}
            className="h-9 w-full"
          />
          <span className="mt-1 block font-mono text-[0.6rem] text-muted">
            vs last 7 days
          </span>
        </div>
      )}
    </div>
  );
}
