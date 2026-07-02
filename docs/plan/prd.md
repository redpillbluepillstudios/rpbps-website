# Product Requirements Document (PRD)
This document formalizes the idea and defines the what and the why of the product the USER is building.

## Section Explanations
| Section           | Overview |
|-------------------|--------------------------|
| Summary           | Sets the high-level context for the product. |
| Goals             | Articulates the product's purpose — core to the "why". |
| Target Users      | Clarifies the audience, essential for shaping features and priorities. |
| Key Features      | Describes what needs to be built to meet the goals — part of the "what". |
| Success Criteria  | Defines what outcomes validate the goals. |
| Out of Scope      | Prevents scope creep and sets boundaries. |
| User Stories      | High-level stories keep focus on user needs (why) and guide what to build. |
| Assumptions       | Makes the context and unknowns explicit — essential for product clarity. |
| Dependencies      | Identifies blockers and critical integrations — valuable for planning dependencies and realism. |

## Summary
The production website for **Red Pill Blue Pill Studios**, a one-person indie game studio — a faithful, scalable Astro rebuild of an existing design prototype that showcases the studio's games, links players to each game's stores, and hosts the studio's and games' privacy policies. Deployed to GitHub Pages at **redpillbluepillstudios.com**.

## Goals
- Ship a public studio site that **exactly matches the prototype's design** (dark game-portal theme, red accent, pixel aesthetic).
- Make content **data-driven and easy to maintain** so the solo owner can **add a game by dropping in a folder** — no code changes, no database.
- Present each game with its art, blurb, and an **"Available On"** set of platform buttons (web, Apple App Store, Google Play, Steam, extensible).
- Provide a **studio privacy policy** and **per-game privacy policies**, starting with the migrated Sagitta Chains policy.
- Deploy automatically to GitHub Pages on every push to `main` via GitHub Actions.

## Target Users
- **Players / fans** browsing the studio's games and following links to buy/play them (primary).
- **Compliance/app-store reviewers and users** who need to read the studio's or a game's privacy policy.
- **The studio owner** (sole maintainer) who authors and grows the site's content over time.

## Key Features
- **Design system** codifying the prototype's look: CSS custom properties for palette and typography (Pixelify Sans + Inter), consumed by component-scoped styles (no throwaway inline styles).
- **Home page** faithful to the prototype: featured-game **hero carousel** (blurred game-art backdrop, edge-chevron arrows, dots, autoplay, pause-on-hover, reduced-motion aware), overlay **nav** that turns solid on scroll, "**The Games**" showcase, and the **red footer** with two-tone logo and mailto contact.
- **Folder-per-game content collection** (`src/content/games/<slug>/`): each game folder holds `game.md`, optional `privacy.md`, and co-located images. Adding a folder adds the game everywhere automatically.
- **Featured carousel control** via `featured: true` + `featuredOrder` in game frontmatter, supporting **multiple** featured games.
- **"Available On" platform buttons**: per-game `availableOn` array of `{ platform, url }`, rendered by a reusable platform-button component that maps each platform to its icon + label.
- **Schema-validated content** so malformed game entries fail the build rather than shipping broken.
- **Privacy pages**: studio-level policy at `/privacy` (new template) and per-game policies at `/games/<slug>/privacy` (new template), including the **Sagitta Chains** policy migrated from iBuildWith.ai.
- **SEO & sharing**: favicon and basic Open Graph/meta tags on all pages.
- **GitHub Pages deploy**: `site` set to the custom domain, `base: '/'`, `CNAME` in `public/`, GitHub Actions workflow auto-deploying on push to `main`.

## Success Criteria
- The live site at **redpillbluepillstudios.com** is visually indistinguishable from the prototype.
- Both v1 games (**Sagitta Chains**, **Galactic Invaders**) render in the showcase and carousel with correct art and platform buttons.
- `/privacy` and `/games/sagitta-chains/privacy` render correctly from content.
- Adding a **new game** requires only adding a folder under `src/content/games/` — no code edits — and it appears in the showcase (and carousel if flagged).
- A push to `main` builds and deploys the site automatically with no manual steps.

## Out of Scope (Optional)
- Individual game **landing/detail pages** (v1 games link out; only privacy children exist under a game path).
- **Devlog/blog, press kit, About/studio page, social feeds, contact form** — dropped per the prototype's findings.
- **Web analytics** and any backend, database, or CMS.
- **Search, comments, accounts, or localization.**

## User Stories (Optional)
- As a **player**, I can see the studio's games with their art and pick the platform I want to play on, so I can get to the right store quickly.
- As a **player**, I see featured games rotate in a hero carousel, so the newest/most important games stand out.
- As a **user or app-store reviewer**, I can read the studio's privacy policy and a specific game's privacy policy at predictable URLs.
- As the **studio owner**, I can publish a new game by adding one folder of content and images, so growing the site takes minutes and no coding.
- As the **studio owner**, I can flag which games are featured and in what order, so I control the carousel without touching code.

## Assumptions
- The real site must match the prototype **exactly**; the prototype is the design source of truth.
- **All content already exists in the prototype** (copy, images, logo SVG variants, screenshots) and carries over — except the two privacy policies.
- The **Sagitta Chains privacy policy** is migrated from https://ibuildwith.ai/privacy-policies/privacy-policy-sagitta-chains/.
- Favicon + basic SEO/OG tags are v1 essentials; analytics is deferred.
- The domain `redpillbluepillstudios.com` is owned and will be pointed at GitHub Pages.

## Dependencies
- **Astro** (site framework) and the Node/npm toolchain.
- **Astro content collections** with schema validation and co-located image handling.
- **Google Fonts**: Pixelify Sans + Inter.
- **Prototype assets** at `docs/prototypes/rpbp-studios-website/` (logo SVGs, game images, `:root` CSS variables) as the design/content source.
- **GitHub repository + GitHub Pages + GitHub Actions** for hosting and CI/CD.
- **Existing Sagitta Chains privacy policy** page as content source for migration.
