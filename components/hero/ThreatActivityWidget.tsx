"use client";

import { threatActivity } from "@/lib/data";
import Sparkline from "@/components/charts/Sparkline";

export default function ThreatActivityWidget() {
  return (
    <div className="glass float-y w-[210px] rounded-2xl p-4" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.6rem] font-medium tracking-[0.22em] text-muted">
          THREAT ACTIVITY
        </span>
        <span className="dot" />
      </div>
      <div className="mt-2 flex items-end justify-between">
        <span className="font-display text-2xl font-bold text-ok">{threatActivity.level}</span>
        <Sparkline
          data={threatActivity.series}
          width={92}
          height={30}
          color="var(--color-ok)"
          className="opacity-90"
        />
      </div>
    </div>
  );
}
