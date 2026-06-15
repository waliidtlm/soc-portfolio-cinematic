# Hero Parallax "Parting Curtains" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the hero's two-layer parallax into a pinned "parting curtains" reveal — silhouette slides left, mountain slides right, and the city zooms in (wide→close crossfade) between them.

**Architecture:** One pinned section (`~280svh`) with a `sticky` inner stage. A single spring-smoothed `scrollYProgress` driver feeds framer-motion `useTransform` chains for city scale + close-city crossfade opacity, left/right wing slide+darken, edge-framing opacity, and content fade/lift. Mouse parallax composes on top via nested `motion.div`s. A `?hp=<0..1>` debug query forces a fixed progress so plain headless `--screenshot` can capture any scroll state deterministically.

**Tech Stack:** Next.js 16 (app router), React 19, Tailwind v4, framer-motion. No test runner is installed and the effect is visual, so verification is **screenshot-based** (system headless Chrome at fixed `?hp=` states) per the project's established workflow — not unit tests. The project is **not** a git repo, so "checkpoints" are screenshot verifications, not commits.

---

## File Structure

- **Modify:** `components/Hero.tsx` — full rewrite of the parallax block: pin section + sticky stage, single progress driver, two new layers (close city, mountain), new transforms, edge-framing overlay, debug `?hp=` hook. Content/widgets logic preserved (still gated by `SHOW_OVERLAY`).
- **No change needed:** `app/globals.css` — `.hero-scan` and `--color-bg` already exist; edge framing is done inline with Tailwind arbitrary gradients.
- **Assets (already on disk, verified):** `public/images/hero-bg.png`, `hero-city-close.png`, `hero-fg.png`, `hero-mountain.png`.

All motion values are interdependent and the component must be whole to render, so the rewrite is one coherent edit (Task 1), followed by screenshot verification + numeric tuning (Task 2), reduced-motion verification (Task 3), and cleanup/memory (Task 4).

---

### Task 1: Rewrite `components/Hero.tsx`

**Files:**
- Modify: `components/Hero.tsx` (replace entire file)

- [ ] **Step 1: Replace the file with the new implementation**

```tsx
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

  // --- Wings: slide outward (vw) + darken into framing ---
  const silXn = useTransform(p, [0, 1], [0, -18]);
  const silX = useMotionTemplate`${silXn}vw`;
  const silBn = useTransform(p, [0, 1], [1, 0.55]);
  const silFilter = useMotionTemplate`brightness(${silBn})`;

  const mtnXn = useTransform(p, [0, 1], [0, 16]);
  const mtnX = useMotionTemplate`${mtnXn}vw`;
  const mtnBn = useTransform(p, [0, 1], [1, 0.6]);
  const mtnFilter = useMotionTemplate`brightness(${mtnBn})`;

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
  const mtnMX = useTransform(smx, (v) => v * -22);

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
            style={{ scale: cityScale, x: cityMX, y: cityMY }}
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

          {/* Mountain — right wing (scroll slide + mouse drift + darken) */}
          <motion.div style={{ x: mtnX }} className="absolute inset-0" aria-hidden>
            <motion.div
              style={{ x: mtnMX, filter: mtnFilter }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-y-0 right-0 w-[60vw] bg-contain bg-bottom-right bg-no-repeat"
                style={{ backgroundImage: "url('/images/hero-mountain.png')" }}
              />
            </motion.div>
          </motion.div>

          {/* Edge framing shadows — deepen as the wings settle */}
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
```

- [ ] **Step 2: Fix the close-city layer's background image**

The code block above has a placeholder marker `style-bg` on the close-city `motion.div` because two `style` attributes can't coexist. Replace that whole element with the single correct version:

```tsx
            <motion.div
              style={{
                opacity: closeOpacity,
                backgroundImage: "url('/images/hero-city-close.png')",
              }}
              className="absolute inset-0 bg-cover bg-center"
            />
```

- [ ] **Step 3: Start the dev server**

Run: `npm run dev`
Expected: compiles with no TypeScript/ESLint errors; server on `http://localhost:3000`.

- [ ] **Step 4: Verify it renders at rest (progress 0)**

Run (Git Bash):
```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 \
  --virtual-time-budget=6000 --screenshot="$(pwd)/_shot.png" "http://localhost:3000/?hp=0"
```
Then `Read` `_shot.png`. Expected: wide city centered, silhouette anchored at the **left**, mountain anchored at the **right**, scan/glow/blends present. Then `rm -f _shot.png`.

---

### Task 2: Verify the three progress states and tune the knobs

**Files:**
- Modify (tuning only): `components/Hero.tsx`

- [ ] **Step 1: Capture mid-zoom (progress 0.5)**

Run:
```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 \
  --virtual-time-budget=6000 --screenshot="$(pwd)/_shot.png" "http://localhost:3000/?hp=0.5"
```
`Read` `_shot.png`, then `rm -f _shot.png`. Expected: wings have moved partway out and darkened; city is part-way zoomed; close-city is ~half crossfaded in; edge shadows partly visible.

- [ ] **Step 2: Capture full zoom (progress 1)**

Same command with `"http://localhost:3000/?hp=1"`. Expected: wings settled far out as darkened side framing; city fully zoomed (1.75×) showing the **close** image; edge shadows at full; the scene reads as "zoomed into the city framed by the two wings."

- [ ] **Step 3: Tune constants to match the approved prototype**

Adjust only these literals in `components/Hero.tsx` if a screenshot looks off, then re-shoot the affected state:

| Look problem | Knob | Current |
|---|---|---|
| Wings don't sit far enough out | `silXn` `[0,1]→[0,-18]`, `mtnXn` `[0,1]→[0,16]` | −18 / 16 vw |
| Zoom too strong / weak | `cityScale` `[0,1]→[1,1.75]` | 1.75 |
| Close city pops in too early/late | `closeOpacity` `[0.15,1]→[0,1]` | starts 0.15 |
| Wings too dark / not dark enough | `silBn`/`mtnBn` end values | 0.55 / 0.6 |
| Edge framing too heavy / light | `edgeOpacity` end, or the `16%` gradient stops | 0.9 / 16% |
| Silhouette not far-left / clipped wrong | `bg-bottom-left` → try `bg-bottom`, or wrap figure div in `left-[-6%]` | left-bottom |
| Mountain too wide / narrow | mountain div `w-[60vw]` | 60vw |

Re-run the `?hp=0`, `?hp=0.5`, `?hp=1` captures after each change until all three match the prototype feel.

- [ ] **Step 4: Confirm live scroll feel (manual)**

Ask the user to open `http://localhost:3000` (no `?hp`) and scroll — confirm the pin + part + zoom plays smoothly over the ~280svh section before the page continues to Projects. (Headless can't show smooth motion; live confirmation per the project's workflow.)

---

### Task 3: Verify reduced-motion behavior

**Files:**
- No change expected (logic already in Task 1)

- [ ] **Step 1: Screenshot with reduced motion emulated**

Run:
```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 \
  --force-prefers-reduced-motion --virtual-time-budget=6000 \
  --screenshot="$(pwd)/_shot.png" "http://localhost:3000/?hp=1"
```
`Read` `_shot.png`, then `rm -f _shot.png`. Expected: even at `?hp=1`, the scene stays at the **rest** composition (no zoom, wings not slid) because `p` collapses to 0 under reduced motion. If it still animates, confirm the `useTransform(driver, (v) => (reduce ? 0 : v))` line and that `useReducedMotion()` is imported and used.

---

### Task 4: Cleanup, overlay note, and memory

**Files:**
- Modify: `components/Hero.tsx` (comment only)
- Update: project auto-memory `soc-portfolio-cinematic.md`

- [ ] **Step 1: Keep the `?hp=` debug hook (documented), do not remove**

It is harmless (defaults off; only active when `?hp=` is in the URL) and is the only way to screenshot scroll states headlessly. Ensure its comment block in `Hero.tsx` is intact so future tuning can reuse it.

- [ ] **Step 2: Leave `SHOW_OVERLAY = false`**

Restoring the headline/widgets over the new background is an explicit out-of-scope follow-up. The content is already wired to `contentOpacity`/`contentY`, so flipping the flag later "just works."

- [ ] **Step 3: Update the project memory**

Edit `C:\Users\Waliid Tlm\.claude\projects\c--Users-Waliid-Tlm--claude\memory\soc-portfolio-cinematic.md` — update the "Hero parallax (current design)" paragraph to describe the pinned parting-curtains effect: pin section `~280svh` + sticky stage, single spring driver, `hero-city-close.png` wide→close crossfade + zoom (1.75×), `hero-mountain.png` right wing + `hero-fg.png` left wing sliding −18vw/+16vw and darkening, edge framing, and the `?hp=<0..1>` debug screenshot hook. Add a one-line note under "Last session". Keep the `MEMORY.md` index line as-is (still accurate).

- [ ] **Step 4: Final three-state verification**

Re-run the `?hp=0`, `?hp=0.5`, `?hp=1` captures one last time; `Read` each and confirm the full choreography before declaring done. `rm -f _shot.png` after.

---

## Notes for the implementer

- **Tailwind v4 arbitrary values** (`h-[280svh]`, `w-[60vw]`, bracket gradients) are already used elsewhere in this codebase — they work.
- **Stacking-context gotcha:** the sticky stage keeps `isolate` so the `-z-10` background well stays above the global `.scene-bg` (z −2). Do not remove `isolate`.
- **`svh` units** are used so the pin math accounts for mobile browser UI; `h-svh` on the stage matches.
- **framer-motion in headless** renders entrance/mount animations inconsistently; the `?hp=` hook avoids that by driving a deterministic static progress. Don't trust a single capture for the (irrelevant here) scan beam — it's frozen near frame 0 in headless.
