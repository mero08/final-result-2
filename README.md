# Fares Azab — Cinematic Portfolio

Director and cinematographer site: React, Vite, GSAP, and a Three.js hero camera.

**Live repo:** [mero08/final-result-2](https://github.com/mero08/final-result-2)

## Setup

```bash
npm install
npm run dev
```

Dev server: `http://localhost:8080`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local Vite server |
| `npm test` | Vitest (home + 404 smoke) |
| `npm run lint` | ESLint |
| `npm run build` | Production bundle |
| `npm run preview` | Preview `dist/` |

## Assets

- `public/camera_optimized.glb` — hero model (required)
- `public/favicon.svg` / `public/og-image.svg` — icons and share card

Reels play from Mux in the browser. There is no `public/reels` mp4 folder.

## Contact form (EmailJS)

Public keys are in `ContactSection.tsx`. In the EmailJS dashboard, restrict the key to your production domain before a public launch. Optional later: move IDs into `VITE_` env vars.

## Deploy

Configured for Vercel (`vercel.json` SPA rewrite). Set the production domain, then deploy the `main` (or `publish-ready`) branch.

After the site has a real HTTPS URL, change `og:image` and `twitter:image` in `index.html` to that absolute URL (PNG/JPG 1200×630 works best for Facebook/LinkedIn; SVG is a placeholder). Drei’s `useGLTF` already enables Meshopt for `public/camera_optimized.glb`.
