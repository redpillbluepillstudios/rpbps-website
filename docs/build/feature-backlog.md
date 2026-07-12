# Feature Backlog

This document lists features and enhancements derived from the plan. It is a living document that will evolve throughout the project. It is grouped by version, with the Backlog tracking all features not added to a version yet.  It is used to create versions to work on.

| Status |  | Priority |  |
|--------|-------------|---------|-------------|
| 🔴 | Not Started | High | High priority items |
| 🟡 | In Progress | Medium | Medium priority items |
| 🟢 | Completed | Low | Low priority items |


## Backlog

| #  | Feature             | Description                               | Source |
|----|---------------------|-------------------------------------------|--------|
| B1 | Web analytics | Add privacy-friendly web analytics to track traffic and store click-throughs. Deferred from v1. | Agent |
| B2 | Individual game detail pages | Dedicated landing page per game (beyond the privacy child) with fuller content, screenshots, etc. Out of scope for v1 (games link out). | Agent |
| B3 | Contact form | Optional replacement for the mailto link if a form is ever wanted. Dropped in v1 per prototype findings. | Agent |

## Version 1.1.0 - 🟡 In Progress
Unify all product privacy policies under a single `/apps/<slug>/privacy` namespace and add the first non-game (Utility) app's privacy page. Migrates the existing game privacy to the new scheme, keeps the live App Store link working via a redirect, and lays the `apps` content foundation for the upcoming Utility category and home-page section. Studio `/privacy` is unchanged.

_Delivered in passes within this same version. **Pass 1** (features 1–6): `apps` rename + privacy URL infrastructure + TipTable Pro privacy stub — commit & publish now so App Store Connect has a working privacy URL; version left **In Progress**. **Pass 2** (features 7–9, later): Utility category, full TipTable Pro app, and its home-page section. The version is **completed only once the full TipTable Pro app is live.**_

| ID  | Feature                      | Description                              | Priority | Status |
|-----|------------------------------|------------------------------------------|----------|--------|
| 1 | Unified `/apps/<slug>/privacy` route | One `src/pages/apps/[slug]/privacy.astro` renders privacy for both games and apps through the shared `PrivacyLayout`; build-time check that slugs are unique across all products. | High | 🔴 Not Started |
| 2 | `appPrivacy` content collection | New collection at `src/content/apps/<slug>/privacy.md` mirroring `gamePrivacy`; the app folder later holds the full app content when the app is built. | High | 🔴 Not Started |
| 3 | Migrate game privacy to `/apps` | Existing Sagitta Chains policy renders at `/apps/sagitta-chains/privacy` under the new scheme. | High | 🔴 Not Started |
| 4 | Legacy privacy redirect | Redirect stub at the old `/games/<slug>/privacy` → new `/apps/<slug>/privacy` (meta-refresh + canonical) so the **live** Sagitta Chains App Store privacy link doesn't 404. | High | 🔴 Not Started |
| 5 | TipTable Pro privacy stub | Stub `privacy.md` for TipTable Pro (slug `tiptable-pro`) at `/apps/tiptable-pro/privacy` with placeholder body for the owner to replace. | High | 🔴 Not Started |
| 6 | Local verify (Pass 1) | `npm run dev` + `npm run build`/`preview`: confirm the home page renders identically and all privacy routes + the legacy redirect resolve. | Medium | 🔴 Not Started |
| 7 | Utility category (Pass 2) | Formal `category` field (`game`\|`utility`) on the apps schema; TipTable Pro is the first `Utility`. | High | 🟢 Built (deploy pending approval) |
| 8 | Full TipTable Pro app (Pass 2) | TipTable Pro `app.md` (title, blurb, tag, thumbnail, App Store `availableOn`) + carousel slot #2. | High | 🟢 Built (deploy pending approval) |
| 9 | Utilities home-page section (Pass 2) | New "Utilities" home section (blue icon) beside "Games"; category-aware carousel eyebrow; Utilities nav/footer links. | High | 🟢 Built (deploy pending approval) |

## Version 1.0.0 - 🟢 Completed
The faithful Astro rebuild of the prototype: data-driven games showcase, carousel, studio + per-game privacy pages, SEO, and automated GitHub Pages deploy to redpillbluepillstudios.com.

| ID  | Feature                 | Description                              | Priority | Status |
|-----|-------------------------|------------------------------------------|----------|--------|
| 1 | Astro project scaffold | Scaffold Astro at repo root, pin latest-stable deps (no pre-releases), configure `site: https://redpillbluepillstudios.com` and `base: '/'`. | High | 🔴 Not Started |
| 2 | Design tokens | Port the prototype `:root` custom properties into `src/styles/tokens.css` + a `global.css` base. | High | 🔴 Not Started |
| 3 | Fonts (pixel display + body) | Set up Pixelify Sans (display) + Inter (body) exactly as the prototype, keeping the pixel look crisp. | High | 🔴 Not Started |
| 4 | Base layout shell (DRY) | Single `BaseLayout.astro` owning `<head>`, SEO, and the Nav/Footer wrapper — used by every page. | High | 🔴 Not Started |
| 5 | Nav component (single) | One `Nav.astro`: transparent over hero, solid on scroll; Games / Contact (mailto) / Privacy links. | High | 🔴 Not Started |
| 6 | Footer component (single) | One `Footer.astro`: red background, centered two-tone SVG logo, compact links + copyright. | High | 🔴 Not Started |
| 7 | SEO component + seo.json | `Seo.astro` emitting title/meta/OG/Twitter; `src/data/seo.json` for global defaults + standalone-page SEO with resolution chain. | High | 🔴 Not Started |
| 8 | Games content collection + schema | `src/content/games/<slug>/` collection with validated schema (title, blurb, 1000×1000 thumbnail, availableOn[], optional seo). Build fails on malformed entries. | High | 🔴 Not Started |
| 9 | Carousel data + validation | `src/data/carousel.json` ordered slug list drives the carousel; build validates every slug resolves to a real game. | High | 🔴 Not Started |
| 10 | Asset migration | Move prototype brand SVGs → `src/assets/images/brand/` and game 1000×1000 thumbnails → `src/assets/images/games/<slug>/`. | High | 🔴 Not Started |
| 11 | Author v1 game content | `game.md` for Sagitta Chains (Apple App Store) and Galactic Invaders (Web) with correct `availableOn`. | High | 🔴 Not Started |
| 12 | Platform buttons | `PlatformButtons`/`PlatformButton` rendering `availableOn[]` via a single platform→icon+label lookup (web, App Store, Google Play, Steam, extensible). | High | 🔴 Not Started |
| 13 | Hero carousel | `HeroCarousel.astro` from `carousel.json`: foreground art + blurred backdrop (`blur(34px) saturate(1.15) scale(1.2)` + scrim), edge chevrons, dots; vanilla-JS autoplay, pause-on-hover, reduced-motion. | High | 🔴 Not Started |
| 14 | Games showcase section | "The Games" section rendering every game as a `GameCard` (art, blurb, platform buttons). | High | 🔴 Not Started |
| 15 | Home page assembly | `/` composing hero carousel + showcase + mailto contact, pixel-matching the prototype. | High | 🔴 Not Started |
| 16 | Scroll interactions | Port scroll reveals and nav-solid-on-scroll from the prototype `script.js`, honoring `prefers-reduced-motion`. | Medium | 🔴 Not Started |
| 17 | Privacy layout (shared) | One `PrivacyLayout` template used by both studio and per-game privacy pages. | High | 🔴 Not Started |
| 18 | Studio privacy page | `/privacy` studio-level policy authored and rendered through the design system. | High | 🔴 Not Started |
| 19 | Per-game privacy + migration | Dynamic `/games/[slug]/privacy` generated when a game has `privacy.md`; migrate Sagitta Chains policy from iBuildWith.ai. | High | 🔴 Not Started |
| 20 | Favicon + SEO polish | Favicon plus Open Graph/meta across all pages; per-page overrides. | Medium | 🔴 Not Started |
| 21 | Local dev/testing | Verify `npm run dev` (hot reload) and `npm run build`/`preview` run the full site locally. | High | 🔴 Not Started |
| 22 | GitHub Pages deploy | `public/CNAME`, `.github/workflows/deploy.yml` building + deploying on push to `main`; verify custom-domain paths. | High | 🔴 Not Started |
| 23 | Add-a-game verification | Confirm end-to-end that adding a game = add content folder + images + one carousel line, no code changes. | High | 🔴 Not Started |
| 24 | README + version pill | Create repo `README.md` with project overview and a version badge/pill reflecting the current version (1.0.0). | Medium | 🔴 Not Started |
