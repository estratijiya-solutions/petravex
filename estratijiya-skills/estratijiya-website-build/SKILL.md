---
name: estratijiya-website-build
description: >
  Step-by-step EXECUTION checklist to take an Estratijiya client site from empty folder to
  live subdomain: scaffold F:\coding\{client-slug} → Tailwind setup → build page-by-page →
  GitHub repo → push → Coolify deploy on VPS 62.72.35.156 → live on estratijiyatest.online
  subdomain → footer-credit check → handoff. Command-level where useful, Windows/PowerShell.
  Triggers include "ابدأ بناء الموقع", "scaffold الموقع", "اعمل setup للمشروع", "انشر على
  Coolify", "deploy the site", "start building the site", "push to GitHub", "go live". Do NOT
  use this to PLAN scope/sitemap/pages — that is web-development-brief (run it first). Do NOT
  use for animation (web-animation-vanilla) or design direction (ui-ux-pro-max). This is the
  hands-on-keyboard execution runbook only.
---

# estratijiya-website-build

## Purpose
The runbook that ships a site once the brief (web-development-brief) and design direction
(ui-ux-pro-max) are set. Taif doesn't code — Claude Code runs these steps on Windows. Follow
in order; don't skip the footer-credit and language checks.

**Prereqs (confirm before step 1):**
- Brief approved (type, sitemap, pages) — from web-development-brief.
- **Language chosen: Arabic OR English** (ask if not yet decided — one language only).
- Design direction set — from ui-ux-pro-max.
- `{client-slug}` agreed (kebab-case).

---

## Deploy model (read first — it shapes every step)
**Pure static, CSS committed.** Tailwind is built **locally** (by Claude Code on Windows); the
**minified `dist/styles.css` is committed to git**. Coolify is a **dumb static file server — NO
build command runs on the server.** It just serves what's in the repo. Consequence: the
`dist/` folder is **tracked in git**, and the local Tailwind build is a **mandatory pre-push
step** (Step 4b) — forget it and the live site ships stale CSS.

**Tailwind via the standalone CLI binary (no Node).** Use the self-contained `tailwindcss.exe`
— it bundles its own runtime, so the project needs **no Node, no npm, no `package.json`, no
`node_modules`.** Cleaner for a commit-the-CSS static site.

## Step 1 — Clone the scaffold to `F:\coding\{client-slug}`
Don't scaffold from scratch — **copy the ready starter** at `F:\coding\_templates\static-site`:
```powershell
cd F:\coding
Copy-Item -Recurse .\_templates\static-site .\{client-slug}
cd .\{client-slug}
```
The scaffold already includes everything, copy-paste ready:
- `index.html` — meta + Open Graph + favicon links, `./dist/styles.css` link, the **mandatory
  footer credit baked in**, and commented-out GA4 / Meta Pixel / floating WhatsApp button.
- `privacy.html`, `terms.html` — UAE PDPL-aware stubs.
- `src/input.css` — Tailwind directives + `@layer` (reveal + word-mask helpers) + commented
  Arabic webfont import + reduced-motion media query.
- `tailwind.config.js` — content globs + `theme.extend` placeholder brand colors + fontFamily.
- `js/main.js` — reduced-motion guard + IntersectionObserver reveal + GSAP-ready hook.
- `.gitignore` (node_modules + `tailwindcss.exe` ignored; **`dist/` tracked**), `dist/.gitkeep`.
- `README.md` (per-project local-build + git + Coolify commands), `robots.txt`, `sitemap.xml`.

Then fill in (see the README checklist): replace `{{...}}` placeholders, set brand colors +
font, add `assets/` (favicon + `og-image.jpg`), **confirm the footer links to the real
Estratijiya URL**, and pick the language —
- **Arabic** (scaffold default): keep `<html lang="ar" dir="rtl">`, enable the Arabic font import.
- **English:** switch to `<html lang="en" dir="ltr">`, set an English font, translate copy.

One language only — confirm Arabic or English before filling content.

## Step 2 — Tailwind setup (standalone CLI binary, no Node)
Download the standalone Windows binary once per project (or keep one in PATH and skip):
```powershell
# Latest standalone CLI for Windows x64 → tailwindcss.exe in the project root
Invoke-WebRequest -Uri "https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-windows-x64.exe" -OutFile "tailwindcss.exe"
```
Generate the config:
```powershell
.\tailwindcss.exe init
```
`tailwind.config.js`:
```js
module.exports = {
  content: ["./**/*.html", "./src/**/*.js"],
  theme: { extend: {} },
  plugins: [],
};
```
`src/input.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Watch while building (rebuilds `dist/styles.css` on every save):
```powershell
.\tailwindcss.exe -i ./src/input.css -o ./dist/styles.css --watch
```
Link `dist/styles.css` in every HTML `<head>`.

> `tailwindcss.exe` is git-ignored (it's a ~100MB binary, re-downloadable). Only the built
> `dist/styles.css` is committed. (If you ever prefer Node/npm, the equivalent is
> `npx tailwindcss -i ./src/input.css -o ./dist/styles.css --minify` — but the standalone
> binary is the default here precisely to drop Node.)

## Step 3 — Build page-by-page
- Build pages in sitemap order, **one at a time, verify in the browser preview before moving
  on** (use the preview workflow).
- Semantic HTML5; one `<h1>`/page; `alt` on every image; logical headings.
- Add motion only where the design calls for it → web-animation-vanilla (GSAP/CSS/IO), with
  `prefers-reduced-motion` honored.
- Optimize images (WebP/AVIF, sized, `loading="lazy"` below the fold, width/height set).
- Per-page `<title>` + meta description; Open Graph tags; favicon.
- **Footer on every page must include:** `مطوّر بـ استراتيجية` linking to the Estratijiya
  website (see Step 8 — it's a gate).
- Target: mobile < 3s, Lighthouse ≥ 90. Check before calling a page done.

## Step 4 — Production build & local check
Run the **minified** production build (this is what gets committed and served):
```powershell
.\tailwindcss.exe -i ./src/input.css -o ./dist/styles.css --minify
```
- Confirm `dist/styles.css` is minified/purged (small — only used classes).
- Open the built site; run Lighthouse (mobile). Fix until ≥ 90 across the board.
- Click every link/CTA; test the form/WhatsApp; check RTL/LTR flips correctly.

## Step 4b — MANDATORY pre-push build (every single push)
Because Coolify runs **no build** and just serves the repo, **`dist/styles.css` in git IS the
live CSS.** Before **every** `git push` — initial and all later changes — run the minified
build and commit the result, or the live site ships stale styles:
```powershell
.\tailwindcss.exe -i ./src/input.css -o ./dist/styles.css --minify   # rebuild
git add -A                                                            # stage incl. dist/
git commit -m "..."                                                  # commit built CSS
git push                                                              # → Coolify auto-deploys
```
Make this a reflex: **edit → rebuild minified → commit → push.** Never push HTML/class changes
without rebuilding the CSS first.

## Step 5 — GitHub repo (one per project)
```powershell
.\tailwindcss.exe -i ./src/input.css -o ./dist/styles.css --minify
git init
git add .
git commit -m "Initial build: {client-slug} site"
gh repo create {client-slug} --private --source=. --remote=origin --push
```
Confirm `dist/styles.css` is in the commit (`git ls-files dist/`) — it MUST be tracked.
(If `gh` isn't set up, create the repo on GitHub, then:)
```powershell
git remote add origin https://github.com/<account>/{client-slug}.git
git branch -M main
git push -u origin main
```

## Step 6 — Coolify deploy (VPS 62.72.35.156) — STATIC, no build
1. In Coolify → **New Resource → Application → from the GitHub repo** ({client-slug}).
2. Build pack: **Static**. **Leave the build command EMPTY — no `npm`, no Tailwind on the
   server.** Coolify only serves files (it ships a static web server / Nginx for the repo).
3. **Publish/output directory = the repo root** (the folder containing `index.html`,
   `dist/styles.css`, and `assets/`). Do not point it at a build output — there is no build.
4. Enable **auto-deploy on push** (webhook) so `git push` → live (it redeploys the committed
   files, including the already-built `dist/styles.css`).
5. Domain: set the FQDN `{client-slug}.estratijiyatest.online` (ensure DNS for the subdomain
   points to 62.72.35.156; wildcard `*.estratijiyatest.online` → VPS makes this instant).
6. Deploy. The log should show only file sync/serve — **no build step**. Watch it to green.

## Step 7 — Verify subdomain is live
- Open `https://{client-slug}.estratijiyatest.online`.
- Confirm HTTPS (Coolify/Let's Encrypt cert issued), all pages load, assets/CSS resolve.
- Re-run mobile Lighthouse on the live URL.
- Test a `git push` → confirm auto-deploy fires and the change appears.

## Step 8 — Footer credit check (GATE — do not skip)
- Every page footer shows **`مطوّر بـ استراتيجية`** as a link to the Estratijiya website.
- Link works, opens correctly, styled to fit. No page ships without it.

## Step 9 — Handoff
- Send: live subdomain URL, repo access (if client gets it), and a short
  "how to request changes" note.
- Record in Notion/ClickUp: slug, repo, subdomain, language, launch date, deploy = Coolify
  auto-deploy on push.
- When moving to the client's real domain: point DNS, add the domain in Coolify, re-issue
  cert, verify.
- Translation/second language = a **separate later phase**, not part of this build.

---

## HARD RULES
- **Run web-development-brief first** (scope) — this skill is execution only.
- **One language only at launch — confirm Arabic or English before scaffolding.**
- **Stack: Static HTML + Tailwind + Vanilla JS.** No frameworks (WordPress is the brief's
  flagged exception, not this runbook).
- **Path `F:\coding\{client-slug}`, one GitHub repo, Coolify on 62.72.35.156, auto-deploy to
  `{client-slug}.estratijiyatest.online`.**
- **Pure static: Coolify runs NO build command** — it only serves the committed files.
- **`dist/` is TRACKED in git** (the minified CSS is committed); `node_modules` and
  `tailwindcss.exe` are git-ignored.
- **Build Tailwind locally with the standalone `tailwindcss.exe` (no Node/npm).**
- **MANDATORY before EVERY push: rebuild minified CSS → commit `dist/` → push.** No exceptions
  — the committed `dist/styles.css` IS the live stylesheet, so a stale build = a broken site.
- **Footer credit `مطوّر بـ استراتيجية` → Estratijiya site, on every page (Step 8 gate).**
- **Acceptance: mobile < 3s, Lighthouse ≥ 90** before handoff.
- **Verify each page in preview before the next**; verify the live URL after deploy.
- Windows/PowerShell syntax for all local commands.

## EXAMPLE TRIGGERS
- "ابدأ بناء موقع [client]" / "start building the [client] site"
- "اعمل scaffold للمشروع" / "scaffold the project folder"
- "setup Tailwind" / "set up the Tailwind build"
- "ادفع على GitHub" / "push this to GitHub"
- "انشر على Coolify" / "deploy on Coolify"
- "خلي الموقع live على الـ subdomain" / "get it live on the subdomain"
- "جهّزه للتسليم" / "prep for client handoff"
