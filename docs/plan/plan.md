# Product Implementation Plan
This document defines how the product will be built and when.

## Section Explanations
| Section                  | Overview |
|--------------------------|--------------------------|
| Overview                 | A brief recap of what we're building and the current state of the PRD. |
| Architecture             | High-level technical decisions and structure (e.g., frontend/backend split, frameworks, storage). |
| Components               | Major parts of the system and their roles. Think modular: what pieces are needed to make it work. |
| Data Model               | What data structures or models are needed. Keep it conceptual unless structure is critical. |
| Major Technical Steps    | High-level implementation tasks that guide development. Not detailed coding steps. |
| Tools & Services         | External tools, APIs, libraries, or platforms this app will depend on. |
| Risks & Unknowns         | Technical or project-related risks, open questions, or blockers that need attention. |
| Milestones    | Key implementation checkpoints or phases to show progress. |
| Environment Setup | Prerequisites or steps to get the app running in a local/dev environment. |

## Overview
Build the production **Red Pill Blue Pill Studios** website as a static, data-driven **Astro** site that faithfully reproduces the existing prototype's design, is trivial for a solo owner to maintain (add a game = add content + images + one carousel line), and auto-deploys to **GitHub Pages** at **redpillbluepillstudios.com**. The PRD is approved; this plan defines the architecture, structure, and build sequence.

## Architecture
**Type:** Static site (SSG). No server, no database, no runtime backend — everything renders to static HTML/CSS/JS at build time and is served by GitHub Pages.

**Framework:** **Astro** (latest stable release — pinned to exact current stable versions at install time; **no pre-releases, no outdated versions**). Astro's content collections + image pipeline are the backbone of the data-driven model.

**Design fidelity:** The site must match the prototype **exactly**. The prototype's `:root` CSS custom properties are the design tokens and carry over verbatim into a single global stylesheet; the prototype's inline styles are refactored into **component-scoped styles / shared classes** (DRY), not copied inline.

**Rendering model:** All pages are statically generated. Game pages and per-game privacy pages are generated from the content collection via Astro's dynamic routes (`getStaticPaths`). Interactive bits (carousel, scroll reveals, nav-solid-on-scroll) are small **vanilla JS** islands/scripts ported from the prototype's `script.js`, preserving autoplay, arrows, dots, pause-on-hover, and `prefers-reduced-motion`.

**Proposed folder structure (organization is a first-class requirement):**
```
/                              (repo root)
├─ astro.config.mjs            (site: https://redpillbluepillstudios.com, base: '/')
├─ package.json
├─ CNAME  →  public/CNAME      (custom domain for GitHub Pages)
├─ .github/workflows/deploy.yml (build + deploy on push to main)
├─ public/
│   ├─ CNAME
│   ├─ favicon.svg
│   └─ fonts/                  (self-hosted Pixelify Sans + Inter — see Risks)
├─ src/
│   ├─ assets/
│   │   └─ images/             ← CENTRAL image tree, organized by subfolder
│   │       ├─ brand/          (logo.svg, logo-white.svg, logo-mark.svg, logo-footer.svg, logo-horizontal.svg)
│   │       ├─ ui/             (textures, shared icons if any)
│   │       └─ games/
│   │           ├─ sagitta-chains/     (cover.png, screenshots…)
│   │           └─ galactic-invaders/  (cover.png, screenshots…)
│   ├─ content/
│   │   ├─ games/              ← game DATA only (no images)
│   │   │   ├─ sagitta-chains/       (game.md, privacy.md)
│   │   │   └─ galactic-invaders/    (game.md)      ← no privacy.md yet = no privacy route
│   │   └─ config.ts           (content collection schema + validation)
│   ├─ data/
│   │   ├─ carousel.json       (ordered list of game slugs → the carousel)
│   │   └─ seo.json            (global SEO defaults + standalone-page SEO)
│   ├─ styles/
│   │   └─ tokens.css          (:root design tokens from the prototype) + global.css
│   ├─ layouts/
│   │   └─ BaseLayout.astro    (single <head>/SEO, Nav + Footer wrapper — used by every page)
│   ├─ components/
│   │   ├─ Nav.astro           (ONE nav, overlay→solid on scroll)
│   │   ├─ Footer.astro        (ONE footer, red, two-tone logo, mailto)
│   │   ├─ Seo.astro           (renders meta/OG/Twitter from resolved SEO)
│   │   ├─ HeroCarousel.astro  (featured games)
│   │   ├─ GameCard.astro      (showcase card)
│   │   ├─ PlatformButtons.astro (renders availableOn[])
│   │   ├─ PlatformButton.astro  (single platform → icon + label)
│   │   └─ PrivacyLayout.astro   (shared template for studio + game privacy pages)
│   └─ pages/
│       ├─ index.astro                    (/)
│       ├─ privacy.astro                  (/privacy — studio policy)
│       └─ games/[slug]/privacy.astro     (/games/<slug>/privacy — per-game policy)
└─ docs/ …                     (Cody project workspace; not shipped)
```

## Components
- **BaseLayout.astro** — the single source of the page shell: `<head>`, SEO component, Nav, `<slot/>`, Footer. Every page uses it, so nav/footer/head exist **once** (DRY).
- **Nav.astro** — one navigation component; transparent over hero, `.is-solid` on scroll (ported behavior). Links: Games, Contact (mailto), Privacy.
- **Footer.astro** — one footer component; red background, centered two-tone logo, compact links + copyright.
- **Seo.astro** — resolves and emits `<title>`, meta description, Open Graph, Twitter tags from the SEO resolution chain (page/game `seo` → `seo.json` defaults).
- **HeroCarousel.astro** — reads `carousel.json`, resolves each slug to its game, renders slides (blurred art backdrop, edge chevrons, dots); paired with a small vanilla-JS controller (autoplay, pause-on-hover, reduced-motion).
- **GameCard.astro** — renders a game in "The Games" showcase from a game entry (art, blurb, platform buttons).
- **PlatformButtons.astro / PlatformButton.astro** — map a game's `availableOn[]` to buttons; a single lookup table maps `platform` → icon + label (add a platform in one place).
- **PrivacyLayout.astro** — one shared privacy template used by both `/privacy` and `/games/<slug>/privacy` (DRY — a privacy page is title + rendered markdown body in the design system).
- **Content schema (`src/content/config.ts`)** — defines and validates the `games` collection and the `carousel`/`seo` data shapes; malformed content fails the build.
- **GitHub Actions workflow** — builds Astro and deploys to Pages on push to `main`.

## Data Model
**`games` collection — `src/content/games/<slug>/game.md` frontmatter:**
- `title` (string, required) — display name.
- `blurb` (string, required) — display description (home card / carousel).
- `thumbnail` (image, required) — a single **1000×1000** image per game, referenced from `src/assets/images/games/<slug>/`. This one image does triple duty (matching the prototype): the showcase card art, the carousel **foreground art** (`.hero-art`, ~320px), and the carousel **blurred backdrop** (`.hero-bg`: `background-size:cover`, `blur(34px) saturate(1.15) scale(1.2)` behind a scrim). No separate cover/screenshots for v1.
- `availableOn` (array, required, ≥1) — each `{ platform: enum(web|apple-app-store|google-play|steam|…), url: string }`.
- `seo` (object, optional) — `{ title?, description?, image? }`; overrides for SEO only, falls back to `seo.json` defaults (never silently reuses display fields).
- Body (markdown, optional) — long-form game copy if ever needed.
- **Note:** no `featured`/`featuredOrder` field — carousel membership lives only in `carousel.json`.

**Per-game privacy — `src/content/games/<slug>/privacy.md`:** optional. Presence generates `/games/<slug>/privacy`; absence means no route. Frontmatter: `title`, optional `updated` date; body is the policy.

**`carousel.json` — `src/data/carousel.json`:** ordered array of game slugs, e.g. `["sagitta-chains", "galactic-invaders"]`. Order = display order. Build validates every slug resolves to a real game.

**`seo.json` — `src/data/seo.json`:** `{ defaults: { siteName, description, image, … }, pages: { "/": {…}, "/privacy": {…} } }`.

**Studio privacy page:** authored as a standalone page (content/markdown) rendered through `PrivacyLayout` — not part of the games collection.

## Major Technical Steps
1. **Scaffold Astro project** at repo root with latest stable Astro; pin exact stable versions of all deps; wire `astro.config.mjs` (`site`, `base: '/'`).
2. **Port design tokens**: copy the prototype `:root` variables into `src/styles/tokens.css`; establish `global.css` and the base typography (Pixelify Sans display + Inter body) — matching the prototype's pixel setup.
3. **Set up fonts** self-hosted in `public/fonts/` (see Risks) with the same families/weights the prototype loaded, or Google Fonts if we accept the external dependency — decision recorded in Environment Setup.
4. **Build the shell** (DRY): `BaseLayout`, single `Nav`, single `Footer`, `Seo` component + `seo.json` resolution.
5. **Define content collection + schema** (`games`) and the `carousel.json` / `seo.json` shapes with validation.
6. **Migrate assets**: move prototype logo SVGs → `src/assets/images/brand/`, game images → `src/assets/images/games/<slug>/`.
7. **Author v1 game content**: `game.md` for Sagitta Chains (Apple App Store) and Galactic Invaders (Web), with correct `availableOn`.
8. **Build the home page**: `HeroCarousel` (from `carousel.json`) + "The Games" showcase (`GameCard` + `PlatformButtons`) + mailto contact, pixel-perfect to the prototype.
9. **Port interactions**: carousel controller, scroll reveals, nav-solid-on-scroll as vanilla JS, honoring `prefers-reduced-motion`.
10. **Build privacy system**: `PrivacyLayout`, studio `/privacy`, dynamic `/games/[slug]/privacy`; **migrate the Sagitta Chains policy** from https://ibuildwith.ai/privacy-policies/privacy-policy-sagitta-chains/ into `sagitta-chains/privacy.md`. Author the studio privacy policy.
11. **SEO + favicon**: favicon, global OG/meta via `Seo.astro`, per-page overrides.
12. **GitHub Pages deploy**: `public/CNAME`, `.github/workflows/deploy.yml` (build + deploy on push to `main`); verify custom-domain build paths.
13. **Verify** against the prototype (visual parity) and validate the "add a game = add a folder + carousel line" workflow end-to-end.

## Tools & Services
- **Astro** (latest stable) — SSG framework, content collections, image optimization.
- **Node.js LTS + npm** — toolchain (exact stable versions recorded at setup).
- **Pixelify Sans + Inter** — fonts (self-hosted or Google Fonts; see Risks).
- **GitHub** — repository, **GitHub Pages** (hosting), **GitHub Actions** (CI/CD, auto-deploy on push to `main`).
- **Custom domain** — redpillbluepillstudios.com (DNS → GitHub Pages; `CNAME`).
- **Prototype** (`docs/prototypes/rpbp-studios-website/`) — design + content + asset source of truth.
- **Existing Sagitta Chains privacy page** — content source for migration.

## Risks & Unknowns
- **Exact latest-stable versions**: to be resolved at install time (`npm install astro@latest` etc.), then pinned; confirm no pre-release/`next` tags slip in. Record the locked versions in Environment Setup + best-practices.
- **Fonts**: the prototype used **Google Fonts** for Pixelify Sans + Inter. For privacy/perf and offline builds, **self-hosting** is preferable; risk is matching the exact families/weights/rendering (pixel look must stay crisp). Decision to be confirmed in build.
- **Custom-domain paths on GitHub Pages**: with an apex domain, `base` must be `/` (not `/repo/`); getting `site`/`base` wrong breaks asset/links. DNS (apex A/ALIAS + `CNAME`) must be configured by the owner.
- **Image optimization vs. SVG logos**: SVGs pass through; raster game art goes through Astro's image pipeline — verify no quality/pixelation regressions vs. prototype.
- **Privacy content migration**: the external Sagitta Chains policy must be copied faithfully (legal text) — needs fetch + review, not paraphrase.
- **Carousel/reveal JS parity**: re-porting to components must preserve exact behavior (autoplay timing, reduced-motion, chevron halos).

## Milestones
1. **M1 — Project skeleton**: Astro scaffolded, deps pinned, tokens + fonts + global styles in, config set.
2. **M2 — Shell (DRY)**: BaseLayout + single Nav + single Footer + SEO/`seo.json` working on a blank page.
3. **M3 — Content engine**: `games` collection + schema + `carousel.json`/`seo.json`; assets migrated; v1 game entries authored.
4. **M4 — Home page**: carousel + showcase + platform buttons + interactions, visually matching the prototype.
5. **M5 — Privacy system**: studio `/privacy` + dynamic per-game privacy; Sagitta Chains policy migrated.
6. **M6 — SEO/polish**: favicon, OG/meta, reduced-motion, accessibility pass.
7. **M7 — Deploy**: CNAME + GitHub Actions; live on redpillbluepillstudios.com; add-a-game workflow verified.

## Environment Setup
- **Prerequisites**: Node.js LTS + npm; the local git repo (already created); GitHub repo + Pages enabled; DNS control for redpillbluepillstudios.com.
- **Scaffold**: create the Astro project at repo root; install latest stable Astro and deps; commit a lockfile with pinned versions.
- **Config**: set `site: 'https://redpillbluepillstudios.com'`, `base: '/'` in `astro.config.mjs`; add `public/CNAME` with the domain.
- **Fonts**: place chosen font files in `public/fonts/` (or wire Google Fonts) matching the prototype's families/weights.
- **Run locally (required for testing)**: `npm install` → `npm run dev` serves the full site at `localhost` with hot reload for local testing before any deploy; `npm run build` then `npm run preview` to test the production build locally.
- **Deploy**: push to `main` → GitHub Actions builds and publishes to Pages; configure Pages to serve from the Actions artifact and the custom domain.
