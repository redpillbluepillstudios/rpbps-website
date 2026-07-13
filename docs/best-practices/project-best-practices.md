# Project Best Practices
The project's living record of best practices learned while building it. Cody writes to this file after every build (version or patch) and reads it during every build, so the project follows its own standards as it grows.

_How to use this file (for the **AGENT**):_
- _Each entry is a single rule plus a one-line why, e.g. `- Keep command files short. **Why:** long files get skimmed and steps skipped.`_
- _Keep it lean and current. When a new learning contradicts an existing rule, change or remove the old rule rather than appending a second one. This file is the project's bible, not an append-only log._
- _Categories below are a starter set, not a fixed schema. Add categories the project needs and remove starter categories that stay empty or do not apply._
- _No version tags on entries._

## Architecture
- Only `src/pages/` is required; keep the conventional dirs (`components`, `layouts`, `styles`, `assets`, `content`) and `src/content.config.ts` at the root of `src`. **Why:** matches Astro's documented structure so the project is predictable to anyone who knows Astro.
- Render the page shell (`<head>`, nav, footer, SEO) once in a single `BaseLayout` that every page uses. **Why:** DRY — nav/footer/head exist in exactly one place and can't drift.
- Ship zero client JS by default; add JS only for genuinely interactive islands (carousel, nav-on-scroll). **Why:** Astro's speed comes from static HTML — JS only where interactivity is real.
- Define content collections in `src/content.config.ts` with the `glob()` loader and validate every entry with a zod schema. **Why:** build-time validation + type safety means malformed content fails the build instead of shipping broken.
- Every product is an **app** in the `apps` collection (`src/content/apps/<slug>/app.md`) with a required `category` (`game` | `utility`); a game is a *category*, not a separate model. Home sections and future product types key off `category`. **Why:** one model scales to any product type without a parallel tree.
- Unify all product privacy under `/apps/<slug>/privacy` — one `pages/apps/[slug]/privacy.astro` over the `appPrivacy` collection — and keep a small static redirect for any legacy URL that's live externally. **Why:** one privacy namespace; external links (e.g. App Store) never 404 when structure changes.

## Code & Style
- Write pages/UI as `.astro` components with component-scoped `<style>`; keep all design tokens as CSS custom properties in one stylesheet (`src/styles/tokens.css`). **Why:** no repeated inline styles; re-theming is a one-file change.
- Query content with `getCollection()` / `getEntry()`; render bodies via `render(entry)` → `<Content />`. **Why:** the current (Astro 5+/7) content API; avoids deprecated patterns.
- Generate dynamic routes with `getStaticPaths()` keyed by the entry `id` (the folder slug). **Why:** static, predictable URLs derived directly from content.
- Optimize raster images through Astro's `<Image>` / `src/assets` pipeline; put only unprocessed assets (fonts, favicon, `robots.txt`, `CNAME`) in `public/`. **Why:** automatic optimization for content images, untouched passthrough for the rest. (Pipeline images get hashed `/_astro/…` URLs — for a *stable* shareable image URL, put that file in `public/`.)
- Reference a platform's URL from `availableOn` rather than duplicating it (e.g. `thumbnailLink` names a platform, validated by a zod `.refine()` to exist in `availableOn`). **Why:** one source of truth; a typo fails the build instead of shipping a dead link.
- Format content dates in UTC: `date.toLocaleDateString('en-US', { …, timeZone: 'UTC' })`. **Why:** a date-only frontmatter value (`2026-07-11`) parses as UTC midnight, so formatting in the build machine's local timezone renders it a day early.

## Responsive & Mobile
- One breakpoint for the home-layout flip: **820px** — nav, hero, cards, section, and footer all switch to mobile together. Finer refinements (hero arrows hidden <560, privacy title <600) are the deliberate exceptions. **Why:** independently-authored breakpoints created a half-mobile in-between zone.
- A CSS grid item with `max-width` + `margin: 0 auto` also needs `width: 100%`, or it collapses to its content width. **Why:** shipped a mobile bug where card art shrank to the fallback letter until `width: 100%` was added.
- Mobile nav = hamburger → full-screen menu: pill mark (`logo-mark.svg`) in the bar, full stacked logo + links in the menu; toggle logic in `nav.ts` (close on Escape / link-tap / resize-to-desktop, lock body scroll, set `aria-expanded`). **Why:** inline links overlap the logo on phones.

## Content & Copy
- Product store copy must match the app's App Store `listing.md`: describe only shipping (free-tier) features, never IAP-gated ones, and use **no em-dashes** (owner preference). **Why:** advertising inaccessible features risks App Review rejection; consistency with the live listing.

## Testing
- Test locally with `npm run dev` (hot reload), then `npm run build` + `npm run preview` to exercise the real production build before deploying. **Why:** the static build can surface issues (asset paths, base URL) that dev does not.
- Astro **inlines small client scripts** into the page HTML (no external `.js` emitted); verify client logic by grepping the built HTML, not `dist/_astro/*.js`. **Why:** wasted a verification pass looking for a JS bundle that didn't exist. (`preview` only serves the last `build` — content edits need a rebuild; `dev` hot-reloads.)

## Tooling & Dependencies
- Pin exact latest-stable versions — no `next`/`rc`/`beta`/`alpha` tags, no stale majors — and commit the lockfile. **Why:** reproducible builds; "latest stable" is an explicit project requirement. (Current baseline: Astro 7.x, Node 24.x LTS-line, sharp 0.35.x.)

## Workflow & Process
- Build static (`output: 'static'`) and deploy to GitHub Pages via the official Actions flow (`actions/configure-pages` → `withastro/action` → `actions/upload-pages-artifact` → `actions/deploy-pages`) on push to `main`. **Why:** the supported, no-token path for Astro on Pages.
- For an apex custom domain: set `site` to the apex URL, `base: '/'`, and put `CNAME` in `public/`; make the apex the primary domain, add a `www` CNAME → `<user>.github.io`, and enforce HTTPS. GitHub then auto-redirects `www` → apex. Canonical URLs = apex. **Why:** apex is the single canonical host; wrong `base` breaks every asset URL.
- First-deploy order for Pages + custom domain: push → enable Pages with **Source = GitHub Actions** → wait for the **DNS check to go green** → then run the deploy. **Why:** deploys attempted before Pages is enabled 404, and before the domain is verified fail with "deployment failed, try again later" — neither is a code problem; sequencing avoids the failed runs.

## Gotchas
- When images live in a central tree (not co-located with the markdown), the collection `image()` schema helper does not resolve them; use `import.meta.glob('/src/assets/images/**/*.{png,jpg,webp}')` keyed by convention (slug + filename) instead. **Why:** `image()` only resolves paths relative to the content entry.
- Use `base: '/'` for apex-domain Pages sites, never `/repo-name/`. **Why:** the repo-subpath base is only for `*.github.io/repo` project sites and will break asset/link URLs on a custom domain.
- This is a **project repo** (not `<user>.github.io`), so the custom domain is what enables root-path serving — do **not** "Remove custom domain" to unblock a stuck deploy. **Why:** without it GitHub serves at `/red-pill-blue-pill-studios/` and `base: '/'` breaks every asset path. GitHub's own DNS check also lags behind real propagation (confirmed live via `dig` while GitHub still showed "in progress") — wait for its green check, don't tear down config.
- Respect `prefers-reduced-motion` in any JS animation (carousel autoplay, reveals). **Why:** accessibility + it was an explicit prototype behavior.
- Astro 7's `astro dev` runs a **persistent background daemon**: its errors go to `astro dev logs` (not the terminal), and a long-lived instance can hold a **stale content store** if `content.config.ts` or content is added/changed after it started. Restart with `astro dev stop` + `astro dev` (or delete `.astro/`) when collections change; symptom is a flickering error overlay with "collection … does not exist or is empty". **Why:** this exact staleness caused a phantom "site won't load" that a fresh restart fixed — the production build was always fine.
