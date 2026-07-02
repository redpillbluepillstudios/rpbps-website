# Prototype – **Red Pill Blue Pill Studios Website**
This document captures a throwaway, interactive prototype built to test an idea. A prototype is independent of the Plan and Build phases: build one whenever you want to try something, then ask Cody to use it when planning or building.

## Created
**2026-07-02**

## Last Updated
**2026-07-02**

## The Idea
_The idea this prototype is testing, and what the **USER** hopes to learn from it._

A homepage for **Red Pill Blue Pill Studios**, a one-person indie game studio. The goal was to explore and lock in the **look, feel, and layout** of the site — visual direction, color palette, typography, branding, and section structure — before committing to building the real, production site (which will be powered by **Astro**). The prototype answers: *what should the studio's site actually look and feel like?*

The prototype was seeded from a Claude Design (`claude.ai/design`) concept (`index.dc.html`, "Direction A – The Choice") and iterated live in the browser.

## What to Test
_The specific things to try, click through, or evaluate in the prototype._

- Overall **visual direction** for an indie game studio (playful vs. corporate, light vs. dark).
- **Color palette** — several were trialed before settling.
- **Typography** — whether a retro/pixel aesthetic works and stays readable.
- **Branding** — recreating the studio's pixel-art logo and using it in the nav and footer.
- **Layout / sections** — hero, games showcase, studio/about, contact, footer.
- **Hero pattern** — featuring games (carousel) vs. a studio tagline.
- **Navigation pattern** — overlay-on-hero nav that turns solid on scroll.
- **Game cards** — how to present each game (art + description + store link).
- **Contact** — form vs. a simple mailto.

## Build Approach
_How the prototype is built and any tech choices. Kept lightweight -- it is throwaway._

- **Plain static site**: a single `index.html` + `styles.css` + `script.js`, no framework or build step — deliberately throwaway and easy to iterate.
- Converted from the Claude Design `.dc.html` format (which relies on a React runtime) into standard HTML/CSS/JS with no dependencies.
- **Inline styles** used heavily for fast iteration; structural/repeated styling and all color/font values pulled into **CSS custom properties** in `:root` (`--red`, `--bg`, `--font-display`, etc.) so re-theming was a few one-line changes.
- **Vanilla JS** (`script.js`) for: scroll reveals, the hero carousel (autoplay + arrows + dots, pauses on hover, respects reduced-motion), and the overlay-nav scroll toggle.
- **Fonts** via Google Fonts: *Pixelify Sans* (pixel display) + *Inter* (body).
- **Logo** hand-built as transparent **SVG** pixel art, generated via a small script, in several variants (`logo.svg`, `logo-horizontal.svg`, `logo-mark.svg`, `logo-white.svg`, `logo-footer.svg`).
- Real game screenshots dropped into `images/games/`.

> Note: this is throwaway. The **real site will be rebuilt in Astro** as a new project. The value here is the settled design language and the CSS-variable palette/typography, which carry over.

## Findings Log
_What was learned, updated throughout the prototype session._

| Date | Finding |
|------|---------|
| 2026-07-02 | The Claude Design `.dc.html` translates cleanly to plain HTML/CSS/JS with no runtime — a good, dependency-free starting point. |
| 2026-07-02 | The original red/blue, gradient-heavy palette read as "ugly" and dated. Gradients in general felt old and were removed. |
| 2026-07-02 | A navy + gold palette (from a Weblium game-studio template) was trialed and rejected — didn't fit the studio. |
| 2026-07-02 | Landed on a **Ninja Kiwi–inspired dark game-portal theme**: charcoal-gray textured body (`#28282c` + faint grid), near-black chrome, single **red** accent. This clicked. |
| 2026-07-02 | A **retro pixel aesthetic** works: Pixelify Sans on headings/labels + Inter for body stays readable and matches the pixel logo. |
| 2026-07-02 | The studio's **pixel logo** recreates well as scalable SVG; needed light/dark/two-tone variants for different backgrounds (e.g. white/black on the red footer). |
| 2026-07-02 | Hero should **push a game, not a studio tagline** — "nobody cares" about the tagline. Became a **featured-game carousel** with a blurred game-art backdrop. |
| 2026-07-02 | **Single red accent** (dropping blue for the games/UI) simplified and unified the look; blue stays only in the brand logo. |
| 2026-07-02 | An **overlay nav** (transparent over the hero, solid on scroll) with big edge-chevron arrows matches the desired game-portal feel; arrows need a dark halo to stay visible on any backdrop. |
| 2026-07-02 | A **contact form was unnecessary** for a solo studio — replaced with a simple `mailto:` link in the nav and footer. |
| 2026-07-02 | Game buttons: **App Store** (Apple icon) for Sagitta Chains, **The Web / On the Web** (globe icon) for Galactic Invaders. |

## Likes & Dislikes
_The **USER's** judgment about the prototype: what works, what does not, what to keep, what to throw away, and opinions on the design and architecture._

### Likes / keep
- The **dark game-portal theme** (Ninja Kiwi–inspired): charcoal gray + faint grid + red accent.
- The **retro pixel look** — Pixelify Sans headings and the pixel-art logo.
- The **featured-game hero carousel** with blurred game-art backdrop, edge-chevron arrows, and dots.
- The **overlay nav** that turns solid on scroll.
- The **"The Games"** section with the red gamepad icon; the **red footer** with the centered two-tone logo and a compact links + copyright layout.
- Icon buttons: **App Store** (Apple) and **On the Web / The Web** (globe).
- Simple **mailto** contact instead of a form.

### Dislikes / throw away
- The original **red/blue, gradient-heavy** palette — ugly, dated.
- The **navy + gold** palette experiment — didn't fit.
- **Gradients** as a decorative style — feel old (kept only a subtle background grid texture and a blurred hero image, not flat UI gradients).
- The **studio tagline hero** and a dedicated **studio/about** section — dropped.
- The **contact form** — unnecessary.

### Architecture notes
- Plain HTML/CSS/JS with heavy inline styles was perfect for rapid prototyping, but **not** the target architecture.
- For the real build in **Astro**: carry over the settled design language — the `:root` CSS variables (palette, fonts), the section structure, the SVG logo assets, and the carousel/nav behavior — into proper components. Replace inline styles with component-scoped styles/classes.
