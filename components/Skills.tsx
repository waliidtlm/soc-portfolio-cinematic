"use client";

import {
  Activity,
  Crosshair,
  Radar,
  ShieldCheck,
  Siren,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import { skillClusters, type SkillCluster } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import Logo from "./Logo";

const ICONS: Record<string, LucideIcon> = {
  Activity,
  Crosshair,
  Radar,
  ShieldCheck,
  Siren,
  Cloud,
};

// Desktop anchor positions (% of graph container), keyed to cluster order.
const POS: Record<string, { x: number; y: number }> = {
  siem: { x: 17, y: 26 },
  detection: { x: 50, y: 15 },
  intel: { x: 83, y: 26 },
  edr: { x: 16, y: 62 },
  ir: { x: 50, y: 87 },
  cloud: { x: 84, y: 62 },
};

function ClusterBlock({ cluster }: { cluster: SkillCluster }) {
  const Icon = ICONS[cluster.icon] ?? Activity;
  return (
    <div className="w-[190px]">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md border border-cyan/25 bg-cyan/10 text-cyan">
          <Icon size={15} />
        </span>
        <span className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-accent-bright">
          {cluster.title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {cluster.tools.map((t) => (
          <li
            key={t}
            className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5 text-[0.78rem] text-dim transition-colors hover:border-cyan/30 hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan/70" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CentralShield() {
  return (
    <div className="relative grid h-28 w-28 place-items-center">
      <div className="absolute inset-0 animate-pulse rounded-full bg-accent/20 blur-2xl" />
      <div
        className="relative grid h-24 w-24 place-items-center rounded-[1.6rem] border border-cyan/30"
        style={{
          background: "linear-gradient(160deg, rgba(34,211,238,0.14), rgba(37,99,235,0.10))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 50px -10px rgba(34,211,238,0.5)",
        }}
      >
        <Logo size={44} />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeader
        kicker="Skills & Expertise"
        title="Technical Arsenal"
        blurb="Technologies and tools I use to build, detect, and respond."
        link={{ label: "Explore My Stack", href: "#skills" }}
      />

      {/* Desktop network graph */}
      <Reveal className="hidden lg:block">
        <div className="relative mx-auto h-[640px] w-full max-w-5xl">
          {/* connector lines */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wire" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            {skillClusters.map((c) => {
              const p = POS[c.key];
              return (
                <line
                  key={c.key}
                  x1="50"
                  y1="50"
                  x2={p.x}
                  y2={p.y}
                  stroke="url(#wire)"
                  strokeWidth="0.25"
                  strokeDasharray="2 2"
                  style={{ animation: "dash-flow 14s linear infinite" }}
                />
              );
            })}
          </svg>

          {/* nodes */}
          {skillClusters.map((c) => {
            const p = POS[c.key];
            return (
              <div
                key={c.key}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <ClusterBlock cluster={c} />
              </div>
            );
          })}

          {/* central shield */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <CentralShield />
          </div>
        </div>
      </Reveal>

      {/* Mobile / tablet stacked grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
        {skillClusters.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.05} className="glass glass-hover rounded-2xl p-5">
            <ClusterBlock cluster={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
