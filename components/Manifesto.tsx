"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

const LINES = [
  { lead: "Every", body: "alert tells a", accent: "story." },
  { lead: "Every", body: "anomaly leaves a", accent: "trace." },
  { lead: "Every", body: "investigation reveals a", accent: "path." },
] as const;

const lineClass =
  "font-display font-extrabold tracking-tight leading-[1.08] text-[clamp(2rem,5.5vw,4.5rem)]";

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
    <p className="mt-2 max-w-2xl font-sans text-[clamp(1.05rem,1.65vw,1.25rem)] leading-relaxed text-dim">
      I operate at the intersection of raw telemetry and decisive action —
      engineering <b className="font-semibold text-white">detection logic</b>,
      triaging <b className="font-semibold text-white">real-world threats</b>,
      and translating noise into{" "}
      <b className="font-semibold text-white">security outcomes</b> that protect
      what actually matters.
    </p>
  );
}

export default function Manifesto() {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);

  // Entrance: tracks section rising from bottom of viewport → top of viewport
  const { scrollYProgress: enterProgress } = useScroll({
    target: pinRef,
    offset: ["start end", "start start"],
  });

  // Pin: tracks the 30vh scroll window while section is sticky
  // pinProgress 0→1 spans the full 130vh section; pin releases at 30/130 ≈ 0.231
  const { scrollYProgress: pinProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  // Black panel rises from fully below → fully in place when pin starts
  const bgY = useTransform(enterProgress, [0, 1], ["100%", "0%"]);

  // Text reveals scroll-driven during the pin — each item appears as you scroll.
  // All ranges fit within [0, 0.23] (the actual pin window) so nothing is skipped.
  const titleO = useTransform(pinProgress, [0.00, 0.04], [0, 1]);
  const titleY = useTransform(pinProgress, [0.00, 0.04], [24, 0]);

  const o1    = useTransform(pinProgress, [0.04, 0.09], [0, 1]);
  const y1    = useTransform(pinProgress, [0.04, 0.09], [24, 0]);
  const o2    = useTransform(pinProgress, [0.09, 0.14], [0, 1]);
  const y2    = useTransform(pinProgress, [0.09, 0.14], [24, 0]);
  const o3    = useTransform(pinProgress, [0.14, 0.19], [0, 1]);
  const y3    = useTransform(pinProgress, [0.14, 0.19], [24, 0]);

  const oEnd  = useTransform(pinProgress, [0.19, 0.23], [0, 1]);
  const yEnd  = useTransform(pinProgress, [0.19, 0.23], [24, 0]);

  const opacities = [o1, o2, o3];
  const ys = [y1, y2, y3];

  if (reduced) {
    return (
      <section id="manifesto" className="relative w-full bg-black">
        <div className="flex flex-col justify-center px-[5vw] py-24">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
            The Analyst's Mindset
          </p>
          {LINES.map((_, i) => (
            <Line key={i} i={i} />
          ))}
          <div className="my-7 h-px w-50 bg-linear-to-r from-cyan to-transparent" />
          <Paragraph />
        </div>
      </section>
    );
  }

  return (
    <section id="manifesto" className="relative w-full">
      <div ref={pinRef} className="relative h-[130vh]">
        {/* overflow-hidden clips the rising panel to the sticky viewport bounds */}
        <div className="sticky top-0 h-svh overflow-hidden">
          <motion.div
            style={{ y: bgY as MotionValue<string> }}
            className="absolute inset-0 flex flex-col justify-center bg-black px-[5vw]"
          >
            <motion.p
              style={{ opacity: titleO as MotionValue<number>, y: titleY as MotionValue<number> }}
              className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-cyan"
            >
              The Analyst's Mindset
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
