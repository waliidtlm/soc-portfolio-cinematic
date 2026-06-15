"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Activity, Radar, Workflow, Crosshair } from "lucide-react";
import type { Project } from "@/lib/data";

const CATEGORY: Record<
  Project["category"],
  { from: string; to: string; icon: typeof Activity; label: string }
> = {
  siem: { from: "#a855f7", to: "#ec4899", icon: Activity, label: "SIEM Engineering" },
  intel: { from: "#14b8a6", to: "#22d3ee", icon: Radar, label: "Threat Intelligence" },
  automation: { from: "#3b82f6", to: "#6366f1", icon: Workflow, label: "Automation" },
  detection: { from: "#0ea5e9", to: "#22d3ee", icon: Crosshair, label: "Detection Engineering" },
};

const springConfig = { damping: 15, stiffness: 150 };

export default function ProjectCard({ project }: { project: Project }) {
  const cat = CATEGORY[project.category];
  const Icon = cat.icon;
  const href = project.href ?? "#";

  // --- 3D tilt ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], ["13deg", "-13deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-13deg", "13deg"]);

  // Halo shadow shifts opposite to tilt (simulates a fixed light source above).
  // Lives on a sibling element that's bigger than the card so the bloom
  // visibly extends beyond the card edges.
  const haloShadow = useTransform(
    [springX, springY],
    ([x, y]: number[]) => {
      const ox = -x * 28;
      const oy = y * 28 + 24;
      return [
        `${ox}px ${oy}px 48px 6px rgba(20,50,130,0.65)`,
        `${ox * 0.4}px ${oy * 0.4}px 24px 3px rgba(70,110,220,0.45)`,
      ].join(", ");
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    // Perspective must live on the PARENT of the tilting element, not on it.
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-[26rem] w-full [perspective:1100px]"
    >
      {/* Halo: bigger than the card (-inset-4) so the shadow bloom
          extends visibly past the card edges. Tilts with the card so
          the shadow shifts correctly as the card rotates. */}
      <motion.div
        aria-hidden
        style={{ rotateX, rotateY, boxShadow: haloShadow }}
        className="pointer-events-none absolute -inset-4 rounded-3xl"
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass relative h-full w-full overflow-hidden rounded-2xl [backface-visibility:hidden]"
      >
        {/* Background: fallback mock dashboard + real screenshot */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 100% at 50% 0%, ${cat.from}33, transparent 60%), linear-gradient(160deg, #0c1426, #070b16)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,160,230,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,160,230,0.06)_1px,transparent_1px)] bg-[length:26px_26px]" />
        <Icon
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
          size={110}
          style={{ color: cat.to }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${project.image}')` }}
        />
        {/* Contrast gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        {/* Category badge (top-left) */}
        <span
          style={{ transform: "translateZ(45px)" }}
          className="absolute left-4 top-4 rounded-md px-2.5 py-1 font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-white shadow-lg"
        >
          <span
            className="absolute inset-0 rounded-md"
            style={{ background: `linear-gradient(110deg, ${cat.from}, ${cat.to})` }}
          />
          <span className="relative">{project.badge}</span>
        </span>

        {/* Corner link (top-right) */}
        <motion.a
          href={href}
          target={href === "#" ? undefined : "_blank"}
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, rotate: "3deg" }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Open ${project.title}`}
          style={{ transform: "translateZ(55px)" }}
          className="glass-solid absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:border-white/30"
        >
          <ArrowUpRight size={18} />
        </motion.a>

        {/* Title + subtitle (front) */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 group-hover:opacity-0"
        >
          <h3 className="font-display text-xl font-semibold leading-snug text-white">
            {project.title}
          </h3>
          <p className="mt-0.5 text-sm font-light text-white/70">{cat.label}</p>
        </div>

        {/* Hover overlay (reveal) — also shown on touch / no-hover devices.
            Depth (translateZ) and the slide (translateY) live on separate
            elements so they don't both fight for the `transform` property. */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="absolute inset-x-0 bottom-0"
        >
        <div
          className="glass-solid translate-y-full rounded-t-2xl p-5 transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:translate-y-0"
        >
          <h3 className="font-display text-lg font-semibold leading-snug text-white">
            {project.title}
          </h3>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-dim">{project.problem}</p>
          <p className="mt-2.5 text-[0.82rem] text-muted">
            <span className="font-semibold text-cyan">Impact: </span>
            {project.impact}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <motion.a
            href={href}
            target={href === "#" ? undefined : "_blank"}
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2.5 text-center text-sm font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
          >
            View project
            <ArrowUpRight size={16} />
          </motion.a>
        </div>
        </div>
      </motion.div>
    </div>
  );
}
