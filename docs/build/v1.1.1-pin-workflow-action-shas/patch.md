# Patch – v1.1.1 — Pin Workflow Action SHAs
This document captures a lightweight fix or small enhancement that does not require a full version build cycle.

## Patch Version
v1.1.1 — Pin Workflow Action SHAs

## Date
2026-07-13

## Type
Bug Fix (security hardening)

## Original Prompt
_What the **USER** originally said or requested._

The user ran a Codex security review of the codebase. It returned one High-severity finding: the GitHub Actions in `.github/workflows/deploy.yml` are referenced by mutable version tags rather than immutable commit SHAs. The user asked to resolve it as a Cody patch.

## Problem
_The **AGENT's** understanding of the issue or change needed._

`.github/workflows/deploy.yml` references three third-party actions by mutable major-version tags:

- `actions/checkout@v6` (line 26)
- `withastro/action@v6` (line 29)
- `actions/deploy-pages@v5` (line 42)

A version tag is a movable pointer: the upstream owner (or an attacker who compromises the upstream repo) can re-point it to a different commit at any time. Because this workflow runs on every push to `main` with `pages: write` and `id-token: write` permissions, a poisoned tag would execute unreviewed code inside the production deployment pipeline — able to alter the published site or mint a deployment OIDC token. This is the classic GitHub Actions supply-chain vector (e.g. the 2025 `tj-actions/changed-files` tag-move compromise).

This aligns with an existing project best practice — "pin exact latest-stable versions" for dependencies — which the workflow actions currently violate.

## Plan
_How the **AGENT** intends to fix or implement the change._

Pin each action to its full 40-character commit SHA, with an adjacent comment naming the human-readable version. Each `@vN` tag currently resolves exactly to the latest specific release, so this is behavior-preserving — it only removes tag mutability:

| Action | From | To (commit SHA) | Version comment |
|--------|------|-----------------|-----------------|
| `actions/checkout` | `@v6` | `df4cb1c069e1874edd31b4311f1884172cec0e10` | `# v6.0.3` |
| `withastro/action` | `@v6` | `e84f40bd8d2caa9e768ec82ad30dd81f0b280853` | `# v6.1.2` |
| `actions/deploy-pages` | `@v5` | `cd2ce8fcbc39b97be8ca5fce6e763baed58fa128` | `# v5.0.0` |

Add a `.github/dependabot.yml` with the `github-actions` ecosystem (weekly) so pinned SHAs get reviewable bump PRs and the pins don't silently go stale — this preserves the safety of pinning while keeping the actions current.

## Solution
_What was actually done to resolve the issue._

Pinned all three actions in `.github/workflows/deploy.yml` to their full commit SHAs, each with a trailing version comment:

- `actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6.0.3`
- `withastro/action@e84f40bd8d2caa9e768ec82ad30dd81f0b280853 # v6.1.2`
- `actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5.0.0`

Added `.github/dependabot.yml` configuring the `github-actions` ecosystem on a weekly schedule (with a `ci` commit-message prefix), so Dependabot opens a reviewable PR whenever a pinned action has a newer release. This keeps the SHA pins from going stale without reintroducing tag mutability.

Both files validated as well-formed YAML. The SHAs were resolved from the upstream repos and confirmed to match exactly the commits the `@v6`/`@v5` tags currently point to, so the change is behavior-preserving.

## Files Changed
_List of files that were created, modified, or deleted._

| File | Action |
|------|--------|
| `.github/workflows/deploy.yml` | Modified |
| `.github/dependabot.yml` | Created |
| `docs/build/v1.1.1-pin-workflow-action-shas/patch.md` | Created |

## Testing Notes
_How to verify the fix or change._

- **YAML sanity (done):** both `.github/workflows/deploy.yml` and `.github/dependabot.yml` parse as valid YAML.
- **Real verification is the next deploy:** push to `main` (or run the workflow via the Actions tab → "Deploy to GitHub Pages" → Run workflow) and confirm the build + deploy jobs complete green. Because each SHA matches the tag it replaced, the run should behave identically to previous deploys.
- **Dependabot:** after this lands on `main`, GitHub activates the config automatically. It runs on its weekly schedule; you can also trigger an immediate check from the repo's **Insights → Dependency graph → Dependabot** tab ("Check for updates"). Any update surfaces as a normal PR — nothing deploys until you merge it.
