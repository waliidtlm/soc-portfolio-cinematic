"use client";

import { liveFeed } from "@/lib/data";

function Radar() {
  return (
    <svg viewBox="0 0 100 100" className="h-[72px] w-[72px] shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="radarSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <g stroke="rgba(122,167,255,0.30)" strokeWidth="0.8" fill="none">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="31" />
        <circle cx="50" cy="50" r="16" />
        <line x1="50" y1="4" x2="50" y2="96" />
        <line x1="4" y1="50" x2="96" y2="50" />
      </g>
      {/* rotating sweep wedge (SMIL — rotates exactly about center) */}
      <path d="M50 50 L50 4 A46 46 0 0 1 91 67 Z" fill="url(#radarSweep)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="3.8s"
          repeatCount="indefinite"
        />
      </path>
      <circle cx="68" cy="34" r="2.4" fill="#22d3ee" />
      <circle cx="38" cy="64" r="1.8" fill="#7aa7ff" />
    </svg>
  );
}

export default function LiveFeedWidget() {
  return (
    <div className="glass float-y w-[290px] rounded-2xl p-4" style={{ animationDelay: "0.1s" }}>
      <div className="mb-3 flex items-center gap-2">
        <span className="dot" />
        <span className="font-mono text-[0.62rem] font-semibold tracking-[0.22em] text-dim">
          LIVE FEED
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <ul className="space-y-2">
          {liveFeed.map((f) => (
            <li key={f.label} className="flex items-baseline gap-2.5">
              <span className="w-14 font-mono text-sm font-semibold text-cyan">{f.value}</span>
              <span className="text-[0.72rem] text-muted">{f.label}</span>
            </li>
          ))}
        </ul>
        <Radar />
      </div>
    </div>
  );
}
