# Release Notes

This document lists new features, bug fixes and other changes implemented during a particular build (version or patch). Latest release is shown at the top.

## Table of Contents
- [Version 1.0.0 — initial release (2026-07-02)](#version-100--initial-release---2026-07-02)

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
