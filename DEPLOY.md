# 🚀 Deployment — Tonic for the Bones

## Live sites

| Path | URL | Host |
|---|---|---|
| `/` (root) | **https://www.tonicforthebones.com** | Vercel |
| `/house/` | **https://house-of-awe.web.app** | Firebase |

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

## `/house/` — Firebase (House of Awe)

- Live URL: **https://house-of-awe.web.app**
- Hosted on **Firebase Hosting** (separate from Vercel)
- Deploy with the Firebase CLI from the `/house/` directory:

```bash
cd house
firebase deploy
```

Changes to `/house/` do **not** auto-deploy via Vercel — you must run `firebase deploy` manually.

---

## Domain history
- Old (dead): `tonic.davidenker.com` / `www.davidenker.com`
- Current (live): `https://www.tonicforthebones.com`

## Cache busting
JS files use `?v=YYYYMMDDHHMM` query strings (e.g. `layout.js?v=202606261618`).
Bump the version number whenever you change a shared JS file like `js/layout.js`.
