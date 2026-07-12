# Version Tasklist – v1.1.0 — app-privacy-urls
This document outlines all the tasks to work on to deliver this particular version, grouped by phases.

| Status |      |
|--------|------|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Completed |


## Phase 1 — Rename the product tree (games → apps)

| ID  | Task | Description | Dependencies | Status | Assigned To |
|-----|------|-------------|--------------|--------|-------------|
| 1.1 | Move content folder | `git mv src/content/games src/content/apps`; in each product folder `git mv game.md app.md` (sagitta-chains, galactic-invaders). | None | 🟢 Completed | AGENT |
| 1.2 | Move image assets | `git mv src/assets/images/games src/assets/images/apps` (keeps `<slug>/` layout). | None | 🟢 Completed | AGENT |
| 1.3 | Rewrite `content.config.ts` | `games`→`apps` (loader `**/app.md`, base `./src/content/apps`); `gamePrivacy`→`appPrivacy` (loader `**/privacy.md`, add optional `product`); update `collections` export + comments. | 1.1 | 🟢 Completed | AGENT |

## Phase 2 — Rename code identifiers (lib + components)

| ID  | Task | Description | Dependencies | Status | Assigned To |
|-----|------|-------------|--------------|--------|-------------|
| 2.1 | Rename lib helpers | `lib/games.ts`→`lib/apps.ts` (`getOrderedGames`→`getOrderedApps`); `lib/gameImages.ts`→`lib/appImages.ts` (`getGameImage`→`getAppImage`, glob `/src/assets/images/apps/**`); update `lib/carousel.ts` (`getCarouselApps`, error text + `app.md` path). | 1.3 | 🟢 Completed | AGENT |
| 2.2 | Rename components | `GameCard`→`AppCard`, `GamesSection`→`AppsSection`, `GameArt`→`AppArt`; update local `game(s)` vars; keep visible "Games" heading + `id="games"` anchor. | 1.3 | 🟢 Completed | AGENT |
| 2.3 | Rewire imports & collection calls | Fix imports in `index.astro`, `HeroCarousel.astro`, `PlatformButtons.astro`, `PlatformButton.astro`; `getCollection('games')`→`getCollection('apps')` everywhere. | 2.1, 2.2 | 🟢 Completed | AGENT |

## Phase 3 — Privacy routes

| ID  | Task | Description | Dependencies | Status | Assigned To |
|-----|------|-------------|--------------|--------|-------------|
| 3.1 | New unified route | `src/pages/apps/[slug]/privacy.astro`: `getStaticPaths()` over `appPrivacy`, render via `PrivacyLayout`; SEO name from `app.md` title → privacy `product` → fallback. | 1.3 | 🟢 Completed | AGENT |
| 3.2 | Legacy redirect (single static file) | Delete dynamic `src/pages/games/[slug]/privacy.astro`; create `src/pages/games/sagitta-chains/privacy.astro` — meta-refresh + canonical to `/apps/sagitta-chains/privacy` + `noindex` + fallback link; no `BaseLayout`. Sagitta Chains is the only legacy URL. | 3.1 | 🟢 Completed | AGENT |
| 3.3 | TipTable Pro privacy stub | Create `src/content/apps/tiptable-pro/privacy.md`: frontmatter `title`, `updated`, `product: "TipTable Pro"`; clearly-marked placeholder body for the owner to replace. | 1.1 | 🟢 Completed | AGENT |

## Phase 4 — Verify

| ID  | Task | Description | Dependencies | Status | Assigned To |
|-----|------|-------------|--------------|--------|-------------|
| 4.1 | Production build | `npm run build` clean (no missing-image/collection errors); restart dev daemon / clear `.astro` after the config change. | 1–3 | 🟢 Completed | AGENT |
| 4.2 | Home-page visual parity | `dev`/`preview`: home renders identically — carousel, "The Games" showcase, images, platform buttons. Structurally verified in built HTML (all markers present); awaiting USER's visual confirm on the preview server. | 4.1 | 🟡 In Progress | AGENT |
| 4.3 | Privacy routes + redirect | Confirm `/apps/sagitta-chains/privacy`, `/apps/tiptable-pro/privacy`, and studio `/privacy` render; old `/games/sagitta-chains/privacy` redirects to the new URL. | 4.1 | 🟢 Completed | AGENT |
| 4.4 | Owner: commit & publish | USER commits, pushes (deploys), then updates the Sagitta Chains Privacy Policy URL in App Store Connect to `/apps/sagitta-chains/privacy`. | 4.1–4.3 | 🔴 Not Started | USER |

---

_Phases 1–4 above are **Pass 1**. **Pass 2** (still part of v1.1.0 — Utility category, full TipTable Pro app, utilities home-page section; backlog features 7–9) will be appended as new phases here when we build it. The version stays **In Progress** until the full TipTable Pro app is live._

**Close-out reminders (when the version is completed):**
- Update `README.md` (project overview + version pill/badge) to reflect v1.1.0.
- Standard version close-out: retrospective, best-practices capture, release notes, `cody.json` version bump.
