# Tonic for the Bones — Agent Rules

## Deployment

This project deploys via **Vercel** from the **`main`** branch only.

- Live URL: **https://www.tonicforthebones.com**
- GitHub repo: https://github.com/Haarlemman/tonic
- **ALWAYS push to `main` to deploy to production.** Other branches (e.g. `landing-iso-text`) are preview-only and do NOT update the live site.
- After merging changes, run: `git checkout main && git merge <branch> && git push origin main`

## Domain

- Live domain: `tonicforthebones.com`
- Old dead domains (do NOT use): `tonic.davidenker.com`, `www.davidenker.com`

## Cache busting

Shared JS files in `/js/` (especially `layout.js`) use `?v=YYYYMMDDHHMM` version strings.
Bump the version in every HTML file that references a changed JS file.
