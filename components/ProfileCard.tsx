"use client";

import Image from "next/image";
import { profile } from "@/lib/data";

// Instagram-style identity card shown beside the Manifesto.
// Placeholder content for now — swap stats/handle/bio later.
const STATS = [
  { value: "5+", label: "Years" },
  { value: "25+", label: "Detections" },
  { value: "10+", label: "Certs" },
] as const;

export default function ProfileCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]">
      {/* Avatar with gradient ring */}
      <div className="flex items-center gap-5">
        <div className="rounded-full bg-gradient-to-tr from-cyan via-cyan/60 to-fuchsia-500 p-[3px]">
          <div className="rounded-full bg-black p-[3px]">
            <Image
              src="/Avatar.png"
              alt={profile.name}
              width={84}
              height={84}
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Stats row — Instagram-style */}
        <div className="flex flex-1 justify-around">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-lg font-bold text-white">{s.value}</div>
              <div className="text-[0.7rem] uppercase tracking-wide text-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Identity */}
      <div className="mt-5">
        <p className="font-display text-lg font-bold text-white">{profile.name}</p>
        <p className="font-mono text-xs text-cyan">@waliidtlm</p>
        <p className="mt-2 text-sm leading-relaxed text-dim">
          {profile.role} · {profile.location}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["Threat Hunting", "Detection", "Automation"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.72rem] text-text"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
