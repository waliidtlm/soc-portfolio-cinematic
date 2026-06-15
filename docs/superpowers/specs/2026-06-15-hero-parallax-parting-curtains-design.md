# Hero Parallax v2 — "Parting Curtains" Design

**Date:** 2026-06-15
**Component:** `components/Hero.tsx` (+ minor `app/globals.css`)
**Status:** Approved design — ready for implementation plan

## Goal

Upgrade the hero's layered parallax into a cinematic "parting curtains" reveal. On
scroll, a left-anchored **silhouette** and a right-anchored **mountain** slide
outward and settle as side framing, while the camera **zooms into the city**
between them (wide city crossfades into a sharper close-up). The effect was
prototyped and approved via the brainstorming visual companion.

## Confirmed decisions

- **Scroll mechanic:** Pinned hero (Approach A). The hero sticks to the viewport
  and the choreography plays out over extra scroll distance before the page
  continues to Projects.
- **Wings:** slide outward **partway and stay** as edge framing (NOT a full exit),
  and sit **fairly far out** (prototype-approved distances: silhouette ≈ −18vw,
  mountain ≈ +16vw). They darken into framing silhouettes rather than fading away.
- **Zoom target:** generated close-up city; crossfade wide → close as it zooms.
- **Mountain style:** dark neon-rim silhouette (Image 2), transparent PNG.
- **Silhouette:** keep the existing figure + cliff (`hero-fg.png`) as the left wing.
- **Tech:** extend the existing framer-motion `useScroll`/`useTransform`/`useSpring`
  pattern (not a manual scroll listener or CSS scroll-timeline). Keep mouse
  parallax layered on top. Respect `prefers-reduced-motion`.

## Assets (all on disk, verified)

| File | Role | Dimensions | Notes |
|------|------|-----------|-------|
| `public/images/hero-bg.png` | City · wide (existing) | 1774×887 (2:1) | figure inpainted out |
| `public/images/hero-city-close.png` | City · close (NEW) | 1774×887 (2:1) | pixel-matched to wide → clean crossfade |
| `public/images/hero-fg.png` | Silhouette + cliff (existing) | 1536×1024 | transparent, left wing |
| `public/images/hero-mountain.png` | Mountain (NEW) | 1024×1024 | transparent neon-rim, right wing |

Pristine copies live in `public/images/_layer-originals/` (incl. the spare
photographic mountain `hero-mountain-1.png`, unused).

## Layer stack (back → front)

1. **City · wide** — `hero-bg.png`, `bg-cover bg-center`. Scales `1 → 1.75`.
2. **City · close** — `hero-city-close.png`, same framing. Scales in lockstep with
   the wide layer; opacity `0 → 1` ramped across the zoom so wide→close dissolves
   seamlessly.
3. **Silhouette + cliff** — `hero-fg.png`, `bg-contain bg-bottom`, anchored left.
   `x: 0 → −18vw`, brightness darkens toward framing.
4. **Mountain** — `hero-mountain.png`, `bg-contain bg-bottom-right`, anchored right.
   `x: 0 → +16vw`, brightness darkens toward framing.
5. **Overlays** — telemetry scan sweep (`.hero-scan`), horizon radial glow,
   edge-framing shadows (`opacity 0 → ~0.9`), bottom blend into `#060912`, top
   navbar blend.
6. **Content** (`SHOW_OVERLAY`-gated) — headline / buttons / widgets; `opacity` and
   `y` driven to fade + lift as the camera pushes in.

## Scroll mechanics (pinned)

- Wrap the hero in a tall **pin container** (~`280vh`). Inner `.stage` is
  `sticky top-0 h-svh overflow-hidden isolate` (keep `isolate` for the `-z-10`
  stacking-context fix).
- `useScroll({ target: pinRef, offset: ["start start", "end start"] })`.
- `scrollYProgress` (0→1), smoothed/eased, drives via `useTransform`:
  - `cityScale`: `1 → 1.75`
  - `closeOpacity`: `0 → 1` (ramp ~`[0.15, 1]`)
  - `silX`: `0 → −18vw`; `silBrightness`: `1 → ~0.55`
  - `mtnX`: `0 → +16vw`; `mtnBrightness`: `1 → ~0.6`
  - `edgeOpacity`: `0 → ~0.9`
  - `contentOpacity`: `1 → 0`; `contentY`: `0 → −30px`
- **Mouse parallax** (existing `onPointerMove` → spring x/y) stays, composed on top
  of the scroll-driven `x` for wings + a gentle drift on the city.
- **`prefers-reduced-motion`:** disable the scroll-zoom and wing slide (hold a
  static framed composition or a gentle opacity fade), and freeze the scan —
  matching the existing reduced-motion-safe approach.

## Stacking-context gotcha (known)

Section backgrounds using `-z-10` render below the global `.scene-bg` (z −2) unless
the section creates a local stacking context. The hero already uses `isolate`;
keep it on the sticky `.stage`.

## Files touched

- `components/Hero.tsx` — rewrite the parallax block: pin container + sticky stage,
  add the two new layers (close city, mountain), add the new scroll transforms and
  edge-framing overlay. Preserve `SHOW_OVERLAY`, content, and widgets logic; wire
  their fade/lift to `scrollYProgress`.
- `app/globals.css` — minor: an edge-frame helper if the gradient isn't done
  inline; keep `.hero-scan`.

## Out of scope (follow-ups)

- `SHOW_OVERLAY` stays `false` for now (background-focused work). Restoring and
  tuning the headline fade-on-zoom is a clean follow-up — the prototype already
  demonstrates it.
- Replacing the spare photographic mountain (`hero-mountain-1.png`) — unused.

## Verification

Per the project's screenshot workflow ([[dev-screenshot-verification]]): capture
headless-Chrome `--screenshot` at three scroll offsets — top (0%), mid-zoom
(~50%), full-zoom (~100%) — to confirm the part + zoom + crossfade + framing.
Note: headless **freezes CSS animations**, so the scan beam won't move; verify the
scroll-driven transform states by scroll position, not the scan.
