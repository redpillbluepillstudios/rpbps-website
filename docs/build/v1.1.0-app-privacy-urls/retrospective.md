# Version Retrospective – v1.1.0 (app-privacy-urls)
This document reflects on what worked, what didn't, and how future versions can be improved.

## Version Summary
Moved the site from a games-only model to a unified **"apps"** model (a game is an app with a `Game` category), unified all privacy policies under `/apps/<slug>/privacy`, and launched the first non-game product — **TipTable Pro** (a Utility). Delivered in three passes: (1) the `apps` rename + privacy URL infrastructure + Sagitta redirect; (2) the Utility category, the full TipTable Pro app entry, a Utilities home section, and linkable thumbnails; (3) mobile navigation (hamburger + pill-logo) and a broad responsive/polish pass. The site stayed shippable after every pass.

## What Went Well
- **Incremental, verified passes.** Each pass built and verified (clean `astro build` + HTML/CSS assertions) before moving on; the site was deployable throughout. Pass 1 shipped a working privacy URL so the App Store submission was never blocked.
- **`git mv` for the rename.** Renaming `games → apps` across content, assets, collections, components, and libs preserved history and kept the diff readable.
- **One reusable section component.** Making `AppsSection` category-aware (props: category/heading/anchor, per-category icon + accent) meant the Utilities section was almost free and future categories will be too.
- **DRY thumbnail links.** `thumbnailLink` references a platform already in `availableOn` (no duplicated URLs) and is build-validated, so a typo fails the build.
- **Structural verification held up.** With the browser extension unavailable, verifying built HTML/CSS (selectors, hrefs, breakpoints, inlined JS) reliably caught issues; the user's on-device pass confirmed the mobile work.

## What Could Have Gone Better
- **Breakpoints drifted apart.** The nav/hero/cards/footer were authored at 720/760/820/720 independently, producing a two-stage "half-mobile" zone the user caught. A single shared breakpoint from the start would have avoided it.
- **A latent mobile bug shipped earlier.** `.app__art-col` used `margin:auto` without a width, so mobile card art silently collapsed to the fallback letter — only surfaced when the user looked on a phone.
- **Copy churned in many small round-trips.** TipTable's description/blurb/tag and the studio tagline each took several passes. Front-loading the App Store `listing.md`/`whats-new.md` context would have gotten the copy closer on the first try.
- **Scope grew mid-version.** Mobile menu, touch carousel, and the logo work were added after the version was defined; fine here (version stayed open), but worth scoping upfront next time.

## Lessons Learned
- **Pick one responsive breakpoint per project and reuse it** (this project: 820px for the home-layout flip; finer tweaks like hidden hero arrows <560 and privacy title <600 are the exceptions, not the rule).
- **CSS grid + `margin:auto` needs an explicit width**, or the item collapses to content — always pair `max-width`/`margin:auto` with `width:100%` for a fill-then-cap behavior.
- **Reference external source-of-truth docs before writing product copy.** The App Store listing notes (free-tier only, no themes/presets, no em-dashes) materially changed the site copy.
- **A public URL that won't change decouples the website from external approval.** TipTable's App Store button targets a stable App ID, so Apple's rename approval changes only the displayed name — no website dependency, tracked in the app project.
- **Astro inlines small client scripts** (no external `.js`); verify client logic by grepping the built HTML, not `dist/_astro/*.js`.

## Action Items
- Keep a single `--breakpoint` convention; audit any new component against it (captured in best-practices).
- When adding a product, verify the card/thumbnail at a phone width before calling it done.
- Pull App Store `listing.md` copy into the app's `app.md` when TipTable's full store copy is finalized.
- Owner: update the Sagitta Chains Privacy Policy URL in App Store Connect to `/apps/sagitta-chains/privacy` (redirect covers it until then).
