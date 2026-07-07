# soc-portfolio-cinematic

Walid Tlemcani's personal SOC analyst portfolio. Cinematic scroll-driven design.
Live at: https://github.com/waliidtlm/soc-portfolio-cinematic (branch: main)

## Stack
Next.js 16 (app router) · React 19 · TypeScript 5 · Tailwind v4 · framer-motion · lucide-react · three.js

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `tsc --noEmit` — type check (no typecheck script, run directly)

## Verification (before declaring done)
1. `tsc --noEmit`
2. `npm run lint`
3. `npm run build`
For UI: verify in browser — scroll behavior and animations don't show in code review.
Screenshot helper: `node scripts/shot.mjs <out.png> <scrollY>`

## Page Structure
`app/page.tsx` → Hero → Manifesto → Projects → Certifications → About → Contact → Footer
Profile and project data live in `lib/data.ts`.

## Active Components
About, BrandIcons, CertCard, Certifications, Contact, Footer, HeroExpand, Logo, Manifesto,
Navbar, Projects, Reveal, ScrollExpandMedia, SectionHeader, TerminalCard.

## Architecture Rules
- `<main>` must stay `overflow-x-clip` — NEVER change to `overflow-hidden` (breaks sticky sections).
- Section backgrounds using `-z-10` render below global `.scene-bg` (z: −2) — add `isolate` to the section to fix.
- Hero (`HeroExpand` / `ScrollExpandMedia`) is standalone — no children.
- Nav label for the projects section is "Work" → `#projects`, not "Projects".
- `SERVICES` and `YEAR` constants live in `Projects.tsx`, not `lib/data.ts`.

## Hard Rules
- NEVER rebuild removed sections (SocOperations, Skills "Technical Arsenal", old Hero parallax,
  ProjectCard 3D-tilt, WindingRoad, Interactive Case Study) without explicit instruction.
- NEVER add a "Download CV" button — there is no CV link on the page currently.
- NEVER use `overflow-hidden` on any ancestor of a sticky/pinned section.

## Tailwind v4 — Canonical Classes
Use these exact class names (v4 syntax differs from v3):
`bg-linear-to-b`, `bg-linear-to-r`, `bg-size-[26px_26px]`, `perspective-[1100px]`,
`backface-hidden`, `min-h-dvh`, `h-dvh`, `scrollbar-none`, `hover:bg-white/2.5`,
`from-bg` (theme token = `#060912`), `h-18`, `h-104`, `w-72.5`, `sm:w-85`.

## Gotchas
- `position: sticky` breaks if any ancestor has `overflow: hidden/auto/scroll` — use `overflow-x-clip`.
- Headless Chrome `--screenshot` freezes CSS animations — use CDP for accurate screenshots.
- `Input.dispatchMouseEvent` (mouseMoved) does NOT reliably trigger `:hover` in headless Chrome —
  force hover state via JS (`el.style.opacity='1'`) and screenshot after.
- CDP: connect to page target, not the browser target.
- GPT-generated PNGs may bake a white background into pixels — verify real alpha before using.
- Tailwind v4 uses `@theme` tokens defined in `app/globals.css`, not `tailwind.config.js`.
