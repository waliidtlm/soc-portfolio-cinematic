import { ArrowUpRight, Activity, Radar, Workflow, Crosshair } from "lucide-react";
import type { Project } from "@/lib/data";

const CATEGORY: Record<
  Project["category"],
  { from: string; to: string; icon: typeof Activity }
> = {
  siem: { from: "#a855f7", to: "#ec4899", icon: Activity },
  intel: { from: "#14b8a6", to: "#22d3ee", icon: Radar },
  automation: { from: "#3b82f6", to: "#6366f1", icon: Workflow },
  detection: { from: "#0ea5e9", to: "#22d3ee", icon: Crosshair },
};

export default function ProjectCard({ project }: { project: Project }) {
  const cat = CATEGORY[project.category];
  const Icon = cat.icon;

  return (
    <article className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-2xl">
      {/* Thumbnail (background-image avoids broken-image icon when asset is missing) */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* fallback mock dashboard */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 100% at 50% 0%, ${cat.from}33, transparent 60%), linear-gradient(160deg, #0c1426, #070b16)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,160,230,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,160,230,0.06)_1px,transparent_1px)] bg-[length:26px_26px]" />
        <Icon
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
          size={86}
          style={{ color: cat.to }}
        />
        {/* real screenshot (shows when file exists) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${project.image}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,11,22,0.85),transparent_55%)]" />

        {/* category badge */}
        <span
          className="absolute left-3 top-3 rounded-md px-2.5 py-1 font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-white shadow-lg"
          style={{ background: `linear-gradient(110deg, ${cat.from}, ${cat.to})` }}
        >
          {project.badge}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug text-white">
            {project.title}
          </h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-muted transition-colors group-hover:text-cyan"
          />
        </div>

        <p className="mt-2 text-[0.86rem] leading-relaxed text-dim">{project.problem}</p>

        <p className="mt-3 text-[0.82rem] text-muted">
          <span className="font-semibold text-cyan">Impact: </span>
          {project.impact}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.tech.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
