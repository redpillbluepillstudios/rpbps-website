# Red Pill Blue Pill Studios — Website

![version](https://img.shields.io/badge/version-1.0.0-ed1c24)
![Astro](https://img.shields.io/badge/Astro-7.0.6-ed1c24)
![license](https://img.shields.io/badge/license-proprietary-8b8f99)

The official website for **Red Pill Blue Pill Studios**, a one-person indie game studio — a data-driven [Astro](https://astro.build) site deployed to GitHub Pages at **[redpillbluepillstudios.com](https://redpillbluepillstudios.com)**.

## What's here

- **Games showcase** with a featured-game hero carousel — all data-driven, no hardcoding.
- **Add a game = add a folder.** Each game is a content folder + an images folder; it appears automatically.
- **Privacy pages**: a studio policy (`/privacy`) and optional per-game policies (`/games/<slug>/privacy`).
- **Design system** codifying the studio look (dark game-portal theme, red accent, pixel display font).

## Local development

Requires **Node.js 24.x** (LTS-line) and npm.

```bash
npm install       # install dependencies
npm run dev       # start the dev server with hot reload (http://localhost:4321)
npm run build     # build the static site to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  assets/images/        # optimized images, organized by subfolder
    brand/              # logo SVG variants
    games/<slug>/       # per-game art (1000×1000 thumbnail.png)
  components/           # Nav, Footer, HeroCarousel, GameCard, PlatformButtons, …
  content/
    games/<slug>/       # game.md (+ optional privacy.md) — one folder per game
    pages/              # standalone content pages (studio privacy)
  content.config.ts     # content collections + zod validation
  data/
    carousel.json       # ordered game slugs shown in the hero carousel
    seo.json            # global + per-page SEO
  layouts/              # BaseLayout, PrivacyLayout
  lib/                  # image resolver, carousel/games/seo/platforms helpers
  pages/                # routes (/, /privacy, /games/[slug]/privacy)
  scripts/              # small client-side islands (nav, reveals, carousel)
  styles/               # tokens.css (design tokens) + global.css
public/                 # CNAME, favicon, OG image, static assets
```

## Adding a game

1. Create `src/content/games/<slug>/game.md` (title, tag, blurb, `availableOn`).
2. Add `src/assets/images/games/<slug>/thumbnail.png` (1000×1000).
3. To feature it in the hero carousel, add its `<slug>` to `src/data/carousel.json`.
4. (Optional) Add `src/content/games/<slug>/privacy.md` to publish a privacy policy at `/games/<slug>/privacy`.

No code changes required.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds the site and deploys it to GitHub Pages. The custom domain is configured via `public/CNAME`.

---

© 2026 Red Pill, Blue Pill Studios, LLC.
