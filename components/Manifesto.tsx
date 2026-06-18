"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import ProfileCard from "./ProfileCard";

const LINES = [
  { lead: "Every", body: "alert tells a", accent: "story." },
  { lead: "Every", body: "anomaly leaves a", accent: "trace." },
  { lead: "Every", body: "investigation reveals a", accent: "path." },
] as const;

const lineClass =
  "font-display font-extrabold tracking-tight leading-[1.08] text-[clamp(1.75rem,4vw,3.5rem)]";

function Line({ i }: { i: number }) {
  const l = LINES[i];
  return (
    <p className={lineClass}>
      <span className="text-muted">{l.lead}</span>{" "}
      <span className="text-white">{l.body}</span>{" "}
      <span className="text-cyan">{l.accent}</span>
    </p>
  );
}

function Paragraph() {
  return (
    <p className="mt-2 max-w-xl font-sans text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed text-dim">
      I operate at the intersection of raw telemetry and decisive action —
      engineering <b className="font-semibold text-white">detection logic</b>,
      triaging <b className="font-semibold text-white">real-world threats</b>,
      and translating noise into{" "}
      <b className="font-semibold text-white">security outcomes</b> that protect
      what actually matters.
    </p>
  );
}

const layout =
  "mx-auto grid max-w-[1700px] grid-cols-1 items-center gap-12 px-[4vw] py-20 lg:grid-cols-[1fr_auto] lg:gap-24";

export default function Manifesto() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-tied reveal: progresses as the section travels up through the
  // viewport. No pin, no scroll-hijack — just maps scroll position to reveal.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "center 0.55"],
  });

  // Each item reveals over its own slice of the scroll window.
  const kickerO = useTransform(scrollYProgress, [0.0, 0.12], [0, 1]);
  const kickerY = useTransform(scrollYProgress, [0.0, 0.12], [24, 0]);

  const o1 = useTransform(scrollYProgress, [0.12, 0.3], [0, 1]);
  const y1 = useTransform(scrollYProgress, [0.12, 0.3], [28, 0]);
  const o2 = useTransform(scrollYProgress, [0.3, 0.48], [0, 1]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.48], [28, 0]);
  const o3 = useTransform(scrollYProgress, [0.48, 0.66], [0, 1]);
  const y3 = useTransform(scrollYProgress, [0.48, 0.66], [28, 0]);

  const oEnd = useTransform(scrollYProgress, [0.66, 0.82], [0, 1]);
  const yEnd = useTransform(scrollYProgress, [0.66, 0.82], [28, 0]);

  // Card slides in from the right alongside the first lines.
  const cardO = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);
  const cardX = useTransform(scrollYProgress, [0.15, 0.45], [56, 0]);

  const opacities = [o1, o2, o3];
  const ys = [y1, y2, y3];

  // Reduced motion: render everything static, no scroll animation.
  if (reduced) {
    return (
      <section id="manifesto" className="relative w-full bg-black">
        <div className={layout}>
          <div className="text-left">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              The Analyst&apos;s Mindset
            </p>
            {LINES.map((_, i) => (
              <Line key={i} i={i} />
            ))}
            <div className="my-7 h-px w-50 bg-linear-to-r from-cyan to-transparent" />
            <Paragraph />
          </div>
          <div className="flex justify-center lg:justify-end">
            <ProfileCard />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="manifesto" ref={sectionRef} className="relative w-full bg-black">
      <div className={layout}>
        {/* Left — manifesto text, scroll-tied line-by-line reveal */}
        <div className="text-left">
          <motion.p
            style={{ opacity: kickerO as MotionValue<number>, y: kickerY as MotionValue<number> }}
            className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-cyan"
          >
            The Analyst&apos;s Mindset
          </motion.p>

          {LINES.map((_, i) => (
            <motion.div
              key={i}
              style={{ opacity: opacities[i] as MotionValue<number>, y: ys[i] as MotionValue<number> }}
            >
              <Line i={i} />
            </motion.div>
          ))}

          <motion.div style={{ opacity: oEnd as MotionValue<number>, y: yEnd as MotionValue<number> }}>
            <div className="my-7 h-px w-50 bg-linear-to-r from-cyan to-transparent" />
            <Paragraph />
          </motion.div>
        </div>

        {/* Right — personal card, slides in from the right */}
        <motion.div
          style={{ opacity: cardO as MotionValue<number>, x: cardX as MotionValue<number> }}
          className="flex justify-center lg:justify-end"
        >
          <ProfileCard />
        </motion.div>
      </div>
    </section>
  );
}
