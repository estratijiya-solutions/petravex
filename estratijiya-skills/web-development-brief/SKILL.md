---
name: web-development-brief
description: >
  Plan and scope a client website BEFORE building — website type, sitemap, page sections,
  SEO, performance targets, RTL/language rules, UAE legal pages — and lock the Estratijiya
  build standard (Static HTML + Tailwind + Vanilla JS, F:\coding\{client-slug}, GitHub +
  Coolify on VPS 62.72.35.156, auto-deploy to estratijiyatest.online, Arabic footer credit,
  one-language-first). Triggers include "اعمل brief لموقع", "خطة موقع", "sitemap للعميل",
  "صفحات الموقع", "website brief", "plan a website", "site structure", "what pages does this
  client need", "scope this site". Do NOT use this to actually WRITE the HTML/CSS/JS — that
  is the build itself. Do NOT use for animation execution (web-animation-vanilla) or visual
  design direction (ui-ux-pro-max). Use this to produce the spec the build follows.
---

# web-development-brief

## Purpose
Turn a client's vague "I need a website" into a locked, buildable spec: which type of site,
what pages, what's on each page, how it ranks, how fast it must be, what language, what legal
pages, and exactly how it gets built and deployed on the Estratijiya standard. Output is a
brief — not code. The build then follows it.

**Process order:** ui-ux-pro-max (design direction) → this brief (scope + structure) →
build page-by-page → web-animation-vanilla (motion) → impeccable (polish) → deploy.

---

## 1. Pick the website type (3 types)

| Type | What it is | When | Typical page count |
|---|---|---|---|
| **One-pager / landing** | Single scrolling page, one goal (lead or sale) | new offer, single service, campaign, validation | 1 (+ thank-you) |
| **Brochure / company site** | Multi-page presence: who/what/proof/contact | most SMEs, service businesses, distributors | 4–8 |
| **Content / catalog site** | Many pages that change often (blog, product catalog) | content-heavy, frequent self-editing | 8+ and growing |

Decision: if there's one action and one audience → one-pager. If the client needs to be
*found and trusted* across services → brochure. If pages multiply and the client must edit
weekly → content site (this is the one WordPress exception, see §6).

---

## 2. Sitemap patterns per client type

**A. Service business** (clinic, salon, agency, contractor)
`Home → Services (or per-service pages) → About → Results/Gallery → Contact (+ booking/WhatsApp)`

**B. Product / distribution** (importer, distributor, FMCG like BoluPınar)
`Home → Products/Catalog → Why us / Quality → Distribution / Where to buy → About → Contact`

**C. B2B industrial** (manufacturer, building materials like Petravex divisions)
`Home → Divisions/Capabilities → Products & Specs → Projects/Track record → Quality & Certifications → Careers → Contact`

**D. Consultancy** (Estratijiya itself, advisory firms)
`Home → Services/Approach → Case studies → About/Team → Insights (optional) → Contact`

Adapt, don't bloat. Every page must earn its place with a job (rank, convince, convert,
inform). If a page has no job, fold it into another.

---

## 3. Homepage sections framework
Order top to bottom (drop what doesn't apply):
1. **Hero** — one-line value proposition + primary CTA + supporting visual.
2. **Trust strip** — logos, stats, certifications, or a one-line proof.
3. **What we do** — services/products in 3–6 cards.
4. **Why us / differentiator** — the real reason to choose them (not "quality & trust").
5. **Proof** — case studies, results, testimonials, projects.
6. **Process / how it works** — 3–4 steps (reduces friction).
7. **Secondary CTA band** — repeat the ask mid-page.
8. **FAQ** — kills objections, helps SEO.
9. **Final CTA + Contact** — form / WhatsApp / phone, map if local.
10. **Footer** — nav, contact, socials, legal links, **mandatory Estratijiya credit** (§5).

---

## 4. Landing-page structure (one-pager / campaign)
1. Hero: promise + single CTA (above the fold).
2. Problem → agitation (name the pain).
3. Solution / offer (what they get).
4. Benefits (outcomes, not features).
5. Proof (testimonials, numbers, before/after).
6. Offer details + pricing/packages (if shown).
7. Risk reversal (guarantee, free consult).
8. FAQ.
9. Final CTA — same single action, repeated.
One goal, one action, repeated 2–3 times. No nav distractions, no competing CTAs.

---

## 5. BUILD & DEPLOY STANDARD (Estratijiya — firm, no alternatives offered to client)

This is how every Estratijiya site is built and shipped. Encode it in the brief.

- **Stack:** Static HTML + Tailwind CSS + Vanilla JS. No frameworks. (See §6.)
- **Tailwind = standalone CLI binary (`tailwindcss.exe`)** — no Node, no npm, no
  `package.json`, no `node_modules`.
- **Start from the scaffold (build Step 1):** don't hand-build the folder — **copy the ready
  starter at `F:\coding\_templates\static-site` to `F:\coding\{client-slug}`**, then fill
  content + brand only. (Scaffold ships index/privacy/terms, Tailwind config, reveal JS,
  `.gitignore`, README, robots/sitemap, and the footer credit baked in.)
- **Local path:** `F:\coding\{client-slug}` — one folder per client, kebab-case slug.
- **Version control:** ONE GitHub repo per project.
- **Pure-static deploy model:** Tailwind is built **locally**; the **minified
  `dist/styles.css` is COMMITTED to git** (so `dist/` is tracked); **Coolify only SERVES the
  files — NO build step on the server.** The committed CSS IS the live stylesheet, so rebuild
  minified before every push.
- **Deploy:** Coolify on my VPS **62.72.35.156**, build pack **Static** with an **empty build
  command**, publish dir = repo root, **auto-deploy on push** to a subdomain on
  **estratijiyatest.online** (e.g. `{client-slug}.estratijiyatest.online`) for review, then
  the client domain at launch.
- **Footer credit (mandatory, every site):** `مطوّر بـ استراتيجية` linking to the
  Estratijiya website. Never ship a site without it.
- **One language first:** every site launches in ONE language. **Always ask the client
  Arabic OR English first.** Translation/bilingual is a separate later phase — never build
  bilingual from day one.
- **Handoff:** working subdomain + repo access + a short "how to request changes" note.

(For the step-by-step command-level build → deploy run, use the companion checklist skill
`estratijiya-website-build`.)

---

## 6. Tech stack (DEFAULT + the one exception)

**DEFAULT — no alternatives offered to the client:**
> **Static HTML + Tailwind CSS + Vanilla JS.**
Fast, cheap to host, secure (no DB/plugins to hack), trivial to deploy on Coolify, and gives
full control over design and animation. This is what we build. We do not present a menu of
stacks to clients.

**The ONLY allowed exception — WordPress:**
Use WordPress *only* for **content-heavy clients who must self-edit frequently** (a real
blog/news cadence, a large catalog the client updates weekly without us). This is a flagged
exception, decided deliberately — **never a default and never offered as "an option" up
front.** If a client merely *might* want to edit text someday, that is NOT a reason; small
edits go through us. Flag the exception explicitly in the brief with the reason.

**Explicitly NOT used:** React, Vue, Next.js, Webflow, Framer (as a site builder), Wix,
Squarespace, or PaaS like Vercel/Netlify/SiteGround — our deploy path is Coolify on our own
VPS.

---

## 7. SEO basics (bake into the build)
- One `<h1>` per page; logical `h2/h3` hierarchy.
- Unique `<title>` (≤60 chars) and meta description (≤155) per page.
- Semantic HTML5 (`header/nav/main/section/article/footer`), descriptive `alt` on every image.
- Clean URLs, one canonical per page, `sitemap.xml` + `robots.txt`.
- Open Graph + Twitter card tags for sharing.
- Schema.org JSON-LD: `LocalBusiness`/`Organization` (+ `Service`, `Product`, `FAQPage`,
  `BreadcrumbList` as relevant).
- Local SEO for UAE: NAP consistency, Google Business Profile, city/area keywords.
- Arabic SEO: target Arabic keywords directly; don't rely on auto-translation.
- Performance is an SEO factor — see §8.

---

## 8. Performance benchmarks (acceptance criteria)
- **Mobile load < 3s** on a mid-tier device / 4G.
- **Lighthouse ≥ 90** Performance, Accessibility, Best Practices, SEO.
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Images: modern formats (WebP/AVIF), correctly sized, `loading="lazy"` below the fold,
  explicit width/height to prevent layout shift.
- Tailwind: run the CLI with content purge so production CSS is minimal.
- Defer non-critical JS; load animation libs (GSAP/Lottie) only on pages that use them.
- Self-host or `preconnect` fonts; subset where possible.
A site that misses these is not done.

---

## 9. RTL / language rules
- **One language at launch** (Arabic or English — ask first). §5.
- Arabic site: `<html lang="ar" dir="rtl">`; use Tailwind logical utilities
  (`ps-/pe-/ms-/me-`, `text-start/text-end`) so layout flips cleanly; pick a proper Arabic
  webfont (e.g. Tajawal, Cairo, IBM Plex Sans Arabic) — never render Arabic in a Latin font.
- English site: `<html lang="en" dir="ltr">`.
- When bilingual is approved later (separate phase): one canonical structure, a language
  switcher, `hreflang` tags, mirrored RTL/LTR layouts, and translated (not machine-dumped)
  copy. Do not retrofit this on day one.

---

## 10. UAE legal pages (include as standard)
- **Privacy Policy** — PDPL-aware (UAE Federal Decree-Law 45/2021): what data is collected,
  why, cookies, contact for data requests.
- **Terms of Service / Terms of Use.**
- **Cookie notice/consent** if any analytics/tracking is used.
- For e-commerce/transactions: Refund/Return & Shipping/Delivery policies.
- Accurate business contact + (where applicable) trade license details in the footer.
- These are templates to be reviewed for the client's specifics — flag that they are not
  legal advice.

---

## HARD RULES
- **Stack is Static HTML + Tailwind + Vanilla JS — DEFAULT, no alternatives offered.**
- **WordPress is the ONLY exception**, for content-heavy self-editing clients, flagged
  explicitly with a reason — never a default.
- **One language at launch — ALWAYS ask Arabic or English first.** Bilingual is a later phase.
- **`F:\coding\{client-slug}` (copy the `_templates\static-site` scaffold) + one GitHub repo +
  Coolify on 62.72.35.156 → auto-deploy to a `estratijiyatest.online` subdomain.**
- **Pure-static deploy:** Tailwind built locally via the standalone `tailwindcss.exe`; minified
  `dist/styles.css` is COMMITTED (tracked); Coolify build command is EMPTY — it only serves.
- **Mandatory footer credit `مطوّر بـ استراتيجية` linking to Estratijiya — on every site.**
- **Targets are acceptance criteria:** mobile < 3s, Lighthouse ≥ 90. Not aspirational.
- **Every page must have a job.** No filler pages.
- This skill produces the BRIEF/spec, not the code. Pair with ui-ux-pro-max (design) and
  `estratijiya-website-build` (execution).

## EXAMPLE TRIGGERS
- "اعمل brief لموقع [client]" / "plan a website for this client"
- "شو الصفحات اللي بدها" / "what pages does this client need"
- "اعمل sitemap" / "site structure / sitemap"
- "scope هالموقع" / "scope this site before we build"
- "شو أقسام الـ homepage" / "homepage sections for this client"
- "بدنا landing page لحملة" / "landing page structure for a campaign"
- "WordPress ولا static؟" / "should this be WordPress or static?" → apply §6.
- "صفحات قانونية للموقع" / "UAE legal pages we need"
