# Version Tasklist – v1.0.0 — initial release
This document outlines all the tasks to work on to delivery this particular version, grouped by phases.

Each phase is a testable, commit-worthy checkpoint. Build a phase, test it locally (`npm run dev` / `npm run build`), commit to git, then move to the next.

| Status |      |
|--------|------|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Completed |


## Phase 1 — Project Foundation
Scaffold Astro and lock the toolchain and configuration.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 1.1 | Scaffold Astro project | Create the Astro app at repo root (`output: 'static'`), pin **Astro 7.x** + deps to exact latest-stable versions, commit lockfile. | None | 🟢 Completed | AGENT |
| 1.2 | Configure astro.config | Set `site: 'https://redpillbluepillstudios.com'`, `base: '/'`, sharp image service. | 1.1 | 🟢 Completed | AGENT |
| 1.3 | Add .gitignore | Ignore `node_modules/`, `dist/`, `.astro/`. | 1.1 | 🟢 Completed | AGENT |
| 1.4 | Verify local dev | Confirm `npm install` + `npm run dev` serves a blank site; `npm run build`/`preview` works. | 1.1, 1.2 | 🟢 Completed | AGENT |

## Phase 2 — Design System
Bring the prototype's look in as reusable tokens, fonts, and global styles.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 2.1 | Port design tokens | Copy prototype `:root` variables into `src/styles/tokens.css` (colors, fonts, lines). | 1.1 | 🟢 Completed | AGENT |
| 2.2 | Global styles/reset | `src/styles/global.css`: reset, base typography, body grid texture. | 2.1 | 🟢 Completed | AGENT |
| 2.3 | Self-host fonts | Self-hosted via Fontsource variable fonts (`@fontsource-variable/inter`, `@fontsource-variable/pixelify-sans`), imported in BaseLayout; families wired into tokens. | 2.2 | 🟢 Completed | AGENT |

## Phase 3 — Shell (DRY)
Build the single layout, nav, footer, and SEO used by every page.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 3.1 | Migrate brand assets | Move prototype logo SVGs → `src/assets/images/brand/`. | 1.1 | 🟢 Completed | AGENT |
| 3.2 | seo.json + Seo.astro | `src/data/seo.json` (defaults + standalone pages) and `Seo.astro` emitting title/meta/OG/Twitter with the resolution chain. | 1.2 | 🟢 Completed | AGENT |
| 3.3 | Nav component | One `Nav.astro`: overlay over hero, solid on scroll; Games / Contact (mailto) / Privacy. | 2.2, 3.1 | 🟢 Completed | AGENT |
| 3.4 | Footer component | One `Footer.astro`: red bg, centered two-tone logo, links + copyright. | 2.2, 3.1 | 🟢 Completed | AGENT |
| 3.5 | BaseLayout | `BaseLayout.astro` composing `<head>` + Seo + Nav + `<slot/>` + Footer; used by every page. | 3.2, 3.3, 3.4 | 🟢 Completed | AGENT |

## Phase 4 — Content Engine
Define the data model, validation, and migrate v1 game content + images.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 4.1 | Content collections config | `src/content.config.ts`: `games` + `gamePrivacy` glob collections with zod schemas (title, blurb, thumbnail, availableOn[], optional seo). | 1.1 | 🟢 Completed | AGENT |
| 4.2 | Image resolution helper | `import.meta.glob` map resolving `src/assets/images/games/<slug>/` by convention (slug + filename). | 4.1 | 🟢 Completed | AGENT |
| 4.3 | Migrate game images | Place 1000×1000 thumbnails into `src/assets/images/games/sagitta-chains/` and `/galactic-invaders/`. | 4.2 | 🟢 Completed | AGENT |
| 4.4 | Author game entries | `game.md` for Sagitta Chains (Apple App Store) and Galactic Invaders (Web) with correct `availableOn`. | 4.1, 4.3 | 🟢 Completed | AGENT |
| 4.5 | carousel.json + validation | `src/data/carousel.json` (ordered slugs) + a build-time check that every slug resolves to a game. | 4.4 | 🟢 Completed | AGENT |

## Phase 5 — Home Page
Assemble the home page to pixel-match the prototype.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 5.1 | Platform buttons | `PlatformButtons`/`PlatformButton` + `PLATFORMS` lookup (web, apple-app-store now; google-play, steam scaffolded). | 4.4 | 🟢 Completed | AGENT |
| 5.2 | Hero carousel | `HeroCarousel.astro` from `carousel.json`: foreground `<Image>` + blurred `.hero-bg` backdrop + scrim, chevrons, dots. | 4.5, 5.1, 3.5 | 🟢 Completed | AGENT |
| 5.3 | Carousel + nav JS | Vanilla JS: autoplay, prev/next, dots, pause-on-hover, nav-solid-on-scroll, `prefers-reduced-motion`. | 5.2, 3.3 | 🟢 Completed | AGENT |
| 5.4 | Games showcase | "The Games" section rendering each game as a `GameCard` (art, blurb, platform buttons). | 5.1, 4.4 | 🟢 Completed | AGENT |
| 5.5 | Scroll reveals | Port reveal-on-scroll behavior, reduced-motion aware. | 5.3 | 🟢 Completed | AGENT |
| 5.6 | Assemble index.astro | Compose hero + showcase + mailto contact in `src/pages/index.astro` via BaseLayout; verify parity with prototype. | 5.2, 5.4, 5.5 | 🟢 Completed | AGENT |

## Phase 6 — Privacy System
Shared privacy template, studio policy, and per-game policies.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 6.1 | PrivacyLayout | Shared `PrivacyLayout` (title + rendered markdown body in the design system) used by both privacy page types. | 3.5 | 🟢 Completed | AGENT |
| 6.2 | Draft studio privacy | Draft a standard indie-studio privacy policy → `src/content/pages/privacy.md`; USER reviews. | 6.1 | 🟢 Completed (USER to review) | AGENT |
| 6.3 | Studio /privacy page | `src/pages/privacy.astro` rendering the studio policy through PrivacyLayout. | 6.1, 6.2 | 🟢 Completed | AGENT |
| 6.4 | Migrate Sagitta policy | Fetch + faithfully port the Sagitta Chains policy from iBuildWith.ai into `src/content/games/sagitta-chains/privacy.md`. | 4.1 | 🟢 Completed | AGENT |
| 6.5 | Per-game privacy route | `src/pages/games/[slug]/privacy.astro` via `getStaticPaths` over `gamePrivacy`; renders only for games that have a `privacy.md`. | 6.1, 6.4 | 🟢 Completed | AGENT |

## Phase 7 — SEO, Polish & Docs
Favicon, share tags, accessibility, and the README.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 7.1 | Favicon | Add favicon (from brand mark) in `public/`, wired in BaseLayout. | 3.5 | 🟢 Completed | AGENT |
| 7.2 | OG/meta + per-page SEO | Fill `seo.json` defaults + page entries; verify OG/Twitter output on all routes. Branded 1200×630 OG image generated. | 3.2, 5.6, 6.3 | 🟢 Completed | AGENT |
| 7.3 | Accessibility pass | Verify aria-labels, chevron halos, reduced-motion, color contrast. Also: `astro check` passes with 0 errors/warnings/hints. | 5.6 | 🟢 Completed | AGENT |
| 7.4 | README + version pill | Repo `README.md`: overview, local-dev/deploy notes, and a version badge (brand-red `version-1.0.0`). | 1.1 | 🟢 Completed | AGENT |

## Phase 8 — Deploy & Verify
Ship to GitHub Pages and validate the maintainer workflow.

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| 8.1 | CNAME | `public/CNAME` = `redpillbluepillstudios.com`. | 1.2 | 🟢 Completed | AGENT |
| 8.2 | Deploy workflow | `.github/workflows/deploy.yml`: official Pages flow (checkout@v6 → withastro/action@v6 → deploy-pages@v5) on push to `main`. | 1.1 | 🟢 Completed | AGENT |
| 8.3 | DNS + Pages settings | USER: set apex DNS (A/AAAA) + `www` CNAME, set Pages source = GitHub Actions, enforce HTTPS. | 8.1, 8.2 | 🔴 Not Started (USER) | USER |
| 8.4 | Production verify | Confirm live site matches prototype; both games, carousel, privacy pages, SEO all correct on the domain. | 8.2, 8.3 | 🔴 Not Started (after deploy) | AGENT |
| 8.5 | Add-a-game verification | Verified end-to-end: a throwaway game folder appeared in the showcase with no code changes; no `privacy.md` → no privacy route; Steam platform button rendered from the lookup. | 4.5, 5.4 | 🟢 Completed | AGENT |
