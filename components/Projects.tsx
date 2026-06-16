"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/data";

const SERVICES: Record<Project["category"], string> = {
  siem:       "SIEM / Detection / Engineering",
  intel:      "Intel / Analysis / Automation",
  automation: "Scripting / Automation / DevSecOps",
  detection:  "Detection / ATT&CK / Engineering",
};

const YEAR: Record<Project["category"], string> = {
  siem:       "2024",
  intel:      "2024",
  automation: "2025",
  detection:  "2025",
};

export default function Projects() {
  return (
    <section id="projects" className="relative z-10">

      {/* ── Selected work ── */}
      <div className="pb-32 pt-24 sm:pt-28">

        {/* Section title (contained) */}
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mb-2 flex items-end justify-between gap-4 border-b border-white/12 pb-6">
            <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-medium lowercase tracking-tight text-white">
              <span className="text-cyan">/</span> selected work
            </h2>
            <span className="hidden sm:block font-mono text-xs tracking-[0.25em] text-muted uppercase">
              {projects.length.toString().padStart(2, "0")} projects
            </span>
          </div>
        </div>

        {/* Full-bleed rows */}
        <div>
          {projects.map((p, i) => (
            <ProjectRow key={p.title} p={p} i={i} />
          ))}
        </div>

        {/* Discover more (contained) */}
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mt-14 flex justify-start">
            <a href="#" className="group flex items-center gap-2 font-mono text-sm text-muted hover:text-white transition-colors duration-300">
              discover more
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Single project row ── */
function ProjectRow({ p, i }: { p: Project; i: number }) {
  const [hovered, setHovered] = useState(false);
  const href = p.href ?? "#";
  const n = String(i + 1).padStart(2, "0");

  return (
    <motion.a
      href={href}
      target={href === "#" ? undefined : "_blank"}
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.06 }}
      className="group relative block w-full overflow-hidden border-b border-white/12 h-[clamp(8rem,16vw,16rem)]"
    >
      {/* Layer 1 — full-width image (revealed on hover) + dark filter */}
      <div className="pointer-events-none absolute inset-0 scale-110 opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${p.image}')` }}
        />
        {/* the filter — keeps the title legible over the image */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-linear-to-r from-bg/70 via-transparent to-bg/30" />
      </div>

      {/* Layer 2 — number + (title / paragraph) ... year */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center justify-between px-[5vw] sm:px-[4vw]">
        {/* Left — slides right on hover */}
        <div className="flex items-center gap-[3vw] min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-[1.2vw]">
          <div className="flex shrink-0 font-mono font-bold leading-none text-white/25 text-[clamp(1.3rem,2.6vw,2.6rem)] transition-colors duration-500 group-hover:text-white/80">
            <span>{n[0]}</span>
            <span>{n[1]}</span>
          </div>

          <div className="min-w-0">
            <h3 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-white text-[clamp(1.6rem,4.7vw,4.6rem)]">
              {p.title}
            </h3>
            {/* Paragraph — extra space above, types out on hover */}
            <div className="mt-4 sm:mt-5 h-5 overflow-hidden">
              <TypingText
                text={SERVICES[p.category]}
                active={hovered}
                className="font-mono text-xs sm:text-sm tracking-wide text-cyan whitespace-nowrap"
              />
            </div>
          </div>
        </div>

        {/* Right — year, slides left on hover */}
        <div className="hidden md:block shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-[-1.2vw]">
          <p className="font-mono text-xs text-muted/60 transition-colors duration-500 group-hover:text-white/70">
            {YEAR[p.category]}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

/* ── Typewriter reveal (char-by-char) with a blinking block cursor ── */
function TypingText({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [active, text]);

  const done = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      <span
        className={`ml-0.5 inline-block h-[0.95em] w-[0.45em] translate-y-[0.08em] bg-cyan transition-opacity ${
          active ? (done ? "animate-pulse" : "opacity-100") : "opacity-0"
        }`}
      />
    </span>
  );
}
