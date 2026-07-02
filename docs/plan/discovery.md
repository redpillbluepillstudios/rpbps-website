# Discovery
This document captures the raw, unfiltered idea or initial AI prompt that sparked the project.

## Starting Prompt
"So I want to create a website for my indie game studio (one person game studio) called Red Pill Blue Pill Studios. I already have a prototype we can use to guide the planning and then the building."

The prototype referenced lives at `docs/prototypes/rpbp-studios-website/prototype.md` — a throwaway static HTML/CSS/JS build that locked in the studio's design language (dark game-portal theme, red accent, pixel aesthetic, featured-game carousel, overlay nav, mailto contact) with the explicit intent to rebuild the real site in **Astro**.

## Questions

**AGENT Q1:** For v1.0, is Sagitta Chains + Galactic Invaders the complete games list, and is the games showcase essentially the only real content (plus hero + footer/contact), or do you also want other pages/sections (devlog, press kit, About page, social links)?
**USER A1:** For v1, yes — that's the complete list. The only extra thing needed is a privacy page (which the site doesn't have yet), plus moving the Sagitta Chains privacy page from iBuildWith.ai to here. Need to figure out the best way to organize this. Must use Astro; must be able to add games as I go (no hardcoding). Need a design system that follows the current design. Need an easy way to add a featured game to the carousel. No database. Hosted on GitHub public Pages.

**AGENT Q2:** How should privacy pages be organized — a studio-level policy at `/privacy` and per-game policies at `/games/<game>/privacy` (or `/privacy/<game>`)?
**USER A2:** Main site: `/privacy` for sure. For the game, which organization do you recommend? Leaning toward `/game/privacy/`.

**AGENT Q3 (recommendation):** Recommended game-scoped, nested-under-the-game paths: `/games/<slug>/privacy` (plural `/games/`, slug per game), with the game's privacy policy as an optional field on the game's content entry.
**USER A3:** Agreed the content should be committed with the repo — thinking a games folder that organizes content, privacy policy, images, etc. per game. Asked what I think.

**AGENT Q4:** Where do game images/assets live (committed to repo, standard Astro static approach), and are Markdown/MDX game entries acceptable ("add a game = add a file")?
**USER A4:** Committed with the repo. Wants a games folder where each game's content, privacy policy, and images are organized together.

**AGENT Q5 (recommendation):** Recommended a folder-per-game content collection: `src/content/games/<slug>/` holding `game.md`, optional `privacy.md`, and co-located images; carousel driven by a `featured` flag + `featuredOrder`.
**USER A5:** Confirmed. Also: the carousel can have **multiple** featured games — make sure that's supported.

**AGENT Q6:** GitHub Pages — custom domain or default `*.github.io`?
**USER A6:** Custom domain, already owned: **redpillbluepillstudios.com**.

**AGENT Q7:** Deploy via GitHub Actions auto-deploy on push to `main`? And is there a GitHub repo yet, or should the plan include creating it?
**USER A7:** GitHub Actions and auto-deploy on push are great. The git repo is already created locally; will push to GitHub after planning.

**AGENT Q8:** What does "done and successful" look like for v1, and are favicon/SEO-OG/analytics v1 essentials or nice-to-haves?
**USER A8:** Success = the prototype fully implemented as an Astro site that is scalable and easy to maintain, where I can add more games in the future.

**AGENT Q9 (refinement raised by USER):** Games have an "Available On" concept — a game can be available on web, Apple App Store, Android/Google Play store, Steam, etc., and each requires its own button.
**USER A9:** Correct — keep that in mind. Each platform a game is available on requires a button for that game.

## Discovery Summary

**What we're building:** The production website for **Red Pill Blue Pill Studios**, a one-person indie game studio — the real, scalable rebuild of an existing design prototype, implemented in **Astro** and deployed to **GitHub Pages** at the custom domain **redpillbluepillstudios.com**.

**Purpose / target user:** A public marketing/portfolio site for players and fans that showcases the studio's games, drives clicks to each game's store/play destinations, and hosts the studio's and games' privacy policies. Single maintainer (the owner), so content authoring must be extremely simple.

**Design (locked by the prototype — carried over faithfully):**
- Dark, Ninja Kiwi–inspired game-portal theme: charcoal-gray textured body + faint grid, near-black chrome, single **red** accent (blue reserved for the brand logo only).
- Retro pixel aesthetic: **Pixelify Sans** display + **Inter** body.
- Featured-game **hero carousel** (blurred game-art backdrop, edge-chevron arrows, dots, autoplay, pauses on hover, respects reduced-motion).
- **Overlay nav** that is transparent over the hero and turns solid on scroll.
- "**The Games**" showcase section; **red footer** with centered two-tone logo + compact links/copyright.
- **mailto** contact (no form).
- Codified as a reusable **design system**: CSS custom properties for palette/type feeding component-scoped styles (replacing the prototype's throwaway inline styles).

**Content architecture (no database, no hardcoding):**
- **Folder-per-game content collection**: `src/content/games/<slug>/` holding `game.md` (title, blurb, art, `featured` flag, `featuredOrder`, and an `availableOn` array), an optional `privacy.md`, and co-located images.
- **Add a game = add a folder.** New games appear in the showcase automatically; a `privacy.md` makes the game's privacy route appear automatically.
- **Carousel** driven by `featured: true` (supports **multiple** featured games) ordered by `featuredOrder`.
- **"Available On"** is a per-game array of `{ platform, url }` (web, Apple App Store, Google Play/Android, Steam, extensible), each rendered by a platform-button component that maps platform → icon + label.
- Collection schema validates entries so malformed content fails the build.

**Pages / routes (v1):**
- `/` — home (hero carousel + The Games + footer/contact)
- `/privacy` — studio-level privacy policy (new)
- `/games/<slug>/privacy` — per-game privacy policy; **Sagitta Chains** policy migrated here from iBuildWith.ai
- v1 games (complete list): **Sagitta Chains** (Apple App Store) and **Galactic Invaders** (Web)

**Hosting / deploy:**
- Custom domain `redpillbluepillstudios.com` → Astro `site` = root domain, `base: '/'`, with a `CNAME` file in `public/`.
- **GitHub Actions**, auto-deploy on push to `main`. Repo already created locally; owner will push after planning.

**Fidelity & content sourcing (USER emphasis):**
- The real site must match the **exact** design of the prototype — this is a faithful production rebuild, not a redesign.
- **All content already exists in the prototype** (copy, images, logo assets, game screenshots) and carries over — with **two exceptions**: the studio privacy policy and the game privacy policy, which the prototype does not include.
- The **Sagitta Chains privacy policy already exists** and is the source to migrate: https://ibuildwith.ai/privacy-policies/privacy-policy-sagitta-chains/ (content pulled from there into `src/content/games/sagitta-chains/privacy.md`).
- Both privacy page types need **new templates** created (studio privacy layout + per-game privacy layout), styled with the design system.

**Assumptions:**
- Favicon + basic SEO/Open Graph meta tags are **v1 essentials** (cheap; logo assets already exist).
- Web analytics is a **nice-to-have** for a later version.
- Prototype assets (SVG logo variants, game screenshots, the `:root` CSS variables) are reused rather than recreated.

**Definition of done / success:** The prototype is fully realized as a scalable, easy-to-maintain Astro site — live at redpillbluepillstudios.com, both games shown with the prototype's exact look, working studio and Sagitta Chains privacy pages, and adding a future game is just dropping in a folder.
