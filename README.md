# SOC Analyst Portfolio — Cinematic

A premium, single-page cybersecurity portfolio for a SOC Analyst. Deep-navy
glassmorphism, telemetry-grade data viz, cinematic hero, and a winding "road"
that threads the sections together.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · lucide-react

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Sections

Navbar · Hero (+ live telemetry widgets) · Projects (carousel) · Skills (network graph) ·
SOC Operations (dashboard) · Certifications · About (+ terminal) · Contact · Footer.

## Fill in your content

All copy/data lives in [`lib/data.ts`](lib/data.ts). Update:

- `profile.name`, `profile.github`, `profile.linkedin` — marked `// TODO`
- `profile.cvUrl` — drop your CV at `public/cv.pdf`
- project copy, skills, certifications, SOC metrics

## Drop in images (optional — graceful fallbacks until then)

Place files at these paths (background-image slots, so missing files don't break layout):

| Slot | Path |
|------|------|
| Hero background | `public/images/hero.jpg` |
| Project thumbnails | `public/images/projects/{siem,threat-intel,phishing,detection-lab}.jpg` |
| Certification badges | `public/images/certs/{gcsa,secplus,azure,ceh,iso}.png` |
| Contact world map (optional) | `public/images/world-map-dots.svg` |

(Generate these with Gemini Nano Banana, then save to the paths above.)

## Known TODOs (v1)

- **Theme toggle** is present (per design) but light mode isn't implemented — dark only.
- **Contact form** opens the visitor's mail client via `mailto:`. Swap for a form
  service (Formspree / Resend) for true async submission — see `components/Contact.tsx`.

## Notes

- Motion respects `prefers-reduced-motion`.
- Section reveals are scroll-triggered (`whileInView`), so content fades in as you scroll.
- Brand icons (GitHub/LinkedIn) are inline SVGs in `components/BrandIcons.tsx`
  because Lucide removed brand glyphs at v1.
