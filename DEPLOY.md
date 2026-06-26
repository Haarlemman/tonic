# 🚀 Deployment — Tonic for the Bones

## Live site
**https://www.tonicforthebones.com**

## How deployment works

This project is hosted on **Vercel**, connected to the GitHub repo:
**https://github.com/Haarlemman/tonic**

### ⚠️ IMPORTANT: Production deploys from `main`

| Branch | Deploys to |
|---|---|
| `main` | ✅ **PRODUCTION** — tonicforthebones.com |
| `landing-iso-text` | Preview only (not live) |
| any other branch | Preview only (not live) |

**Always merge into `main` and push to actually go live.**

```bash
# Make changes on your working branch, then:
git checkout main
git merge landing-iso-text       # or whichever branch you worked on
git push origin main             # ← this triggers the live Vercel deploy
```

Vercel will auto-deploy within ~60 seconds of a push to `main`.

---

## Domain history
- Old (dead): `tonic.davidenker.com` / `www.davidenker.com`
- Current (live): `https://www.tonicforthebones.com`

## Cache busting
JS files use `?v=YYYYMMDDHHMM` query strings (e.g. `layout.js?v=202606261618`).
Bump the version number whenever you change a shared JS file like `js/layout.js`.
