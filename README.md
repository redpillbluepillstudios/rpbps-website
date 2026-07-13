# Red Pill Blue Pill Studios — Website

![version](https://img.shields.io/badge/version-1.1.0-ed1c24)
[![owner](https://img.shields.io/badge/owner-RPBP%20Studios-8b8f99)](https://www.redpillbluepillstudios.com)

The official website for **Red Pill Blue Pill Studios**, a one-person indie game studio that sometimes builds more than just games — a data-driven [Astro](https://astro.build) site deployed to GitHub Pages at **[redpillbluepillstudios.com](https://redpillbluepillstudios.com)**.

## What's here

- **Unified "apps" model** — every product is an *app* with a `category` (`game` or `utility`); a game is just an app in the Game category. The home page shows a **Games** section and a **Utilities** section, plus a featured-app hero carousel. All data-driven, no hardcoding.
- **Add an app = add a folder.** Each app is a content folder + an images folder; it appears automatically.
- **Privacy pages**: a studio policy (`/privacy`) and optional per-app policies at `/apps/<slug>/privacy`.
- **Mobile-first nav**: a hamburger menu on phones (pill-mark logo in the bar, full logo + links in the menu) and a touch-swipe carousel.
- **Design system** codifying the studio look (dark game-portal theme, red + blue brand accents, pixel display font).

## Local development

Requires **Node.js 24.x** (LTS-line) and npm.

```bash
npm install       # install dependencies
npm run dev       # start the dev server with hot reload (http://localhost:4321)
npm run build     # build the static site to dist/
npm run preview   # preview the last production build locally
```

## Project structure

```
src/
  assets/images/        # optimized images, organized by subfolder
    brand/              # logo SVG variants (horizontal, mark, stacked, footer)
    apps/<slug>/        # per-app art (1000×1000 thumbnail.png)
  components/           # Nav, Footer, HeroCarousel, AppsSection, AppCard, AppArt, PlatformButtons, …
  content/
    apps/<slug>/        # app.md (+ optional privacy.md) — one folder per app
    pages/              # standalone content pages (studio privacy)
  content.config.ts     # content collections (apps, appPrivacy, pages) + zod validation
  data/
    carousel.json       # ordered app slugs shown in the hero carousel
    seo.json            # global + per-page SEO
  layouts/              # BaseLayout, PrivacyLayout
  lib/                  # image resolver, carousel/apps/seo/platforms helpers
  pages/                # routes (/, /privacy, /apps/[slug]/privacy)
  scripts/              # small client-side islands (nav + mobile menu, reveals, carousel)
  styles/               # tokens.css (design tokens) + global.css
public/                 # CNAME, favicon, OG image, static assets
```

## Adding an app

1. Create `src/content/apps/<slug>/app.md` with `title`, `category` (`game` | `utility`), `tag`, `blurb`, and `availableOn`. Optionally set `thumbnailLink` to make the thumbnail link to one of its `availableOn` platforms.
2. Add `src/assets/images/apps/<slug>/thumbnail.png` (1000×1000).
3. To feature it in the hero carousel, add its `<slug>` to `src/data/carousel.json`.
4. (Optional) Add `src/content/apps/<slug>/privacy.md` to publish a privacy policy at `/apps/<slug>/privacy`.

The app appears in the Games or Utilities section automatically based on its `category`. No code changes required.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds the site and deploys it to GitHub Pages. The custom domain is configured via `public/CNAME`.

---

© 2026 Red Pill, Blue Pill Studios, LLC.
