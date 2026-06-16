# Manifesto Section Design

**Date:** 2026-06-16
**Component:** `components/Manifesto.tsx` (NEW) + minor `app/page.tsx`
**Status:** Approved design — ready for implementation plan

## Goal

Add a cinematic text interstitial between the hero (`HeroExpand`) and Selected Work
(`Projects`). It gives the page a breather between two heavy moving sections — the
scroll-expanding Veo video and the full-bleed hover rows — and is the home for the
mission/manifesto copy. A pinned, scroll-linked reveal lights the copy line-by-line
on a **solid black, full-bleed band**, then releases into Selected Work.

Concept selected via the brainstorming visual companion: **Concept A — Mission
Manifesto** (scroll-linked text reveal), with a **pinned** reveal. Per later
feedback, the parallax telemetry background was dropped in favor of pure black — the
motion is the line-by-line text reveal itself (white text resolving on black).

## Confirmed decisions

- **Placement:** `components/Manifesto.tsx`, rendered in `app/page.tsx` between
  `<HeroExpand />` and `<Projects />`. `id="manifesto"`. **No nav link** (it's a
  transition, not a destination).
- **Copy (exact):**
  - Line 1: `Every alert tells a story.`
  - Line 2: `Every anomaly leaves a trace.`
  - Line 3: `Every investigation reveals a path.`
  - Divider (hairline, cyan → transparent)
  - Paragraph: `This portfolio follows that path through detections, investigations,
    and projects built to transform security data into actionable intelligence.`
- **No kicker / no label.** Lead straight into the first line — nothing generic above
  it. (Earlier mockup label "the analyst's path" was rejected as generic and removed.)
- **Type treatment:** three `font-display` (Sora) lines. The repeated word **"Every"**
  stays dim (`--color-muted`) as the anaphora anchor; the rest of each line is white
  (`--color-text`); the payoff word (**story / trace / path**) is cyan
  (`--color-cyan`). Paragraph in Manrope/dim (`--color-dim`) with **detections**,
  **investigations**, **actionable intelligence** emphasized in white.
  ("actionable intelligence" deliberately echoes the hero title "Actionable
  Intelligence" for continuity.)
- **Background:** **solid black, full-bleed band** — no grid, no glow, no bordered
  box. A flat dark band (`--color-bg` `#060912`, or pure `#000` for a harder break)
  spanning the full viewport width, edge-to-edge. The section sets its own opaque
  background so the global `.scene-bg` gradients do not show through (the band reads
  as a clean black interstitial between hero and Work).
- **Width / no container:** **full width.** No `max-w` wrapper. Text spans the band
  with only a small horizontal safe-padding (`px-[5vw]`), left-aligned. (Selected Work
  uses `max-w-[1600px]` inside its `px-[5vw]`; dropping the max-w means on ultrawide
  screens the manifesto text sits slightly wider than the rows below — accepted, the
  user wants full width.)
- **Motion:** **pinned cinematic reveal.** Section pins; lines reveal one-by-one
  across scroll progress; releases into Selected Work. The reveal *is* the animation
  (no background motion, since the band is flat black).
- **Pin length:** wrapper **130vh** (≈ 30vh of reveal travel beyond the sticky
  screen) — snappy. Reveal ranges compressed to finish by ~62% progress so the full
  statement holds before releasing.
- **Tech:** framer-motion `useScroll` / `useTransform` / `useSpring` (matches the
  existing `hero-parallax-parting-curtains` pattern; not a manual wheel listener).
- **Reduced motion:** honor `prefers-reduced-motion` — static full composition.

## Layout

Single flat black band, full width. One text layer:

- **Text layer:** the three anaphora lines, hairline divider, and hand-off paragraph,
  in `px-[5vw]` (no `max-w`), left-aligned, vertically centered in the sticky stage.
- **Background:** flat opaque black — no grid, glow, or scan beam.

## Scroll mechanics (pinned)

- Tall **pin wrapper** `~180vh`. Inner `.stage` is
  `sticky top-0 h-svh overflow-hidden isolate`.
  - `isolate` is **required**: section backgrounds using `-z-10` render below the
    global `.scene-bg` (z −2) unless the section makes its own stacking context
    (known gotcha, documented in the hero-parallax spec).
- `useScroll({ target: pinRef, offset: ["start start", "end start"] })` →
  `scrollYProgress` (0→1), smoothed with `useSpring`.
- Reveal ramps via `useTransform` (starting values, tune in implementation):
  - Line 1: `[0.04, 0.16]`
  - Line 2: `[0.18, 0.30]`
  - Line 3: `[0.32, 0.44]`
  - Divider + paragraph: `[0.48, 0.62]`
  - Each line ramps `opacity` and lifts a few px (`y`); colors are static per-word
    (dim "Every" / white body / cyan payoff).
- Last ~10% of travel resolves the paragraph, then the pin releases into Selected Work.

## Accessibility

- `prefers-reduced-motion: reduce`: disable the pin + scroll-linked reveal; render the
  full composition statically (all lines at full brightness, paragraph visible). The
  scan beam already hides under reduced motion via existing CSS. Matches the project's
  reduced-motion-safe approach.

## Files touched

- **NEW** `components/Manifesto.tsx` — the section: pin wrapper + sticky stage,
  full-bleed flat black background, the anaphora lines / divider / paragraph, scroll
  transforms, reduced-motion fallback.
- **EDIT** `app/page.tsx` — one import + one `<Manifesto />` line between
  `<HeroExpand />` and `<Projects />`.
- **MAYBE** `app/globals.css` — only if a divider helper is cleaner as a class than
  inline; otherwise untouched.

## Out of scope (follow-ups)

- No nav entry for the section (revisit only if desired later).
- No new image assets — background is a flat black band, no generated art.
- 21st.dev Magic MCP component fetch: the server is connected but its tools were not
  exposed in the brainstorming session. If desired, fetch a reference
  text-reveal/parallax component once the MCP tools load (Claude Code restart) to
  cross-check the implementation — optional, not required.

## Verification

Per the project's screenshot workflow ([[dev-screenshot-verification]]): the section
is below the scroll-hijacking hero, so drive Chrome via CDP wheel events (connect to
the page target, not the browser target) and capture at reveal offsets — entry (~0%),
mid-reveal (~50%), resolved (~100%) — to confirm line-by-line reveal on the flat
black band, full-bleed width, and release into Projects. Note:
headless **freezes CSS animations**, so verify scroll-driven transform states by
scroll position.
