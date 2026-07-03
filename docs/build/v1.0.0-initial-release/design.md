# Version Design Document : v1.0.0 — initial release
Technical implementation and design guide for the upcoming version.

## 1. Features Summary
_Overview of features included in this version._

v1.0.0 is the initial public release: a faithful, data-driven Astro rebuild of the prototype, deployed to GitHub Pages at redpillbluepillstudios.com. It delivers the 24 backlog items for Version 1.0.0:

- **Foundation**: Astro scaffold + pinned deps; design tokens ported from the prototype `:root`; pixel fonts (Pixelify Sans + Inter); DRY shell (one `BaseLayout`, one `Nav`, one `Footer`); `Seo.astro` + `seo.json`.
- **Content engine**: validated `games` content collection (folder-per-game, data only); central `src/assets/images/` tree; `carousel.json` (ordered slugs); asset migration; v1 game entries (Sagitta Chains, Galactic Invaders).
- **Home page**: hero carousel (single 1000×1000 image as foreground art + blurred backdrop), "The Games" showcase, platform buttons (`availableOn[]`), scroll interactions — pixel-matching the prototype.
- **Privacy**: shared `PrivacyLayout`; studio `/privacy`; dynamic `/games/[slug]/privacy` with Sagitta Chains policy migrated from iBuildWith.ai.
- **Ship**: favicon + OG/meta; local dev/testing; GitHub Actions deploy + `CNAME`; add-a-game verification; `README.md` with a version pill.

## 2. Technical Architecture Overview
_High-level technical structure that supports all features in this version._

**Stack (latest stable, no pre-releases — verified against npm):**
- **Astro 7.0.6** (SSG; `output: 'static'`).
- **Node 24.x LTS-line** (local: 24.11.1), **npm 11.x** (local: 11.18.0).
- **sharp 0.35.3** for Astro's build-time image optimization.
- No UI framework, no DB, no server. Small vanilla-JS for interactions.
- Exact versions pinned in `package.json` + committed lockfile.

**Rendering & routing:**
- Fully static build (`astro build`) → served by GitHub Pages.
- `astro.config.mjs`: `site: 'https://redpillbluepillstudios.com'`, `base: '/'` (apex domain → root base), `output: 'static'`, `image` service = sharp.
- Pages: `src/pages/index.astro` (`/`), `src/pages/privacy.astro` (`/privacy`), `src/pages/games/[slug]/privacy.astro` (dynamic, via `getStaticPaths`).

**Content model (Astro Content Layer API — Astro 5+/7):**
- Collections defined in `src/content.config.ts` using the **glob loader**.
- **`games` collection**: `glob({ pattern: '**/game.md', base: './src/content/games' })`; entry `id` = the game's folder slug. Schema (zod) validates: `title`, `blurb`, `thumbnail` (string filename), `availableOn` (array of `{ platform: enum, url: string().url() }`, min 1), optional `seo` (`{ title?, description?, image? }`). No `featured` field.
- **`gamePrivacy` collection**: `glob({ pattern: '**/privacy.md', base: './src/content/games' })`; entry `id` = slug. Presence of a game's `privacy.md` is what generates its `/games/<slug>/privacy` route (`getStaticPaths` maps over this collection).
- Studio privacy authored as `src/content/pages/privacy.md` (its own tiny `pages` collection or a direct import) rendered through `PrivacyLayout`.

**Image resolution (images are CENTRAL, not co-located):**
- Because game images live in `src/assets/images/games/<slug>/` (not next to the markdown), the content-collection `image()` schema helper is **not** used for them. Instead a build-time map resolves them: `import.meta.glob('/src/assets/images/games/**/*.{png,jpg,jpeg,webp}')`, keyed by slug + filename from the `thumbnail` field. This keeps images optimized by Astro's `<Image>` while living in the central tree.
- Brand SVGs (`src/assets/images/brand/*.svg`) are imported directly by components; SVG passes through un-rasterized.
- Convention: each game has exactly one 1000×1000 `thumbnail`; the same optimized asset feeds the showcase card, carousel foreground `<Image>`, and the CSS `background-image` for the blurred `.hero-bg` layer.

**Design system (DRY):**
- `src/styles/tokens.css` = the prototype `:root` variables verbatim (colors, fonts, lines). `src/styles/global.css` = base/reset + typography.
- Prototype inline styles are refactored into component-scoped `<style>` blocks / shared classes. No inline-style duplication.
- Shell rendered once: `BaseLayout.astro` owns `<head>` + `Seo` + `Nav` + `<slot/>` + `Footer`; every page uses it.

**Deployment:**
- `public/CNAME` = `redpillbluepillstudios.com`.
- `.github/workflows/deploy.yml`: on push to `main` → `withastro/action` (build) → `actions/deploy-pages` (publish), using the official GitHub Pages Actions flow (`actions/configure-pages`, `upload-pages-artifact`). Pages source set to "GitHub Actions" in repo settings.

## 3. Implementation Notes
_Shared technical considerations across all features in this version._

- **Fonts**: default to **self-hosting** Pixelify Sans + Inter under `public/fonts/` with `@font-face` in `global.css` (privacy + no external request + offline builds), matching the exact families/weights the prototype loaded (Pixelify Sans 400–700; Inter 400–800). Fallback stacks mirror the prototype tokens (`ui-monospace` for display, system sans for body) so the pixel look degrades gracefully. (If self-hosting proves fiddly, Google Fonts `<link>` is the documented fallback — decision recorded in the retrospective.)
- **Carousel**: `HeroCarousel.astro` reads `carousel.json`, resolves each slug against the `games` collection, and renders slides. A small vanilla-JS controller (ported from prototype `script.js`) handles autoplay, prev/next chevrons, dots, pause-on-hover, and respects `prefers-reduced-motion` (no autoplay / instant transitions when reduced). Blurred backdrop = `.hero-bg` with `filter: blur(34px) saturate(1.15); transform: scale(1.2)` + `.hero-scrim`, exactly as the prototype.
- **Platform buttons**: a single lookup (`PLATFORMS`) maps `platform` → `{ label, icon }` (inline SVG). `PlatformButtons` iterates `availableOn[]`; adding a platform type = one entry in the lookup. v1 icons: `apple-app-store` (Apple), `web` (globe); `google-play`, `steam` scaffolded for future use.
- **Validation as a guardrail**: zod schema fails the build on malformed game entries; carousel build step asserts every slug in `carousel.json` resolves to a real game (throws a clear error otherwise) so a typo can't ship a broken carousel.
- **SEO resolution chain (per field)**: page/game `seo.<field>` → `seo.json` `pages[route]` (standalone pages) → `seo.json` `defaults`. Never silently falls back to display copy. `Seo.astro` emits `<title>`, description, canonical, and OG/Twitter tags; absolute URLs built from `site`.
- **Privacy migration**: fetch the Sagitta Chains policy from https://ibuildwith.ai/privacy-policies/privacy-policy-sagitta-chains/ and port the text faithfully (legal content — copy, don't paraphrase) into `src/content/games/sagitta-chains/privacy.md`. Author the studio policy separately.
- **README + version pill**: `README.md` at repo root with a version badge. Use a static shields.io-style badge (`https://img.shields.io/badge/version-1.0.0-ed1c24`) using the brand red, plus overview, local-dev, and deploy notes.
- **Accessibility**: preserve the prototype's `aria-label`s on icon buttons and chevrons; keep the dark-halo on chevrons for contrast on any backdrop; reduced-motion honored.

## 4. Other Technical Considerations
_Shared any other technical information that might be relevant to building this version._

- **Apex domain on Pages**: `base: '/'` is required (not `/repo/`). DNS must point the apex to GitHub Pages (A/ALIAS records) and `www` optionally CNAME'd; the `CNAME` file must match. Owner action outside the build.
- **Trailing slash / links**: use Astro's `<a href>` with root-relative paths; verify internal links resolve under the apex domain build.
- **`.gitignore`**: `node_modules/`, `dist/`, `.astro/`.
- **Not shipped**: the `docs/` Cody workspace is content/planning only; ensure it's excluded from the site build (it lives outside `src/`/`public/`, so it is by default).
- **Deferred (Backlog, not this version)**: analytics, per-game detail pages, contact form.

## 5. Open Questions — RESOLVED
_All prior open questions are answered; recorded here for traceability._

- **Fonts** → **Self-host** Pixelify Sans + Inter under `public/fonts/` with `@font-face`, matching the prototype's families/weights exactly. If self-hosting can't faithfully match the prototype, fall back to Google Fonts `<link>` (same families). Either way, must match the prototype.
- **Studio privacy content** → **AGENT will draft** a standard indie-studio privacy policy for the USER's review during the build (USER does not have existing text).
- **`www` handling** → Follow best practice: **apex is canonical**, `site` = `https://redpillbluepillstudios.com`, `base: '/'`, `CNAME` in `public/`; add `www` CNAME → `<user>.github.io` and let GitHub auto-redirect `www` → apex; enforce HTTPS. (Captured in project best-practices.)
- **Domain** → Confirmed: `redpillbluepillstudios.com`.

**Coding standard for this version:** follow Astro best practices captured in `docs/best-practices/project-best-practices.md` (researched from official Astro docs + current guides): single `BaseLayout`, glob-loader content collections with zod validation, `getCollection`/`render`/`getStaticPaths`, `<Image>`/`src/assets` optimization with `public/` for unprocessed assets, minimal client JS, and the official GitHub Pages Actions deploy flow.
