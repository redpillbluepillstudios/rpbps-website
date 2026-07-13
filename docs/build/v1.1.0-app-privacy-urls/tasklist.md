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
| 4.2 | Home-page visual parity | `dev`/`preview`: home rendered identically — carousel, showcase, images, platform buttons. Verified in built HTML + USER confirmed. | 4.1 | 🟢 Completed | AGENT |
| 4.3 | Privacy routes + redirect | Confirm `/apps/sagitta-chains/privacy`, `/apps/tiptable-pro/privacy`, and studio `/privacy` render; old `/games/sagitta-chains/privacy` redirects to the new URL. | 4.1 | 🟢 Completed | AGENT |
| 4.4 | Owner: commit & publish | USER committed, pushed (deployed), privacy URL live; will update the Sagitta Chains Privacy Policy URL in App Store Connect to `/apps/sagitta-chains/privacy`. | 4.1–4.3 | 🟢 Completed | USER |

---

# Pass 2 — Utility category, TipTable Pro app, Utilities home section

## Phase 5 — Category model & content

| ID  | Task | Description | Dependencies | Status | Assigned To |
|-----|------|-------------|--------------|--------|-------------|
| 5.1 | `category` field on apps schema | Add required `category: z.enum(['game','utility'])` to the `apps` collection in `content.config.ts`. | Pass 1 | 🟢 Completed | AGENT |
| 5.2 | Tag existing games | Add `category: game` to `sagitta-chains/app.md` and `galactic-invaders/app.md`. | 5.1 | 🟢 Completed | AGENT |
| 5.3 | TipTable Pro `app.md` | Create `src/content/apps/tiptable-pro/app.md`: `category: utility`, `tag: Utility · Calculator`, blurb/body (v1.6.0-free copy, no themes/presets, no em-dashes), thumbnail, App Store link `id1488483665`. | 5.1 | 🟢 Completed | AGENT |

## Phase 6 — Home presentation

| ID  | Task | Description | Dependencies | Status | Assigned To |
|-----|------|-------------|--------------|--------|-------------|
| 6.1 | Category-aware `AppsSection` | Filter by `category`; per-category filled icon + accent (game=red controller 34px, utility=blue wrench 30px); render nothing when a category is empty; collapse doubled border between stacked sections. | 5.1 | 🟢 Completed | AGENT |
| 6.2 | Two home sections | `index.astro` renders Games then Utilities; heading "The Games" → "Games". | 6.1 | 🟢 Completed | AGENT |
| 6.3 | Carousel + hero eyebrow | `carousel.json` → `["sagitta-chains","tiptable-pro"]` (Galactic leaves carousel, stays an app); hero eyebrow category-aware ("Featured game" / "Featured app"). | 5.3 | 🟢 Completed | AGENT |
| 6.4 | Nav + Footer links | Add "Utilities" → `/#utilities` in `Nav.astro` and `Footer.astro`. | 6.2 | 🟢 Completed | AGENT |
| 6.5 | Linkable thumbnails | Optional `thumbnailLink` field (a platform, build-validated to exist in `availableOn`); `getThumbnailLink()` helper; `AppArt` renders as a link (new-tab, aria-label, reduced-motion hover) in both showcase cards and hero. All three apps link their thumbnail to their store. | 6.1 | 🟢 Completed | AGENT |
| 6.6 | Tagline update | Broaden the studio tagline to "A one-man indie game studio, sometimes building more than just games." in `Footer.astro` + `seo.json` (defaults + `/` description, latter now names all three products). | — | 🟢 Completed | AGENT |

## Phase 7 — Verify & deploy

| ID  | Task | Description | Dependencies | Status | Assigned To |
|-----|------|-------------|--------------|--------|-------------|
| 7.1 | Clean build + home verify | `.astro` cleared; `npm run build` green; built HTML confirms two sections, carousel order, eyebrows, tags, blue/red icons, App Store link, nav/footer links. | 5–6 | 🟢 Completed | AGENT |
| 7.2 | USER visual check | USER confirmed the Games/Utilities layout, icon sizes/colors, and TipTable card in the browser. | 7.1 | 🟢 Completed | USER |
| 7.3 | Deploy after approval | **Hold deploy until Apple approves the TipTable Pro update** (App Store button then points at the correctly-branded live listing), then commit + push. | 7.2 | 🔴 Not Started | USER |

_Pass 2 is **built and verified locally**. The version stays **In Progress** until the TipTable Pro update is approved and the site is deployed (7.3)._

---

# Pass 3 — Mobile & polish

## Phase 8 — Content & copy polish

| ID  | Task | Description | Status | Assigned To |
|-----|------|-------------|--------|-------------|
| 8.1 | Galactic origin line | Append "It was my first game, built to see if I could make one. I could." to `galactic-invaders/app.md`. | 🟢 Completed | AGENT |
| 8.2 | Studio privacy → apps | Broaden "games"→"apps" (intro + rename "Our games"→"Our apps"), fix link `/games/…`→`/apps/sagitta-chains/privacy`, bump Last updated to 2026-07-12; `seo.json` `/privacy` desc "games"→"apps". | 🟢 Completed | AGENT |
| 8.3 | Tagline → "one-person" | "one-man"→"one-person" in `Footer.astro` + `seo.json` (both descriptions). | 🟢 Completed | AGENT |
| 8.4 | Remove hero eyebrow | Drop the redundant "Featured game / Featured app" label from `HeroCarousel.astro`. | 🟢 Completed | AGENT |
| 8.5 | TipTable copy final | Body shortened + "Free" removed (v1.7 IAP coming), privacy as its own sentence; `tag` → "Utility · Calculator"; blurb refreshed. | 🟢 Completed | AGENT |

## Phase 9 — Logo

| ID  | Task | Description | Status | Assigned To |
|-----|------|-------------|--------|-------------|
| 9.1 | Desktop "Studios" spacing | `logo-horizontal.svg`: viewBox 96→103, Studios group shifted `translate(14 9)` for breathing room. | 🟢 Completed | AGENT |
| 9.2 | Brighter "Studios" | Recolor the 105 Studios rects `#8b909a`→`#c8ccd4`. | 🟢 Completed | AGENT |
| 9.3 | Mobile pill-logo | Nav bar shows the pill mark (`logo-mark.svg`) only on mobile; full-color stacked logo (`logo.svg`) centered inside the opened menu. | 🟢 Completed | AGENT |

## Phase 10 — Mobile nav & responsive

| ID  | Task | Description | Status | Assigned To |
|-----|------|-------------|--------|-------------|
| 10.1 | Hamburger menu | `Nav.astro` + `nav.ts`: full-screen menu (logo centered + links); open/close via button / ✕ / Escape / link-tap / resize; body scroll lock; `aria-expanded`. | 🟢 Completed | AGENT |
| 10.2 | Mobile thumbnail fix | `.app__art-col { width:100% }` so mobile card art fills to 260px instead of collapsing to the fallback letter. | 🟢 Completed | AGENT |
| 10.3 | Hide red rule on mobile | `.app__rule { display:none }` under the breakpoint (reads as a section divider when stacked); keep the gap via `.app__available` margin. | 🟢 Completed | AGENT |
| 10.4 | Touch-swipe carousel | `carousel.ts`: passive touchstart/touchend swipe (≥40px, horizontal-dominant) → prev/next; arrows, dots, autoplay intact; no scroll blocking. | 🟢 Completed | AGENT |
| 10.5 | Unify breakpoints → 820 | Nav (720→820), cards + section (760→820), footer (720→820) so the whole home layout flips at one width; hero-arrows (<560) and privacy-title (<600) kept as fine refinements. | 🟢 Completed | AGENT |
| 10.6 | USER device test | USER confirmed on iPhone: mobile menu, pill-logo, thumbnail sizes, carousel swipe, unified layout. | 🟢 Completed | USER |

_Pass 3 is **built and verified** (incl. USER on-device testing)._

---

# ✅ v1.1.0 — CLOSED OUT (2026-07-12)

All three passes built, verified, and documented. The website work is complete; TipTable Pro's App Store button already targets the correct App ID, so Apple's pending approval only changes the displayed name (tracked in the app project, not here).

Close-out ceremony completed:
- ✅ Feature backlog → v1.1.0 marked **Completed**
- ✅ Retrospective written (`retrospective.md`)
- ✅ Best practices captured (`docs/best-practices/project-best-practices.md` — apps model, unified privacy, responsive/mobile, content-copy, UTC dates, Astro inline-scripts)
- ✅ Release notes → v1.1.0 entry (`release-notes.md`)
- ✅ `cody.json` version → **1.1.0**, updatedAt 2026-07-12
- ✅ `README.md` → v1.1.0 badge + apps-model docs

**Remaining owner actions (ops, not build):**
- Commit + push the Step 5 breakpoint changes + all docs (Steps 1–4 already deployed).
- Update the Sagitta Chains Privacy Policy URL in App Store Connect to `/apps/sagitta-chains/privacy`.
