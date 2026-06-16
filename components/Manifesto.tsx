"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* ── The three anaphora lines ── */
const LINES = [
  { lead: "Every", body: "alert tells a", accent: "story." },
  { lead: "Every", body: "anomaly leaves a", accent: "trace." },
  { lead: "Every", body: "investigation reveals a", accent: "path." },
] as const;

const lineClass =
  "font-display font-extrabold tracking-tight leading-[1.08] text-[clamp(1.8rem,5.5vw,4.5rem)]";

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
    <p className="mt-2 max-w-[34rem] font-sans text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed text-dim">
      This portfolio follows that path through{" "}
      <b className="font-semibold text-white">detections</b>,{" "}
      <b className="font-semibold text-white">investigations</b>, and projects
      built to transform security data into{" "}
      <b className="font-semibold text-white">actionable intelligence</b>.
    </p>
  );
}

export default function Manifesto() {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Reveal ramps — each line, then the divider + paragraph.
  const o1 = useTransform(p, [0.04, 0.16], [0, 1]);
  const y1 = useTransform(p, [0.04, 0.16], [24, 0]);
  const o2 = useTransform(p, [0.18, 0.3], [0, 1]);
  const y2 = useTransform(p, [0.18, 0.3], [24, 0]);
  const o3 = useTransform(p, [0.32, 0.44], [0, 1]);
  const y3 = useTransform(p, [0.32, 0.44], [24, 0]);
  const oEnd = useTransform(p, [0.48, 0.62], [0, 1]);
  const yEnd = useTransform(p, [0.48, 0.62], [24, 0]);

  const opacities = [o1, o2, o3];
  const ys = [y1, y2, y3];

  // ── Reduced motion: static full composition, no pin ──
  if (reduced) {
    return (
      <section id="manifesto" className="relative w-full bg-black">
        <div className="flex min-h-svh flex-col justify-center px-[5vw] py-32">
          {LINES.map((_, i) => (
            <Line key={i} i={i} />
          ))}
          <div className="my-7 h-px w-[200px] bg-linear-to-r from-cyan to-transparent" />
          <Paragraph />
        </div>
      </section>
    );
  }

  // ── Pinned cinematic reveal ──
  return (
    <section id="manifesto" className="relative w-full bg-black">
      <div ref={pinRef} className="relative h-[130vh]">
        <div className="sticky top-0 isolate flex h-svh items-center overflow-hidden bg-black px-[5vw]">
          <div className="flex flex-col">
            {LINES.map((_, i) => (
              <motion.div
                key={i}
                style={{ opacity: opacities[i] as MotionValue<number>, y: ys[i] as MotionValue<number> }}
              >
                <Line i={i} />
              </motion.div>
            ))}

            <motion.div style={{ opacity: oEnd, y: yEnd }}>
              <div className="my-7 h-px w-[200px] bg-linear-to-r from-cyan to-transparent" />
              <Paragraph />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
