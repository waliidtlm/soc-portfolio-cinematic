"use client";

import { topThreatTypes } from "@/lib/data";

export default function TopThreatTypesWidget() {
  return (
    <div className="glass float-y w-[230px] rounded-2xl p-4" style={{ animationDelay: "0.7s" }}>
      <span className="font-mono text-[0.6rem] font-medium tracking-[0.22em] text-muted">
        TOP THREAT TYPES
      </span>
      <ul className="mt-3 space-y-2.5">
        {topThreatTypes.map((t) => (
          <li key={t.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[0.78rem] text-dim">{t.label}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.round(t.weight * 100)}%`,
                  background: "linear-gradient(90deg, var(--color-accent), var(--color-cyan))",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
