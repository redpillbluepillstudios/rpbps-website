# Version Retrospective – v1.0.0 — initial release
This document reflects on what worked, what didn't, and how future versions can be improved.

## Version Summary
Built and shipped the production Red Pill Blue Pill Studios website: a faithful, data-driven Astro 7 rebuild of the design prototype, deployed to GitHub Pages at the custom apex domain **redpillbluepillstudios.com**. Delivered a design system from the prototype tokens, a DRY shell (single BaseLayout / Nav / Footer), a folder-per-game content collection with schema validation, a featured-game hero carousel driven by `carousel.json`, an "Available On" platform-button system, studio + per-game privacy pages (Sagitta Chains migrated from iBuildWith.ai), SEO/OG + favicon, and an automated GitHub Actions deploy. Verified live: home + both games, `/privacy`, `/games/sagitta-chains/privacy`, `www`→apex redirect, and enforced HTTPS.

## What Went Well
- **Prototype-first paid off.** Because the design language, palette, fonts, and section structure were locked in the prototype, the production rebuild matched it closely with little rework — the user's first look was "you got it exactly right."
- **Data-driven model delivered on its promise.** The "add a game = add a folder" goal was verified end-to-end with a throwaway game that appeared with zero code changes, correctly got no privacy route (no `privacy.md`), and rendered a scaffolded Steam button from the platform lookup.
- **Clean architecture held up.** Single BaseLayout/Nav/Footer (DRY), central image tree resolved via `import.meta.glob`, `carousel.json` as the single source of carousel truth, and zod-validated collections — `astro check` finished at 0 errors/warnings/hints.
- **Best-practices research up front** (official Astro docs) meant the build followed current patterns (Content Layer API, glob loader, `<Image>`/`src/assets`, official Pages Actions flow) instead of deprecated ones.
- **Self-hosted fonts** via Fontsource variable packages matched the prototype's pixel look with no third-party request.

## What Could Have Gone Better
- **A stale background dev-server daemon** caused a phantom "site won't load" (flickering error overlay). Astro 7's `astro dev` runs detached; the instance started in Phase 1 never re-synced the content collection added later, so its store stayed empty. A restart fixed it, but it cost a debugging detour. Now recorded in best-practices.
- **GitHub Pages deploy ordering tripped us up.** The first deploy ran before Pages was enabled (404), and later ones ran before the custom-domain DNS check passed ("deployment failed, try again later"). The site only deployed once the domain was verified. This is inherent to Pages + custom domain, but sequencing it explicitly (enable Pages → set source → wait for DNS/verify → deploy) would have avoided several failed runs.
- **DNS-vs-GitHub-check lag** was confusing: DNS was fully propagated (confirmed via `dig`) well before GitHub's own domain check flipped green. Knowing GitHub re-checks on its own cadence would have set expectations.

## Lessons Learned
- For Astro + GitHub Pages on a **custom apex domain**, the reliable order is: push → enable Pages with **Source = GitHub Actions** → let the **DNS check** go green → **then** run the deploy. Deploys attempted before verification fail with 404 / "try again later," not because of the code.
- The repo is a **project repo** (not `user.github.io`), so the custom domain is what allows `base: '/'` root-path serving. Removing the custom domain to "unblock" a deploy would have broken all asset paths — keep it.
- Astro 7's dev server is a **persistent daemon**; when content config or collections change, restart it (`astro dev stop`) — its errors live in `astro dev logs`, not the terminal.
- Verifying the maintainer workflow with a **real throwaway entry** (not just reasoning about it) gave genuine confidence that "add a folder = add a game" works.

## Action Items
- Keep the `check` script (`astro check`) as a pre-commit/pre-deploy gate for future versions.
- When adding future games, follow the README's "Adding a game" steps; re-verify the carousel validation catches typos.
- If deploys are ever flaky again, first check whether GitHub's Pages domain/DNS check is green before re-running.
- Consider (future version) adding a sitemap + analytics (already parked in the backlog).
