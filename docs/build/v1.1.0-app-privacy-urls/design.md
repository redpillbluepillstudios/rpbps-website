# Version Design Document : v1.1.0 — app-privacy-urls
Technical implementation and design guide for the upcoming version.

## 1. Features Summary
_Overview of features included in this version._

This version moves the site to a single **"apps"** product model — everything the studio ships is an *app*, and a *game* is just an app with a `Game` **category**. It unifies all product privacy policies under `/apps/<slug>/privacy` and adds the first non-game (Utility) app, **TipTable Pro** (`tiptable-pro`), as a privacy-only stub the owner fills in later.

Features (from the feature backlog):
1. **Repo-wide `games` → `apps` rename** — folders, collections, content filename, image tree, routes, and all code identifiers move from "game(s)" to "app(s)". Games keep their category label in the markdown.
2. **Unified `/apps/<slug>/privacy` route** — one page renders every product's privacy policy through the shared `PrivacyLayout`.
3. **`appPrivacy` content collection** — every product's optional `privacy.md` under `src/content/apps/<slug>/`.
4. **Migrate Sagitta Chains privacy** to `/apps/sagitta-chains/privacy`.
5. **Legacy redirect** — a stub at old `/games/<slug>/privacy` that redirects to the new URL, protecting the **live** App Store link for Sagitta Chains.
6. **TipTable Pro privacy stub** at `/apps/tiptable-pro/privacy`.
7. **Local verify** — dev + production build; confirm the home page renders identically (carousel + showcase + images) and every privacy route + the redirect resolve.

**Kept as-is (games remain a category / display copy):** each app's `tag: "Game · …"` value; the "Games" nav + footer links, the `/#games` anchor, and the "The Games" home-page heading; the "indie game studio / Indie Games" SEO & marketing copy; the studio privacy wording. The rename is a code/structure change, not a content rewrite.

**Part of this version, but a later pass (not built in Pass 1):** a formal `category` model + the Utility category, the new home-page section for non-game apps, and the full TipTable Pro app (content, thumbnail, `availableOn`, home card). These are **in `v1.1.0`** — they are simply built after Pass 1, not deferred to a different version.

**Version stays open — delivered in passes.** **Pass 1 (this work):** the `apps` rename + privacy URL infrastructure + the TipTable Pro privacy stub — enough to commit, publish now, and set the Privacy Policy URL in App Store Connect. The version is left **In Progress** (no retrospective / release notes / version bump yet). **Pass 2 (later, same version):** the Utility category, the full TipTable Pro app, and the home-page section. The version is **completed only once the full TipTable Pro app is live.**

## 2. Technical Architecture Overview
_High-level technical structure that supports all features in this version._

**One product tree.** `src/content/games/` is renamed to `src/content/apps/`. Each product folder holds `app.md` (renamed from `game.md`) and an optional `privacy.md`. TipTable Pro is `src/content/apps/tiptable-pro/` with only `privacy.md` for now (the full `app.md` comes in Pass 2). Image assets move from `src/assets/images/games/` to `src/assets/images/apps/` with the same `<slug>/` layout.

**Collections (`src/content.config.ts`).** Two collections, both based at `./src/content/apps`:
- `apps` — `glob('**/app.md', …, generateId: slugFromDir)`, same schema as the old `games` collection (`title`, `tag`, `blurb`, `thumbnail`, `availableOn[]`, optional `seo`).
- `appPrivacy` — `glob('**/privacy.md', …, generateId: slugFromDir)`, schema `{ title, updated?, product? }` (the optional `product` display name covers privacy-only stubs that have no `app.md` yet).

Because there is now a **single** privacy collection, no cross-collection slug-collision check is needed (folder names are unique within `apps/`).

**Routing.**
- `src/pages/apps/[slug]/privacy.astro` — `getStaticPaths()` over `appPrivacy`; renders each policy through `PrivacyLayout`. SEO display name resolves from the app's `app.md` title when present (`getEntry('apps', slug)`), else the privacy `product` field, else a generic fallback.
- **Legacy redirect — a single static file.** Sagitta Chains is the only product that ever had a live `/games/<slug>/privacy` URL (confirmed with the owner), so instead of a dynamic route we create one concrete file: `src/pages/games/sagitta-chains/privacy.astro` → `/games/sagitta-chains/privacy`. The old dynamic `src/pages/games/[slug]/privacy.astro` is deleted. The stub is a minimal standalone HTML doc: `<meta http-equiv="refresh">` + `<link rel="canonical">` to `/apps/sagitta-chains/privacy` + `<meta name="robots" content="noindex">` + a plain fallback link. It deliberately does **not** use `BaseLayout`. (If another game ever needs a legacy redirect, it's one more small static file — but none are expected.)

**Public URL & asset model (what actually lives at `/apps/<slug>/…`).** The `/apps/<slug>/` namespace is a **page/route** namespace, not a physical folder — source files stay in three parallel trees keyed by the same slug (`src/content/apps/<slug>/` data, `src/assets/images/apps/<slug>/` images, `src/pages/apps/[slug]/…` route templates):
- **Pages are served under `/apps/<slug>/…`** — `/apps/<slug>/privacy` now, and a future `/apps/<slug>/` landing page (one `src/pages/apps/[slug]/index.astro` template rendering every app from its `app.md`, added with the full app in a later pass). No hand-authored page-per-app.
- **Pipeline images are NOT under `/apps/<slug>/`.** Thumbnails/screenshots go through Astro's asset pipeline and are emitted as fingerprinted, optimized `/_astro/<name>.<hash>.<ext>` URLs (caching + cache-busting). This is unchanged from v1.0.0 and is intentional.
- **`public/apps/<slug>/…` for stable image URLs.** Any image that needs a fixed, shareable URL (Open Graph/share images, anything pasted into App Store Connect) goes in `public/apps/<slug>/…` and is served verbatim at that path, unoptimized — the same convention the existing OG image (`/og/default.png`) uses.

**Code identifiers renamed** (game → app), preserving behavior:
- `src/lib/games.ts` → `src/lib/apps.ts` (`getOrderedGames` → `getOrderedApps`).
- `src/lib/gameImages.ts` → `src/lib/appImages.ts` (`getGameImage` → `getAppImage`; glob path → `/src/assets/images/apps/**`).
- `src/lib/carousel.ts` (`getCarouselGames` → `getCarouselApps`; error text + `src/content/apps/<slug>/app.md` path).
- Components: `GameCard.astro` → `AppCard.astro`, `GamesSection.astro` → `AppsSection.astro`, `GameArt.astro` → `AppArt.astro`, plus `getCollection('games')` → `getCollection('apps')` and local `game`/`games` variables → `app`/`apps` in `HeroCarousel.astro`, `PlatformButtons.astro`, `PlatformButton.astro`, `index.astro`, etc.

## 3. Implementation Notes
_Shared technical considerations across all features in this version._

Suggested order (each step keeps the build green where possible; the collection rename is the pivot):

1. **Move content:** `git mv src/content/games src/content/apps`; within each product folder `git mv game.md app.md`. Create `src/content/apps/tiptable-pro/privacy.md` (stub).
2. **Move assets:** `git mv src/assets/images/games src/assets/images/apps`.
3. **`content.config.ts`:** rename `games`→`apps` (loader `**/app.md`, base `./src/content/apps`), `gamePrivacy`→`appPrivacy` (loader `**/privacy.md`, base `./src/content/apps`, add optional `product`), update the `collections` export and comments.
4. **`lib/` rename + rewire:** `games.ts`→`apps.ts`, `gameImages.ts`→`appImages.ts`, update `carousel.ts`; fix all imports.
5. **Component rename + rewire:** `GameCard`→`AppCard`, `GamesSection`→`AppsSection`, `GameArt`→`AppArt`; update imports in `index.astro`/`HeroCarousel`/etc.; `getCollection('games')`→`getCollection('apps')`. Keep the visible "Games" heading and `id="games"` anchor (display/category).
6. **New route** `src/pages/apps/[slug]/privacy.astro`.
7. **Redirect stub** — rewrite `src/pages/games/[slug]/privacy.astro`.
8. **Verify** (see §4).

**`astro dev` staleness (best-practices gotcha):** the collection rename edits `content.config.ts`, so stop/restart the dev daemon (or delete `.astro/`) before verifying, or collections read as empty.

**Keep the `#games` anchor and "Games" labels.** Nav/Footer link `/#games` and the home section `id="games"` are display navigation for the games category — leave them so the section rename doesn't break the anchor.

## 4. Other Technical Considerations
_Share any other technical information that might be relevant to building this version._

- **No internal links to `/games/<slug>/privacy`** exist (grep-confirmed; footer links only the studio `/privacy`). The sole external consumer is Apple's App Store Connect listing for Sagitta Chains — hence the redirect.
- **Owner action item (outside code):** update the Privacy Policy URL for Sagitta Chains in App Store Connect to `https://redpillbluepillstudios.com/apps/sagitta-chains/privacy` when convenient. The redirect keeps the old URL working until then.
- **Studio `/privacy` is untouched** (studio policy, not a product).
- **Verification must include visual parity of the home page** — the rename touches the carousel, showcase, and image pipeline, so a green build is necessary but not sufficient; confirm the page looks identical to before.
- **Use `git mv`** for folder/file renames so history follows the move.
- **Deploy is unchanged** — same static build + GitHub Pages Actions flow.

## 4b. Pass 2 — Utility category, TipTable Pro app, Utilities home section (as built)

- **Category model:** added a required `category: 'game' | 'utility'` field to the `apps` schema. `sagitta-chains` and `galactic-invaders` are `game`; `tiptable-pro` is `utility`. The free-text `tag` stays for display ("Game · Board", "Utility · Calculator") — `[Category] · [Type]`, where the second word is the genre/type (kept general, e.g. "Calculator", not "Tip Calculator").
- **TipTable Pro `app.md`:** `category: utility`, App Store availability (`id1488483665`, the in-place replacement of the _Split & Tip Calc_ listing — same bundle ID). Copy reflects only what ships free in v1.6.0 — **no themes / no customizable presets** (hidden until the v1.7 IAP; advertising them risks App Review), rounding described as "on the result", **no em-dashes** (owner preference).
- **Home = two sections from one component.** `AppsSection` is now category-aware: it takes `category` / `heading` / `anchorId`, filters apps to that category, renders nothing if empty, and picks a filled icon + accent per category — **games: red controller (34px); utilities: blue wrench (30px)** (the studio's red/blue identity; sizes optically matched). `index.astro` renders **Games** then **Utilities**. Heading changed from "The Games" to **"Games"** (matches the nav label). Stacked sections collapse the doubled 1px border.
- **Carousel:** `carousel.json` = `["sagitta-chains", "tiptable-pro"]` — Galactic Invaders leaves the carousel (still an app in the Games section); TipTable Pro is slide #2. The hero eyebrow is now category-aware ("Featured game" for games, "Featured app" for utilities) so a utility slide reads correctly.
- **Nav + Footer:** added a "Utilities" link (`/#utilities`) beside "Games".
- **Linkable thumbnails:** an optional `thumbnailLink` field (a platform key, build-validated via a zod `.refine()` to exist in `availableOn`) makes an app's art a link to that store. `getThumbnailLink()` in `lib/apps.ts` resolves `{ url, label }` (DRY, shared by card + hero); `AppArt` renders as an `<a>` when linked (new tab, aria-label from the platform's `ariaSuffix`, subtle reduced-motion-safe hover). All three apps link their thumbnail to their store.
- **Tagline broadened:** "A one-man indie game studio, sometimes building more than just games." replaces the games-only tagline in `Footer.astro` and `seo.json` (site default + `/` description, which now names all three products). No em-dashes; drops "easy to play" (may ship more involved apps later).
- **Deploy timing:** Pass 2 is built and verified locally but **held from deploy until Apple approves the TipTable Pro update**, so the App Store button points at the correctly-branded live listing (until then the same App ID shows the old "Split & Tip Calc" name).

## 4c. Pass 3 — mobile & polish (as built)

- **Mobile navigation.** `Nav.astro` now carries three logo assets: the wordmark (`logo-horizontal.svg`) on desktop, the pill mark (`logo-mark.svg`) in the mobile bar, and the full-color stacked lockup (`logo.svg`) centered in a full-screen menu. A hamburger toggles the menu; `nav.ts` handles open/close via button / ✕ / Escape / link-tap / resize, sets `aria-expanded`, and locks body scroll while open. Links live in one array (bar + menu share them).
- **Unified breakpoint.** Every home-layout component (nav, hero, cards, section, footer) flips to mobile at **820px** — previously staggered (hero/nav 820, cards/section 760, footer 720), which read as a two-stage collapse. Kept as finer refinements: hero arrows hidden <560, privacy title shrink <600.
- **Mobile thumbnail fix.** `.app__art-col` had `margin: 0 auto` without a width, so as a grid item it collapsed to its content (the fallback letter). Added `width: 100%` (capped by `max-width: 260px`) so the card art fills correctly on phones.
- **Touch-swipe carousel.** `carousel.ts` adds passive `touchstart`/`touchend` handlers: a mostly-horizontal drag past ~40px advances the carousel (no `preventDefault`, so vertical scrolling is never blocked). Arrows, dots, and autoplay are unchanged.
- **Card rule on mobile.** The red `.app__rule` reads as a section divider when the card stacks, so it is `display: none` under the breakpoint (spacing preserved via `.app__available` margin).
- **Logo edits** (`logo-horizontal.svg`): viewBox `96→103` and the "Studios" group shifted `translate(14 9)` for breathing room; the 105 Studios rects recolored `#8b909a → #c8ccd4` (brighter, still a subtitle).
- **Copy/polish.** Galactic origin line; studio privacy broadened to "apps" + link fixed to `/apps/...` + date bumped; hero "Featured game/app" eyebrow removed (redundant); final TipTable body (shorter, no "Free" ahead of the v1.7 IAP, privacy as its own sentence); tagline "one-man → one-person".

## 5. Open Questions
_Unresolved technical or product questions affecting this version._

- **TipTable Pro dates/copy:** the stub uses placeholder title/date/body; the owner replaces them when pasting the real policy. Not a blocker.
- No blocking questions. The category model, full TipTable Pro app, and utilities home section are part of this version but built in a later pass (Pass 2); the version stays open until the full TipTable Pro app is live.
