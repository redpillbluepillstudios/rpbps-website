# Release Notes

This document lists new features, bug fixes and other changes implemented during a particular build (version or patch). Latest release is shown at the top.

## Table of Contents
- [Version 1.1.0 — apps model, TipTable Pro & mobile (2026-07-12)](#version-110--apps-model-tiptable-pro--mobile---2026-07-12)
- [Version 1.0.0 — initial release (2026-07-02)](#version-100--initial-release---2026-07-02)

---

# Version 1.1.0 — apps model, TipTable Pro & mobile - 2026-07-12

## Overview
The site becomes a unified **"apps"** platform — every product is an app, and a game is just an app with a `Game` category. This release unifies all privacy policies under `/apps/<slug>/privacy`, launches the studio's first non-game product **TipTable Pro** (a Utility) with a new Utilities section, and adds a proper mobile experience (hamburger menu, touch-swipe carousel, responsive polish).

## Key Features
- **Unified "apps" model** — `games → apps` throughout (content, assets, collections, components); a required `category` field (`game` | `utility`) drives the home sections. Games keep their category label; adding a product is still "add a folder."
- **Unified privacy URLs** — every product's policy lives at `/apps/<slug>/privacy` via one route + the `appPrivacy` collection. The old `/games/sagitta-chains/privacy` is a permanent redirect so the live App Store link never breaks.
- **TipTable Pro** — the first Utility app (a private, on-device tip calculator), featured in the carousel and shown in a new **Utilities** home section (blue accent, beside the red Games section).
- **Linkable thumbnails** — an app's art links to its store (`thumbnailLink` references a platform in `availableOn`, build-validated).
- **Mobile navigation** — a hamburger menu (pill-mark logo in the bar; full logo + links in a full-screen menu) and a **touch-swipe carousel** on phones.

## Enhancements
- **One responsive breakpoint (820px)** for the whole home layout, replacing the previous staggered 720/760/820 transition.
- **Logo polish** — more breathing room under "Studios" and a brighter "Studios" tone in the header wordmark.
- **Copy** — studio tagline broadened to "A one-person indie game studio, sometimes building more than just games"; studio privacy policy generalized from "games" to "apps"; the redundant "Featured game" hero label removed; a personal origin note added to Galactic Invaders.

## Bug Fixes
- **Mobile card thumbnails** no longer collapse to a tiny icon (grid item needed an explicit `width`).
- **"Last updated" dates** on privacy pages render the authored date in every environment (formatted in UTC; previously a day early on non-UTC build machines).

## Other Notes
- Site remains a static Astro build on GitHub Pages; no new dependencies.
- TipTable Pro's App Store button targets the existing App ID (the in-place replacement of "Split & Tip Calc"); Apple's rename approval only changes the displayed name — no website change. Owner to update the Sagitta Chains privacy URL in App Store Connect to `/apps/sagitta-chains/privacy`.

---

# Version 1.0.0 — initial release - 2026-07-02

## Overview
The first public release of the Red Pill Blue Pill Studios website: a faithful, data-driven Astro rebuild of the design prototype, live at **https://redpillbluepillstudios.com** on GitHub Pages with automated deploys.

## Key Features
- **Games showcase + featured-game hero carousel** — data-driven, no hardcoding; carousel membership controlled by a single `carousel.json` list of game slugs (supports multiple featured games).
- **Folder-per-game content model** — add a game by adding a content folder (`game.md`) + an images folder; it appears automatically. Schema-validated so malformed entries fail the build.
- **"Available On" platform buttons** — per-game list rendering App Store / Web / (extensible: Google Play, Steam) from a single lookup.
- **Privacy pages** — studio policy at `/privacy` and per-game policies at `/games/<slug>/privacy` (Sagitta Chains policy migrated from iBuildWith.ai). A game's privacy page appears only when it has a `privacy.md`.
- **Design system** faithfully porting the prototype: dark game-portal theme, red accent, self-hosted pixel display font (Pixelify Sans) + Inter body, overlay-to-solid nav, red footer.
- **SEO** — favicon, Open Graph/Twitter meta on every page, branded share image, per-page overrides via `seo.json` + optional per-game `seo` block.
- **Automated deployment** — GitHub Actions builds and deploys to GitHub Pages on every push to `main`; apex custom domain with enforced HTTPS and `www` → apex redirect.

## Enhancements
None (initial release).

## Bug Fixes
None (initial release).

## Other Notes
- Built with Astro 7.0.6 (pinned), Node 24.x, self-hosted Fontsource variable fonts; `astro check` passes with 0 errors/warnings/hints.
- Verified live: home (both games + carousel), `/privacy`, `/games/sagitta-chains/privacy`, `www` redirect, and enforced HTTPS.
- Deferred to the backlog for a future version: web analytics, individual game detail pages, contact form.
