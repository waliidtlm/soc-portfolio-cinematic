# 3D-Tilt Project Cards — Design

**Date:** 2026-06-15
**Status:** Approved, ready for implementation

## Goal

Replace the static `ProjectCard` in the portfolio's Projects section with an
image-led, interactive card that has a mouse-tracking 3D tilt and reveals
project detail (problem / impact / tech) on hover. Inspired by an
`InteractiveTravelCard` reference component, but restyled to the portfolio's
existing design tokens.

## Decisions

- **Layout style:** Full travel-card style — clean image-led front, detail on reveal (not the current always-visible rich card).
- **Reveal mechanism:** Hover overlay that slides up from the bottom (frosted glass), kept inside the 3D-tilt card. Tappable on touch / no-hover devices.
- **Links:** Placeholder for now (`#`). Add an optional `href?: string` to the `Project` type so real URLs can be dropped in later without touching the component.

## Scope

**In scope**
- Rewrite `components/ProjectCard.tsx` as a 3D-tilt card.
- Add optional `href?: string` to the `Project` type in `lib/data.ts`.

**Out of scope**
- `components/Projects.tsx` carousel logic (scroller, arrows, dots) — unchanged.
- Project data values, metrics, and other portfolio sections.

## Component design — `ProjectCard.tsx`

`"use client"` (uses framer-motion hooks and mouse events).

### Tilt
- `useMotionValue` for `mouseX`/`mouseY`, `useSpring` (damping 15, stiffness 150).
- `useTransform` → `rotateX` / `rotateY` (~±10deg).
- Root `motion.div`: `style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}`,
  `onMouseMove` sets normalized -0.5..0.5, `onMouseLeave` resets to 0.
- Sized to the carousel slot, not the example's fixed `w-80 h-[26rem]`. The
  slot wrapper in `Projects.tsx` already sets `w-[290px] sm:w-[340px]`; the card
  fills it (`h-full w-full`) with a fixed aspect/height suitable for the section.

### Front face (depth layers via `translateZ`)
- Background: project `image` (background-image, so a missing asset doesn't show a
  broken-image icon), preserving the existing gradient + grid + icon fallback.
- Darkening gradient overlay for text contrast.
- **Category badge** top-left (kept, reuse existing `CATEGORY` gradient map + icon).
- **Title** (`project.title`) and **subtitle** = humanized category label
  (siem → "SIEM", intel → "Threat Intelligence", automation → "Automation",
  detection → "Detection Engineering").
- **Corner link**: `ArrowUpRight` in a glass circle → `project.href ?? "#"`.

### Hover overlay (reveal)
- Frosted-glass panel anchored to the bottom, translated down/hidden by default,
  slides up + fades in on `group-hover` (and `focus-within`).
- Contents: `problem` text, **Impact** line (cyan accent), **tech tags** (reuse
  `.tag` class), and a glass **"View project"** button → `project.href ?? "#"`.
- Touch fallback: on hover-incapable devices the overlay is shown (CSS
  `@media (hover: none)`), so detail is always reachable.

### Styling tokens (reuse, don't hardcode)
- `glass` / `glass-solid`, `cyan`, `dim` / `muted`, `.tag`, `font-display`.
- Replace the reference component's hardcoded `white/20` etc. with these.

## Data change — `lib/data.ts`

```ts
export type Project = {
  badge: string;
  category: "siem" | "intel" | "automation" | "detection";
  title: string;
  problem: string;
  impact: string;
  tech: string[];
  image: string;
  href?: string; // optional external/case-study link; falls back to "#"
};
```

No existing project entries need values added (optional field).

## Verification

- `npm run build` / typecheck passes.
- Visual check (system headless Chrome `--screenshot` per project convention):
  card renders in the carousel, tilt responds to mouse, overlay reveals impact +
  tech on hover, fallback background shows when image asset missing.
