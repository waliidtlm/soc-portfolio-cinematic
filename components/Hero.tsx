"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { profile } from "@/lib/data";
import ThreatActivityWidget from "./hero/ThreatActivityWidget";
import LiveFeedWidget from "./hero/LiveFeedWidget";
import TopThreatTypesWidget from "./hero/TopThreatTypesWidget";

// Flip to true to restore the headline/buttons + widgets over the parallax.
const SHOW_OVERLAY = false;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export default function Hero() {
  const pinRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // --- Debug: force a fixed progress via ?hp=0.5 so a plain headless
  //     `--screenshot` can capture any scroll state without scrolling. ---
  const [forced, setForced] = useState<number | null>(null);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("hp");
    if (v !== null) {
      const n = parseFloat(v);
      if (!Number.isNaN(n)) setForced(Math.min(1, Math.max(0, n)));
    }
  }, []);

  // --- Single progress driver (0..1) for every layer ---
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });
  const driver = useMotionValue(0);
  useMotionValueEvent(smoothScroll, "change", (v) => {
    if (forced === null) driver.set(v);
  });
  useEffect(() => {
    if (forced !== null) driver.set(forced);
  }, [forced, driver]);
  // Reduced motion collapses the whole effect to its rest (progress 0) state.
  const p = useTransform(driver, (v) => (reduce ? 0 : v));

  // --- City: zoom + wide→close crossfade ---
  const cityScale = useTransform(p, [0, 1], [1, 1.75]);
  const closeOpacity = useTransform(p, [0.15, 1], [0, 1]);

  // --- Silhouette wing: slides fully out into the bottom-left corner on scroll ---
  const silXn = useTransform(p, [0, 1], [0, -34]);
  const silX = useMotionTemplate`${silXn}vw`;
  const silBn = useTransform(p, [0, 1], [1, 0.55]);
  const silFilter = useMotionTemplate`brightness(${silBn})`;

  const edgeOpacity = useTransform(p, [0, 1], [0, 0.9]);

  // --- Content fade + lift ---
  const contentOpacity = useTransform(p, [0, 0.5], [1, 0]);
  const contentY = useTransform(p, [0, 1], [0, -40]);

  // --- Mouse parallax (disabled under reduced motion) ---
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };
  const cityMX = useTransform(smx, (v) => v * -10);
  const cityMY = useTransform(smy, (v) => v * -8);
  const silMX = useTransform(smx, (v) => v * -30);

  return (
    <section id="home" ref={pinRef} className="relative h-[280svh] w-full">
      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="sticky top-0 isolate flex h-svh w-full items-center overflow-hidden lg:items-end"
      >
        {/* Layered parallax background (scroll + mouse) */}
        <div className="absolute inset-0 -z-10">
          {/* City group — scales + mouse drift; wide + close crossfade */}
          <motion.div
            style={{
              scale: cityScale,
              x: cityMX,
              y: cityMY,
              transformOrigin: "50% 45%",
            }}
            className="absolute -inset-[7%]"
            aria-hidden
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/hero-bg.png')" }}
            />
            <motion.div
              style={{
                opacity: closeOpacity,
                backgroundImage: "url('/images/hero-city-close.png')",
              }}
              className="absolute inset-0 bg-cover bg-center"
            />
          </motion.div>

          {/* Silhouette — left wing (scroll slide + mouse drift + darken) */}
          <motion.div style={{ x: silX }} className="absolute inset-0" aria-hidden>
            <motion.div
              style={{ x: silMX, filter: silFilter }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-contain bg-bottom-left bg-no-repeat"
                style={{ backgroundImage: "url('/images/hero-fg.png')" }}
              />
            </motion.div>
          </motion.div>

          {/* Edge framing shadows — deepen as the silhouette settles */}
          <motion.div
            style={{ opacity: edgeOpacity }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,13,0.92),transparent_16%),linear-gradient(270deg,rgba(3,6,13,0.92),transparent_16%)]"
            aria-hidden
          />

          {/* Telemetry scan sweep over the scene */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="hero-scan absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.10)_70%,rgba(34,211,238,0.34))]">
              <div className="absolute inset-x-0 bottom-0 h-px bg-cyan/90 shadow-[0_0_22px_5px_rgba(34,211,238,0.5)]" />
            </div>
          </div>

          {/* horizon glow */}
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_85%,rgba(37,99,235,0.28),transparent_60%)]" />
          {/* bottom blend into page */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_2%,transparent_42%)]" />
          {/* top blend for navbar */}
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(6,9,18,0.8),transparent)]" />
        </div>

        {SHOW_OVERLAY && (
          <>
            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-28 sm:px-8">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ y: contentY, opacity: contentOpacity }}
                className="max-w-2xl [text-shadow:0_2px_24px_rgba(0,0,0,0.85)]"
              >
                <motion.span variants={item} className="kicker">
                  SOC Analyst &amp; Cybersecurity Professional
                </motion.span>

                <motion.h1
                  variants={item}
                  className="mt-6 font-display text-[2.7rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.3rem]"
                >
                  Turning Security Telemetry Into{" "}
                  <span className="text-gradient-blue">Actionable Intelligence.</span>
                </motion.h1>

                <motion.p
                  variants={item}
                  className="mt-6 max-w-xl text-base leading-relaxed text-dim sm:text-lg"
                >
                  I help organizations detect, investigate and respond to cyber threats
                  before they become incidents.
                </motion.p>

                <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3.5">
                  <a href="#projects" className="btn btn-primary">
                    View My Work <ArrowRight size={17} />
                  </a>
                  <a href={profile.cvUrl} className="btn btn-ghost">
                    Download CV <Download size={16} />
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating telemetry widgets (desktop) */}
            <motion.div
              style={{ opacity: contentOpacity }}
              className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
            >
              <div className="absolute right-8 top-24 flex flex-col items-end gap-4 xl:right-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease }}
                >
                  <ThreatActivityWidget />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.65, ease }}
                >
                  <LiveFeedWidget />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8, ease }}
                >
                  <TopThreatTypesWidget />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
